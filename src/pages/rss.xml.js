import { getCollection, render } from 'astro:content';
import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import rss from '@astrojs/rss';
import { SITE_DESCRIPTION, SITE_TITLE } from '../consts';

// RSS：除了標題與摘要，另附上 <content:encoded> 全文（把 Markdown 渲染成 HTML），
// 讓 RSS 閱讀器與抓 RSS 的 AI 能直接讀到整篇內容，不必再回站抓取。
export async function GET(context) {
	const posts = (await getCollection('blog', ({ data }) => !data.draft)).sort(
		(a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf(),
	);

	const container = await AstroContainer.create();
	const base = context.site?.toString().replace(/\/$/, '') ?? '';

	const items = [];
	for (const post of posts) {
		const { Content } = await render(post);
		let html = await container.renderToString(Content);
		// 把相對的內部連結補成絕對網址，RSS 端才點得到。
		html = html.replace(/(href|src)="\/(?!\/)/g, `$1="${base}/`);
		items.push({
			title: post.data.title,
			description: post.data.description,
			pubDate: post.data.pubDate,
			link: `/blog/${post.id}/`,
			content: html,
			...(post.data.episode ? { customData: `<episode>${post.data.episode}</episode>` } : {}),
		});
	}

	return rss({
		title: SITE_TITLE,
		description: SITE_DESCRIPTION,
		site: context.site,
		customData: '<language>zh-TW</language>',
		items,
	});
}
