import { getCollection } from 'astro:content';
import { SITE_DESCRIPTION, SITE_TITLE } from '../consts';

// llms-full.txt：給 AI 的「全文版」網站內容（llmstxt.org 慣例的 full 版本）。
// 和 llms.txt（只有標題+摘要+連結）不同，這裡直接附上每篇文章的完整內文，
// 讓 AI 不必再逐一抓取就能理解、引用整站內容。建置時自動產生，新文章自動納入。

function episodeNumber(episode) {
	const match = /\d+/.exec(episode ?? '');
	return match ? Number(match[0]) : Number.POSITIVE_INFINITY;
}

export async function GET(context) {
	const base = (context.site?.href ?? 'https://new-era-boysss.pages.dev/').replace(/\/$/, '');
	const posts = (await getCollection('blog', ({ data }) => !data.draft)).sort(
		(a, b) => episodeNumber(a.data.episode) - episodeNumber(b.data.episode),
	);

	const parts = [];
	parts.push(`# ${SITE_TITLE}`);
	parts.push('');
	parts.push(`> ${SITE_DESCRIPTION}`);
	parts.push('');
	parts.push('以下為全站文章的完整內文（由每集 Podcast 對談整理而成）。每篇標明集數、網址與更新日期，內文為 Markdown 原文。');
	parts.push('');

	for (const post of posts) {
		const url = `${base}/blog/${post.id}/`;
		const d = post.data;
		parts.push('---');
		parts.push('');
		parts.push(`## ${d.episode ? d.episode + '｜' : ''}${d.title}`);
		parts.push('');
		parts.push(`- 網址：${url}`);
		if (d.description) parts.push(`- 摘要：${d.description}`);
		if (d.topics?.length) parts.push(`- 議題：${d.topics.join('、')}`);
		parts.push(`- 發布：${d.pubDate.toISOString().slice(0, 10)}${d.updatedDate ? `，更新：${d.updatedDate.toISOString().slice(0, 10)}` : ''}`);
		parts.push('');
		parts.push(post.body.trim());
		parts.push('');
	}

	return new Response(parts.join('\n'), {
		headers: { 'Content-Type': 'text/plain; charset=utf-8' },
	});
}
