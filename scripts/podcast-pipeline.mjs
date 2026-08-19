import { createHash } from 'node:crypto';
import { createReadStream, createWriteStream, existsSync } from 'node:fs';
import { access, mkdir, readFile, readdir, rename, stat, writeFile } from 'node:fs/promises';
import { spawn } from 'node:child_process';
import { homedir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { Readable } from 'node:stream';
import { pipeline } from 'node:stream/promises';
import { fileURLToPath } from 'node:url';

const SITE_DIR = fileURLToPath(new URL('..', import.meta.url));
const PROJECT_DIR = dirname(SITE_DIR);
const BLOG_DIR = join(SITE_DIR, 'src', 'content', 'blog');
const TRANSCRIPT_DIR = join(PROJECT_DIR, '各集逐字稿');
const AUTOMATION_DIR = process.env.PODCAST_AUTOMATION_DIR ?? join(PROJECT_DIR, 'podcast-automation');
const AUDIO_DIR = join(AUTOMATION_DIR, 'audio');
const METADATA_DIR = join(AUTOMATION_DIR, 'metadata');
const MODEL_DIR = join(AUTOMATION_DIR, 'models');
const STATE_FILE = join(AUTOMATION_DIR, 'state.json');
const RSS_URL = process.env.PODCAST_RSS_URL ?? 'https://feeds.soundon.fm/podcasts/77af8789-ee40-4dd4-94b9-35c32ed1a46a.xml';
// 日常批次固定沿用 Memo AI 的 Small；EP2 曾用 Large 完成，不需重跑。
const MODEL_NAME = 'ggml-small.bin';
const MEMO_MODEL_PATH = join(homedir(), 'Library', 'Application Support', 'Memo', 'models', MODEL_NAME);
const MODEL_PATH = process.env.PODCAST_WHISPER_MODEL ?? (existsSync(MEMO_MODEL_PATH) ? MEMO_MODEL_PATH : join(MODEL_DIR, MODEL_NAME));
const MODEL_URL = `https://huggingface.co/ggerganov/whisper.cpp/resolve/main/${MODEL_NAME}`;
const MODEL_SHA1 = '55356645c2b361a969dfd0ef2c5a50d530afd8d5';
const PUBLIC_HOSTS = '柏文、孝成、博志、沁儒';
const GLOSSARY_PATH = join(SITE_DIR, 'docs', 'KB2_人名與專有名詞對照表.md');
const REQUIRED_GLOSSARY_NAMES = ['柏文', '孝成', '博志', '沁儒', '吳英彰'];

const rawArgs = process.argv.slice(2);
const command = rawArgs[0] ?? 'status';
const options = parseOptions(rawArgs.slice(1));

function parseOptions(args) {
	const result = {};
	for (const argument of args) {
		if (!argument.startsWith('--')) continue;
		const [key, ...rest] = argument.slice(2).split('=');
		result[key] = rest.length ? rest.join('=') : true;
	}
	return result;
}

function decodeXml(value = '') {
	return value
		.replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1')
		.replace(/&amp;/g, '&')
		.replace(/&lt;/g, '<')
		.replace(/&gt;/g, '>')
		.replace(/&quot;/g, '"')
		.replace(/&#39;|&apos;/g, "'")
		.trim();
}

function readTag(block, tag) {
	const match = block.match(new RegExp(`<${tag}(?:\\s[^>]*)?>([\\s\\S]*?)</${tag}>`, 'i'));
	return match ? decodeXml(match[1]) : '';
}

function readAttribute(block, tag, attribute) {
	const match = block.match(new RegExp(`<${tag}\\b[^>]*\\b${attribute}=(['"])(.*?)\\1`, 'i'));
	return match ? decodeXml(match[2]) : '';
}

export function episodeNumber(value = '') {
	return Number.parseInt(value.match(/\bEP\s*0*(\d+)\b/i)?.[1] ?? value, 10);
}

export function parseRss(xml) {
	return [...xml.matchAll(/<item(?:\s[^>]*)?>([\s\S]*?)<\/item>/gi)]
		.map((match) => {
			const block = match[1];
			const title = readTag(block, 'title');
			const number = episodeNumber(readTag(block, 'itunes:episode') || title);
			return {
				episodeNumber: number,
				episode: `EP${number}`,
				title,
				publishedAt: readTag(block, 'pubDate'),
				description: readTag(block, 'description'),
				duration: readTag(block, 'itunes:duration'),
				guid: readTag(block, 'guid'),
				soundon: readTag(block, 'link'),
				coverImage: readAttribute(block, 'itunes:image', 'href'),
				audioUrl: readAttribute(block, 'enclosure', 'url'),
				audioType: readAttribute(block, 'enclosure', 'type'),
			};
		})
		.filter((item) => Number.isInteger(item.episodeNumber) && item.audioUrl)
		.sort((left, right) => left.episodeNumber - right.episodeNumber);
}

export function normalizeTranscriptText(content) {
	const replacements = [
		[/博文/g, '柏文'],
		[/(?:博智|柏智)/g, '博志'],
		[/(?:孝晨|孝誠|孝承|校成|夏晨)/g, '孝成'],
		[/沁如/g, '沁儒'],
		[/吳英章/g, '吳英彰'],
		[/(?:新世界直男戰士|新世紀指南戰士)/g, '新世紀直男戰士'],
		[/A{1,2}(?:智慧|智會|製)/gi, 'AA制'],
	];
	return replacements.reduce((result, [pattern, replacement]) => result.replace(pattern, replacement), content);
}

/**
 * 讀取 Podcast 產線共用的人名與專有名詞對照表，並確認四位主持人與已校正的人名仍在表內。
 */
export async function loadGlossary() {
	const glossary = await readFile(GLOSSARY_PATH, 'utf8');
	const missingNames = REQUIRED_GLOSSARY_NAMES.filter((name) => !glossary.includes(name));
	if (missingNames.length) {
		throw new Error(`KB2 對照表缺少必要名稱：${missingNames.join('、')}（${GLOSSARY_PATH}）`);
	}
	return glossary;
}

function buildTranscriptionPrompt(episode, glossary) {
	const glossaryRows = glossary
		.split(/\r?\n/)
		.filter((line) => line.startsWith('| **'))
		.join('\n');
	return `《新世紀直男戰士》Podcast，臺灣繁體中文。固定主持人是${PUBLIC_HOSTS}。\n` +
		`以下是 KB2 人名與專有名詞對照表，請用來提高辨識準確度；只有發音與上下文都吻合時才採用正確寫法，不能把可能是真實人物或一般名詞的錯字無腦替換。\n` +
		`${glossaryRows}\n本集標題：${episode.title}`;
}

async function exists(path) {
	try {
		await access(path);
		return true;
	} catch {
		return false;
	}
}

async function fetchEpisodes() {
	const response = await fetch(RSS_URL, { headers: { 'user-agent': 'new-era-boysss-local-pipeline/1.0' } });
	if (!response.ok) throw new Error(`RSS 讀取失敗：${response.status} ${response.statusText}`);
	const episodes = parseRss(await response.text());
	if (!episodes.length) throw new Error('RSS 中找不到含音檔的單集。');
	return episodes;
}

async function existingArticleNumbers() {
	const files = (await readdir(BLOG_DIR)).filter((file) => /\.mdx?$/.test(file));
	const numbers = new Set();
	for (const file of files) {
		const content = await readFile(join(BLOG_DIR, file), 'utf8');
		const episode = content.match(/^episode:\s*['"]?(EP\s*\d+)/im)?.[1];
		const number = episodeNumber(episode ?? file);
		if (Number.isInteger(number)) numbers.add(number);
	}
	return numbers;
}

async function existingTranscripts() {
	await mkdir(TRANSCRIPT_DIR, { recursive: true });
	const files = (await readdir(TRANSCRIPT_DIR)).filter((file) => /\.srt$/i.test(file));
	const transcripts = new Map();
	for (const file of files) {
		const number = episodeNumber(file);
		if (Number.isInteger(number) && !transcripts.has(number)) transcripts.set(number, join(TRANSCRIPT_DIR, file));
	}
	return transcripts;
}

async function readState() {
	if (!(await exists(STATE_FILE))) return null;
	return JSON.parse(await readFile(STATE_FILE, 'utf8'));
}

async function writeState(state) {
	await mkdir(AUTOMATION_DIR, { recursive: true });
	await writeFile(STATE_FILE, `${JSON.stringify(state, null, 2)}\n`, 'utf8');
}

async function initialize() {
	if (await exists(STATE_FILE)) {
		console.log(`已有狀態檔：${STATE_FILE}`);
		return;
	}
	const episodes = await fetchEpisodes();
	const latest = episodes.at(-1);
	await writeState({
		version: 1,
		initializedAt: new Date().toISOString(),
		baselineEpisode: latest.episodeNumber,
		baselineGuid: latest.guid,
		feedUrl: RSS_URL,
	});
	console.log(`已建立基準：目前最新為 ${latest.episode}，未來只把更大的集數視為新集數。`);
}

async function queue(mode, limit) {
	const [episodes, articles, transcripts, state] = await Promise.all([
		fetchEpisodes(),
		existingArticleNumbers(),
		existingTranscripts(),
		readState(),
	]);
	if (mode === 'new' && !state) throw new Error('尚未初始化新集數基準，請先執行 npm run podcast:init。');
	const selected = episodes
		.filter((item) => !articles.has(item.episodeNumber))
		.filter((item) => mode === 'new' ? item.episodeNumber > state.baselineEpisode : item.episodeNumber >= 2)
		.slice(0, limit)
		.map((item) => ({
			episodeNumber: item.episodeNumber,
			episode: item.episode,
			title: item.title,
			publishedAt: item.publishedAt,
			duration: item.duration,
			guid: item.guid,
			soundon: item.soundon,
			coverImage: item.coverImage,
			transcriptPath: transcripts.get(item.episodeNumber) ?? null,
			needsTranscription: !transcripts.has(item.episodeNumber),
		}));
	return selected;
}

function episodeFromOption(episodes) {
	const number = Number.parseInt(String(options.episode ?? ''), 10);
	if (!Number.isInteger(number)) throw new Error('請提供集數，例如 --episode=2。');
	const episode = episodes.find((item) => item.episodeNumber === number);
	if (!episode) throw new Error(`RSS 找不到 EP${number}。`);
	return episode;
}

function audioPath(episode) {
	return join(AUDIO_DIR, `EP${episode.episodeNumber}.mp3`);
}

function transcriptBasePath(episode) {
	return join(TRANSCRIPT_DIR, `EP${episode.episodeNumber} 自動轉錄`);
}

async function saveMetadata(episode) {
	await mkdir(METADATA_DIR, { recursive: true });
	const path = join(METADATA_DIR, `ep${episode.episodeNumber}.json`);
	await writeFile(path, `${JSON.stringify(episode, null, 2)}\n`, 'utf8');
	return path;
}

async function downloadAudio(episode) {
	await mkdir(AUDIO_DIR, { recursive: true });
	const destination = audioPath(episode);
	if (await exists(destination)) {
		const info = await stat(destination);
		if (info.size > 1024 * 1024) return destination;
		throw new Error(`${destination} 已存在但檔案過小，請先移到可刪除封存後再重試。`);
	}
	const temporary = `${destination}.download`;
	if (await exists(temporary)) throw new Error(`${temporary} 是先前未完成的下載，請先移到可刪除封存後再重試。`);
	const response = await fetch(episode.audioUrl);
	if (!response.ok || !response.body) throw new Error(`音檔下載失敗：${response.status} ${response.statusText}`);
	const contentType = response.headers.get('content-type') ?? '';
	if (!contentType.includes('audio') && !contentType.includes('octet-stream')) {
		throw new Error(`RSS 回傳的不是音檔：${contentType || '未知格式'}`);
	}
	await pipeline(Readable.fromWeb(response.body), createWriteStream(temporary, { flags: 'wx' }));
	const info = await stat(temporary);
	if (info.size < 1024 * 1024) throw new Error(`下載音檔過小：${info.size} bytes`);
	await rename(temporary, destination);
	return destination;
}

async function run(commandName, args) {
	await new Promise((resolve, reject) => {
		// Whisper 會把完整逐字稿印到 stdout；檔案已有 SRT/JSON 輸出，排程紀錄不需再複製一次。
		const child = spawn(commandName, args, { stdio: ['ignore', 'ignore', 'inherit'] });
		child.once('error', reject);
		child.once('exit', (code) => code === 0 ? resolve() : reject(new Error(`${commandName} 結束碼 ${code}`)));
	});
}

async function transcribe(episode, audio, glossary) {
	const transcripts = await existingTranscripts();
	if (transcripts.has(episode.episodeNumber)) return transcripts.get(episode.episodeNumber);
	if (!(await exists(MODEL_PATH))) throw new Error(`找不到 Whisper 模型：${MODEL_PATH}\n請先執行 npm run podcast:download-model。`);
	const basePath = transcriptBasePath(episode);
	const prompt = buildTranscriptionPrompt(episode, glossary);
	await run('whisper-cli', [
		'--model', MODEL_PATH,
		'--language', 'zh',
		'--threads', '8',
		'--output-srt',
		'--output-json',
		'--output-file', basePath,
		'--prompt', prompt,
		'--file', audio,
	]);
	const output = `${basePath}.srt`;
	if (!(await exists(output))) throw new Error(`Whisper 沒有產生預期逐字稿：${output}`);
	await normalizeTranscript(output);
	return output;
}

async function normalizeTranscript(path) {
	const content = await readFile(path, 'utf8');
	const normalized = normalizeTranscriptText(content);
	if (normalized !== content) await writeFile(path, normalized, 'utf8');
	return path;
}

async function prepareEpisode(episode) {
	const glossary = await loadGlossary();
	const metadata = await saveMetadata(episode);
	const transcripts = await existingTranscripts();
	if (transcripts.has(episode.episodeNumber)) {
		const transcript = await normalizeTranscript(transcripts.get(episode.episodeNumber));
		return { episode: episode.episode, metadata, audio: null, transcript, glossary: GLOSSARY_PATH, reusedTranscript: true };
	}
	const audio = await downloadAudio(episode);
	const transcript = await transcribe(episode, audio, glossary);
	return { episode: episode.episode, metadata, audio, transcript, glossary: GLOSSARY_PATH, reusedTranscript: false };
}

async function sha1(path) {
	const hash = createHash('sha1');
	for await (const chunk of createReadStream(path)) hash.update(chunk);
	return hash.digest('hex');
}

async function downloadModel() {
	await mkdir(dirname(MODEL_PATH), { recursive: true });
	if (await exists(MODEL_PATH)) {
		const checksum = await sha1(MODEL_PATH);
		if (checksum !== MODEL_SHA1) throw new Error(`模型檔已存在但校驗失敗：${MODEL_PATH}`);
		console.log(`Whisper 模型已就緒：${MODEL_PATH}`);
		return;
	}
	const temporary = `${MODEL_PATH}.download`;
	if (await exists(temporary)) throw new Error(`${temporary} 是先前未完成的下載，請先移到可刪除封存後再重試。`);
	console.log('開始下載 Whisper Small 模型（約 466 MiB）…');
	const response = await fetch(MODEL_URL, { redirect: 'follow' });
	if (!response.ok || !response.body) throw new Error(`模型下載失敗：${response.status} ${response.statusText}`);
	await pipeline(Readable.fromWeb(response.body), createWriteStream(temporary, { flags: 'wx' }));
	const checksum = await sha1(temporary);
	if (checksum !== MODEL_SHA1) throw new Error(`模型校驗失敗：預期 ${MODEL_SHA1}，實際 ${checksum}`);
	await rename(temporary, MODEL_PATH);
	console.log(`Whisper 模型已就緒：${MODEL_PATH}`);
}

async function showStatus() {
	const [episodes, articles, transcripts, state] = await Promise.all([
		fetchEpisodes(), existingArticleNumbers(), existingTranscripts(), readState(),
	]);
	const latest = episodes.at(-1);
	const backlog = episodes.filter((item) => item.episodeNumber >= 2 && !articles.has(item.episodeNumber));
	const result = {
		feedEpisodes: episodes.length,
		latestEpisode: latest.episode,
		existingArticles: [...articles].sort((a, b) => a - b).map((number) => `EP${number}`),
		localTranscripts: [...transcripts.keys()].sort((a, b) => a - b).map((number) => `EP${number}`),
		backlogCount: backlog.length,
		nextBacklog: backlog.slice(0, 2).map((item) => item.episode),
		baselineEpisode: state?.baselineEpisode ?? null,
		modelReady: await exists(MODEL_PATH),
	};
	console.log(JSON.stringify(result, null, 2));
}

async function main() {
	if (command === 'init') return initialize();
	if (command === 'status') return showStatus();
	if (command === 'download-model') return downloadModel();
	if (command === 'queue') {
		const mode = options.mode === 'new' ? 'new' : 'backfill';
		const limit = Math.max(1, Math.min(10, Number.parseInt(String(options.limit ?? '2'), 10) || 2));
		console.log(JSON.stringify(await queue(mode, limit), null, 2));
		return;
	}
	if (command === 'prepare') {
		const episodes = await fetchEpisodes();
		console.log(JSON.stringify(await prepareEpisode(episodeFromOption(episodes)), null, 2));
		return;
	}
	if (command === 'normalize') {
		await loadGlossary();
		const episode = episodeFromOption(await fetchEpisodes());
		const transcripts = await existingTranscripts();
		const transcript = transcripts.get(episode.episodeNumber);
		if (!transcript) throw new Error(`找不到 ${episode.episode} 的 SRT。`);
		console.log(await normalizeTranscript(transcript));
		return;
	}
	throw new Error(`未知指令：${command}`);
}

const isMain = process.argv[1] && fileURLToPath(import.meta.url) === resolve(process.argv[1]);
if (isMain) {
	main().catch((error) => {
		console.error(`Podcast 自動化失敗：${error.message}`);
		process.exitCode = 1;
	});
}
