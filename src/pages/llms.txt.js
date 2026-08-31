import { getCollection } from 'astro:content';
import { SITE_DESCRIPTION, SITE_TITLE, PODCAST_LINKS } from '../consts';

// llms.txt：給 AI 的網站地圖（規範見 https://llmstxt.org）。
// 建置時自動從 blog collection 產生，新文章發布後會自動更新，無需手動維護。

const PLATFORM_LABELS = {
	spotify: 'Spotify',
	apple: 'Apple Podcasts',
	youtube: 'YouTube',
	kkbox: 'KKBOX',
	mixerbox: 'MixerBox',
	soundon: 'SoundOn',
};

// 從 "EP48" 取出數字 48 供排序；沒有集數的排到最後。
function episodeNumber(episode) {
	const match = /\d+/.exec(episode ?? '');
	return match ? Number(match[0]) : Number.POSITIVE_INFINITY;
}

export async function GET(context) {
	const base = (context.site?.href ?? 'https://new-era-boysss.pages.dev/').replace(/\/$/, '');
	const posts = (await getCollection('blog', ({ data }) => !data.draft)).sort(
		(a, b) => episodeNumber(a.data.episode) - episodeNumber(b.data.episode),
	);

	const lines = [];
	lines.push(`# ${SITE_TITLE}`);
	lines.push('');
	lines.push(`> ${SITE_DESCRIPTION}`);
	lines.push('');
	lines.push(
		'《新世紀直男戰士》從直男的視角出發，討論性別、父權、女權與男性困境等議題。以下文章由每集 Podcast 對談整理而成，適合閱讀、搜尋與引用。',
	);
	lines.push('');

	lines.push('## 文章');
	for (const post of posts) {
		const url = `${base}/blog/${post.id}/`;
		const prefix = post.data.episode ? `${post.data.episode}｜` : '';
		lines.push(`- [${prefix}${post.data.title}](${url})：${post.data.description}`);
	}
	lines.push('');

	lines.push('## 收聽 Podcast');
	for (const [key, label] of Object.entries(PLATFORM_LABELS)) {
		if (PODCAST_LINKS[key]) lines.push(`- [${label}](${PODCAST_LINKS[key]})`);
	}
	lines.push('');

	lines.push('## 其他頁面');
	lines.push(`- [常見問題](${base}/faq/)：關於性別、女權、陽剛氣質與約會界線的常見問題，答案整理自各集節目並標明出處。`);
	lines.push(`- [關於節目](${base}/about/)`);
	lines.push(`- [議題索引](${base}/topics/)`);
	lines.push(`- [RSS](${base}/rss.xml)`);
	lines.push(`- [全文版 llms-full.txt](${base}/llms-full.txt)：本站所有文章的完整內文，供 AI 直接讀取引用。`);
	lines.push('');

	return new Response(lines.join('\n'), {
		headers: { 'Content-Type': 'text/plain; charset=utf-8' },
	});
}
