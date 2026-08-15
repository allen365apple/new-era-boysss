import { mkdir, readdir, readFile, writeFile } from 'node:fs/promises';
import { extname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT_DIR = fileURLToPath(new URL('..', import.meta.url));
const CONTENT_DIR = join(ROOT_DIR, 'src', 'content', 'blog');
const COVER_DIR = join(ROOT_DIR, 'src', 'assets', 'episode-covers');
const RSS_URL = process.env.PODCAST_RSS_URL ?? 'https://feeds.soundon.fm/podcasts/77af8789-ee40-4dd4-94b9-35c32ed1a46a.xml';
const APPLE_PODCAST_ID = process.env.APPLE_PODCAST_ID ?? '1732062544';
const SPOTIFY_SHOW_ID = process.env.SPOTIFY_SHOW_ID ?? '1BAWRDklXg5vdIUxMoPCkr';
const MARKET = process.env.PODCAST_MARKET ?? 'TW';
const args = new Set(process.argv.slice(2));
const shouldWrite = args.has('--write');
const includeDrafts = args.has('--include-drafts');

function decodeXml(value) {
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

function readTagAttribute(block, tag, attribute) {
	const match = block.match(new RegExp(`<${tag}\\b[^>]*\\b${attribute}=(['"])(.*?)\\1`, 'i'));
	return match ? decodeXml(match[2]) : '';
}

function parseRssItems(xml) {
	return [...xml.matchAll(/<item(?:\s[^>]*)?>([\s\S]*?)<\/item>/gi)].map((match) => {
		const block = match[1];
		const title = readTag(block, 'title');
		const episode = readTag(block, 'itunes:episode') || title.match(/\bEP\s*0*(\d+)\b/i)?.[1] || '';
		return {
			episodeNumber: Number.parseInt(episode, 10),
			title,
			soundon: readTag(block, 'link'),
			coverImage: readTagAttribute(block, 'itunes:image', 'href'),
		};
	}).filter((item) => Number.isInteger(item.episodeNumber) && item.soundon);
}

function frontmatterValue(frontmatter, key) {
	const match = frontmatter.match(new RegExp(`^${key}:\\s*(.*)$`, 'm'));
	if (!match) return '';
	return match[1].trim().replace(/^['"]|['"]$/g, '');
}

function episodeNumber(value) {
	return Number.parseInt(value.match(/\bEP\s*0*(\d+)\b/i)?.[1] ?? '', 10);
}

function normalizeTitle(value) {
	return value
		.toLowerCase()
		.replace(/\bep\s*\d+\b/gi, '')
		.replace(/[^\p{L}\p{N}]+/gu, '')
		.trim();
}

function titleSimilarity(left, right) {
	const a = normalizeTitle(left);
	const b = normalizeTitle(right);
	if (!a || !b) return 0;
	if (a === b) return 1;
	const shorter = a.length <= b.length ? a : b;
	const longer = a.length <= b.length ? b : a;
	let shared = 0;
	for (const character of shorter) {
		if (longer.includes(character)) shared += 1;
	}
	return shared / longer.length;
}

function parsePost(fileName, content) {
	const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---/);
	if (!match) return null;
	const frontmatter = match[1];
	return {
		fileName,
		content,
		frontmatter,
		episode: frontmatterValue(frontmatter, 'episode'),
		episodeTitle: frontmatterValue(frontmatter, 'episodeTitle'),
		title: frontmatterValue(frontmatter, 'title'),
		coverImage: frontmatterValue(frontmatter, 'coverImage'),
		draft: frontmatterValue(frontmatter, 'draft') === 'true',
	};
}

function matchEpisode(post, candidates) {
	const number = episodeNumber(post.episode);
	const numberMatches = candidates.filter((item) => item.episodeNumber === number);
	if (numberMatches.length === 1) return numberMatches[0];

	const ranked = candidates
		.map((item) => ({ item, score: titleSimilarity(post.episodeTitle || post.title, item.title || item.name) }))
		.sort((a, b) => b.score - a.score);
	const best = ranked[0];
	const second = ranked[1];
	if (best && best.score >= 0.82 && (!second || best.score - second.score >= 0.08)) return best.item;
	return null;
}

async function fetchJson(url, options = {}) {
	const response = await fetch(url, options);
	if (!response.ok) throw new Error(`${response.status} ${response.statusText}: ${url}`);
	return response.json();
}

async function fetchRssEpisodes() {
	const response = await fetch(RSS_URL);
	if (!response.ok) throw new Error(`RSS ${response.status} ${response.statusText}`);
	return parseRssItems(await response.text());
}

async function fetchAppleEpisodes() {
	const url = new URL('https://itunes.apple.com/lookup');
	url.searchParams.set('id', APPLE_PODCAST_ID);
	url.searchParams.set('entity', 'podcastEpisode');
	url.searchParams.set('limit', '200');
	url.searchParams.set('country', MARKET);
	const data = await fetchJson(url);
	return (data.results ?? [])
		.filter((item) => item.kind === 'podcast-episode' && item.trackViewUrl?.includes('?i='))
		.map((item) => ({
			episodeNumber: episodeNumber(item.trackName ?? ''),
			name: item.trackName ?? '',
			apple: item.trackViewUrl,
		}));
}

async function spotifyToken() {
	if (process.env.SPOTIFY_ACCESS_TOKEN) return process.env.SPOTIFY_ACCESS_TOKEN;
	const clientId = process.env.SPOTIFY_CLIENT_ID;
	const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
	if (!clientId || !clientSecret) return '';
	const credentials = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');
	const response = await fetch('https://accounts.spotify.com/api/token', {
		method: 'POST',
		headers: {
			Authorization: `Basic ${credentials}`,
			'Content-Type': 'application/x-www-form-urlencoded',
		},
		body: 'grant_type=client_credentials',
	});
	if (!response.ok) throw new Error(`Spotify token ${response.status} ${response.statusText}`);
	return (await response.json()).access_token ?? '';
}

async function fetchSpotifyEpisodes() {
	const token = await spotifyToken();
	if (!token) return { items: [], skipped: true };
	const items = [];
	let offset = 0;
	while (true) {
		const url = new URL(`https://api.spotify.com/v1/shows/${SPOTIFY_SHOW_ID}/episodes`);
		url.searchParams.set('market', MARKET);
		url.searchParams.set('limit', '50');
		url.searchParams.set('offset', String(offset));
		const data = await fetchJson(url, { headers: { Authorization: `Bearer ${token}` } });
		items.push(...(data.items ?? []).map((item) => ({
			episodeNumber: episodeNumber(item.name ?? ''),
			name: item.name ?? '',
			spotify: item.external_urls?.spotify,
		})));
		offset += data.items?.length ?? 0;
		if (!data.next || !data.items?.length || offset >= data.total) break;
	}
	return { items, skipped: false };
}

function isGenericLink(key, value) {
	if (!value) return true;
	if (key === 'soundon') return !value.includes('/episodes/');
	if (key === 'spotify') return value.includes('/show/');
	if (key === 'apple') return !value.includes('?i=');
	return false;
}

function updateListenLinks(frontmatter, updates) {
	const lines = frontmatter.split(/\r?\n/);
	let blockStart = lines.findIndex((line) => /^listenLinks:\s*$/.test(line));
	if (blockStart < 0) {
		const insertionPoint = Math.max(
			lines.findIndex((line) => /^episodeTitle:/.test(line)),
			lines.findIndex((line) => /^episode:/.test(line)),
		) + 1;
		lines.splice(insertionPoint, 0, 'listenLinks:', ...Object.entries(updates).map(([key, value]) => `  ${key}: ${value}`));
		return lines.join('\n');
	}

	let blockEnd = blockStart + 1;
	while (blockEnd < lines.length && (/^\s{2,}\S/.test(lines[blockEnd]) || lines[blockEnd].trim() === '')) blockEnd += 1;
	for (const [key, value] of Object.entries(updates)) {
		const linePattern = new RegExp(`^\\s{2,}${key}:\\s*(.*)$`);
		const lineIndex = lines.findIndex((line, index) => index > blockStart && index < blockEnd && linePattern.test(line));
		if (lineIndex >= 0) {
			const current = lines[lineIndex].match(linePattern)?.[1]?.trim().replace(/^['"]|['"]$/g, '') ?? '';
			if (isGenericLink(key, current)) lines[lineIndex] = `  ${key}: ${value}`;
			continue;
		}
		lines.splice(blockEnd, 0, `  ${key}: ${value}`);
		blockEnd += 1;
	}
	return lines.join('\n');
}

function episodeCoverPath(item) {
	let extension = '.jpeg';
	try {
		const candidate = extname(new URL(item.coverImage).pathname).toLowerCase();
		if (['.jpg', '.jpeg', '.png', '.webp'].includes(candidate)) extension = candidate;
	} catch {
		// RSS 圖片網址沒有可用副檔名時，採用 SoundOn 預設的 JPEG。
	}
	return `../../assets/episode-covers/ep${item.episodeNumber}${extension}`;
}

function updateCoverImage(frontmatter, coverImage) {
	const lines = frontmatter.split(/\r?\n/);
	const fieldIndex = lines.findIndex((line) => /^coverImage:\s*/.test(line));
	if (fieldIndex >= 0) {
		const current = lines[fieldIndex].replace(/^coverImage:\s*/, '').trim().replace(/^['"]|['"]$/g, '');
		if (!current || current.startsWith('../../assets/episode-covers/')) {
			lines[fieldIndex] = `coverImage: ${coverImage}`;
		}
		return lines.join('\n');
	}

	const insertionPoint = lines.findIndex((line) => /^(aiGenerated|draft):/.test(line));
	lines.splice(insertionPoint >= 0 ? insertionPoint : lines.length, 0, `coverImage: ${coverImage}`);
	return lines.join('\n');
}

async function downloadEpisodeCover(item, coverImage) {
	const response = await fetch(item.coverImage);
	if (!response.ok) throw new Error(`單集封面 ${response.status} ${response.statusText}: EP${item.episodeNumber}`);
	const contentType = response.headers.get('content-type') ?? '';
	if (!contentType.startsWith('image/')) throw new Error(`單集封面格式不正確: EP${item.episodeNumber}`);
	const buffer = Buffer.from(await response.arrayBuffer());
	if (buffer.length < 512) throw new Error(`單集封面檔案過小: EP${item.episodeNumber}`);
	await mkdir(COVER_DIR, { recursive: true });
	await writeFile(join(COVER_DIR, coverImage.split('/').at(-1)), buffer);
}

function applyUpdates(post, updates, coverImage) {
	let newFrontmatter = post.frontmatter;
	if (Object.keys(updates).length > 0) newFrontmatter = updateListenLinks(newFrontmatter, updates);
	if (coverImage) newFrontmatter = updateCoverImage(newFrontmatter, coverImage);
	if (newFrontmatter === post.frontmatter) return null;
	return post.content.replace(post.frontmatter, newFrontmatter);
}

async function readPosts() {
	const files = (await readdir(CONTENT_DIR)).filter((file) => /\.(md|mdx)$/.test(file));
	return Promise.all(files.map(async (fileName) => parsePost(fileName, await readFile(join(CONTENT_DIR, fileName), 'utf8'))));
}

function logResult(post, updates, coverImage) {
	const fields = [...Object.keys(updates), ...(coverImage ? ['coverImage'] : [])].join(', ');
	console.log(`${post.fileName}: ${post.episode} → ${fields || '無新增項目'}`);
}

async function main() {
	console.log(shouldWrite ? '同步模式：會寫入文章 frontmatter' : '預覽模式：不會寫入檔案（使用 --write 才會更新）');
	const [rssEpisodes, appleEpisodes, spotifyResult, posts] = await Promise.all([
		fetchRssEpisodes(),
		fetchAppleEpisodes(),
		fetchSpotifyEpisodes(),
		readPosts(),
	]);
	console.log(`RSS ${rssEpisodes.length} 集；Apple ${appleEpisodes.length} 集；Spotify ${spotifyResult.skipped ? '未設定憑證' : `${spotifyResult.items.length} 集`}`);

	let changed = 0;
	const coverDownloads = new Map();
	const matchedCovers = new Set();
	for (const post of posts) {
		if (!post || !post.episode || (post.draft && !includeDrafts)) continue;
		const updates = {};
		const rssMatch = matchEpisode(post, rssEpisodes);
		const appleMatch = matchEpisode(post, appleEpisodes);
		const spotifyMatch = matchEpisode(post, spotifyResult.items);
		if (rssMatch?.soundon) updates.soundon = rssMatch.soundon;
		if (appleMatch?.apple) updates.apple = appleMatch.apple;
		if (spotifyMatch?.spotify) updates.spotify = spotifyMatch.spotify;
		const useRssCover = rssMatch?.coverImage && (!post.coverImage || post.coverImage.startsWith('../../assets/episode-covers/'));
		const coverImage = useRssCover ? episodeCoverPath(rssMatch) : '';
		if (coverImage) matchedCovers.add(coverImage);
		const updatedContent = applyUpdates(post, updates, coverImage);
		if (coverImage && shouldWrite) {
			if (!coverDownloads.has(coverImage)) {
				coverDownloads.set(coverImage, downloadEpisodeCover(rssMatch, coverImage));
			}
			await coverDownloads.get(coverImage);
		}
		if (updatedContent && shouldWrite) await writeFile(join(CONTENT_DIR, post.fileName), updatedContent);
		if (updatedContent) changed += 1;
		logResult(post, updates, coverImage);
	}
	console.log(`${shouldWrite ? '已更新' : '預計更新'} ${changed} 篇文章；單集封面 ${shouldWrite ? '已同步' : '可同步'} ${matchedCovers.size} 集。`);
}

main().catch((error) => {
	console.error(`同步失敗：${error.message}`);
	process.exitCode = 1;
});
