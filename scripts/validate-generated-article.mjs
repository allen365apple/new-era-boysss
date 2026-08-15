import { readFile } from 'node:fs/promises';
import { basename } from 'node:path';

const TOPICS = new Set(['男性特權', '情感腳本', '性別凝視', '身份認同', '在地事件', '多元對話', '聽眾互動']);
const PUBLIC_HOSTS = new Set(['柏文', '孝成', '博志', '沁儒']);
const allowPublished = process.argv.includes('--allow-published');
const files = process.argv.slice(2).filter((value) => !value.startsWith('--'));

if (!files.length) {
	console.error('請指定要檢查的文章，例如：node scripts/validate-generated-article.mjs src/content/blog/ep2.md');
	process.exit(1);
}

function field(frontmatter, key) {
	return frontmatter.match(new RegExp(`^${key}:\\s*(.*)$`, 'm'))?.[1]?.trim().replace(/^['"]|['"]$/g, '') ?? '';
}

function listField(frontmatter, key) {
	const block = frontmatter.match(new RegExp(`^${key}:\\s*\\n((?:\\s+-.*(?:\\n|$))+)`, 'm'))?.[1] ?? '';
	return [...block.matchAll(/^\s+-\s+(.+)$/gm)].map((match) => match[1].trim().replace(/^['"]|['"]$/g, ''));
}

function paragraphs(section) {
	return section
		.split(/\n\s*\n/)
		.map((paragraph) => paragraph.trim())
		.filter(Boolean)
		.filter((paragraph) => !paragraph.startsWith('#') && !paragraph.startsWith('>') && !paragraph.startsWith('——'))
		.filter((paragraph) => paragraph.replace(/[*_`]/g, '').length >= 25);
}

function inspect(content, fileName) {
	const errors = [];
	const warnings = [];
	const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
	if (!match) return { errors: ['缺少正確的 frontmatter'], warnings };
	const [, frontmatter, body] = match;
	const required = ['title', 'description', 'pubDate', 'episode', 'episodeTitle', 'hosts'];
	for (const key of required) if (!field(frontmatter, key)) errors.push(`缺少 ${key}`);
	if (!allowPublished && field(frontmatter, 'draft') !== 'true') errors.push('自動產生文章必須維持 draft: true');
	if (field(frontmatter, 'aiGenerated') !== 'true') errors.push('aiGenerated 必須是 true');

	const topics = listField(frontmatter, 'topics');
	if (!topics.length || topics.length > 3) errors.push('topics 必須選 1–3 種');
	for (const topic of topics) if (!TOPICS.has(topic)) errors.push(`不允許的議題分類：${topic}`);

	const hosts = field(frontmatter, 'hosts').split(/[、,，/\s]+/).filter(Boolean);
	for (const host of hosts) if (!PUBLIC_HOSTS.has(host)) errors.push(`主持人只能使用公開暱稱：${host}`);

	const headings = [...body.matchAll(/^##\s+(.+)$/gm)];
	if (headings.length < 4 || headings.length > 5) errors.push(`H2 小節必須是 4–5 節，目前 ${headings.length} 節`);
	for (let index = 0; index < headings.length; index += 1) {
		const start = headings[index].index + headings[index][0].length;
		const end = headings[index + 1]?.index ?? body.length;
		const count = paragraphs(body.slice(start, end)).length;
		if (count < 2) errors.push(`「${headings[index][1]}」只有 ${count} 個正文段落，至少需要 2 個`);
	}

	const quoteCount = (body.match(/^>\s+/gm) ?? []).length;
	if (quoteCount < 3 || quoteCount > 4) errors.push(`金句引用必須是 3–4 句，目前 ${quoteCount} 句`);
	const textLength = body.replace(/[#>*_`\[\]()\s—「」『』，。！？：；、]/g, '').length;
	if (textLength < 1100) errors.push(`內文過短：約 ${textLength} 字，至少應接近 1200 字`);
	if (textLength > 1800) warnings.push(`內文約 ${textLength} 字，超過建議的 1200–1600 字`);

	const forbidden = ['綜上所述', '不難發現', '筆者認為', '賦能', '獲取', '視頻', '質量'];
	for (const word of forbidden) if (body.includes(word)) errors.push(`出現禁用詞：${word}`);
	if (/\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/i.test(content)) errors.push('疑似包含 Email');
	if (/(?:\+?886[-\s]?)?09\d{2}[-\s]?\d{3}[-\s]?\d{3}/.test(content)) errors.push('疑似包含手機號碼');
	if (/(?:路|街|大道).{0,12}\d{1,4}號/.test(content)) errors.push('疑似包含地址');
	if (/(?:api[_-]?key|client[_-]?secret|access[_-]?token)\s*[:=]\s*\S+/i.test(content)) errors.push('疑似包含 API 金鑰或 Token');
	if (/https?:\/\/(?:[^\s/]+\.)?slack\.com|docs\.google\.com\/spreadsheets/i.test(content)) errors.push('疑似包含內部系統網址');

	if (!/^EP\d+$/i.test(field(frontmatter, 'episode'))) errors.push('episode 格式必須像 EP2');
	if (!/^ep\d+\.mdx?$/i.test(fileName)) warnings.push('建議檔名使用 ep數字.md');
	return { errors, warnings, textLength, headings: headings.length, quoteCount };
}

let failed = false;
for (const file of files) {
	const result = inspect(await readFile(file, 'utf8'), basename(file));
	console.log(`${file}：${result.errors.length ? '未通過' : '通過'}（約 ${result.textLength ?? 0} 字、${result.headings ?? 0} 節、${result.quoteCount ?? 0} 句引用）`);
	for (const error of result.errors) console.error(`  錯誤：${error}`);
	for (const warning of result.warnings) console.warn(`  提醒：${warning}`);
	if (result.errors.length) failed = true;
}
if (failed) process.exitCode = 1;
