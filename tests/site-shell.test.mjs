import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const read = (path) => readFile(new URL(path, import.meta.url), 'utf8');

test('Fuwari interaction primitives and license notice stay connected', async () => {
	const [config, header, styles, notices] = await Promise.all([
		read('../astro.config.mjs'),
		read('../src/components/Header.astro'),
		read('../src/styles/global.css'),
		read('../THIRD_PARTY_NOTICES.md'),
	]);

	assert.match(config, /@swup\/astro/);
	assert.match(config, /containers:\s*\['main'\]/);
	assert.match(header, /card-base/);
	assert.match(header, /astro:page-load/);
	assert.match(header, /header\s*\{[\s\S]*?position:\s*relative/);
	assert.doesNotMatch(header, /position:\s*sticky/);
	assert.match(styles, /\.expand-animation::before/);
	assert.match(styles, /transform:\s*scale\(0\.85\)/);
	assert.match(notices, /Fuwari/);
	assert.match(notices, /MIT License/);
});

test('homepage keeps the approved octagon copy and section order', async () => {
	const homepage = await read('../src/pages/index.astro');
	const recentPosition = homepage.indexOf('最近的節目文章');
	const topicsPosition = homepage.indexOf('從哪個問題開始？');

	assert.match(homepage, /clip-path:\s*polygon\(30% 0, 70% 0, 100% 30%/);
	assert.match(homepage, /台灣第一個由直男視角出發的/);
	assert.match(homepage, /關於性別的煩惱與矛盾，我們在這裡聊/);
	assert.ok(recentPosition > -1 && topicsPosition > recentPosition);
});

test('article sidebar keeps category, tags and episode below the table of contents', async () => {
	const layout = await read('../src/layouts/BlogPost.astro');
	const tocPosition = layout.indexOf('class="toc"');
	const taxonomyPosition = layout.indexOf('class="taxonomy"');
	assert.ok(tocPosition > -1 && taxonomyPosition > tocPosition);
	assert.match(layout, />CATEGORY</);
	assert.match(layout, />TAGS</);
	assert.match(layout, />EPISODE</);
	assert.match(layout, /taxonomy-tag expand-animation scale-animation/);
	assert.match(layout, /\.taxonomy-tag::before\s*\{[\s\S]*?z-index:\s*0/);
	assert.match(layout, /\.taxonomy-tag:hover\s*\{[\s\S]*?translateY\(-2px\)/);
	assert.doesNotMatch(layout, /class="meta-top"/);
});

test('homepage grid cards keep episode artwork square and uncropped', async () => {
	const card = await read('../src/components/ArticleCard.astro');
	assert.match(card, /\.post-card\.grid \.thumb\s*\{[\s\S]*?aspect-ratio:\s*1 \/ 1/);
	assert.match(card, /\.post-card\.grid \.thumb img\s*\{[\s\S]*?object-fit:\s*contain/);
});

test('public pages use page backgrounds without rendering the standalone banner', async () => {
	const [styles, layout, homepage, blog, topics, topicPage, about] = await Promise.all([
		read('../src/styles/global.css'),
		read('../src/layouts/BlogPost.astro'),
		read('../src/pages/index.astro'),
		read('../src/pages/blog/index.astro'),
		read('../src/pages/topics/index.astro'),
		read('../src/pages/topics/[topic].astro'),
		read('../src/pages/about.astro'),
	]);
	assert.match(styles, /--page-background-size:/);
	assert.match(styles, /--page-background-attachment:\s*scroll/);
	assert.match(styles, /--top-starfield-background:/);
	assert.match(styles, /body::before,[\s\S]*?height:\s*920px/);
	assert.match(styles, /@keyframes starfield-twinkle/);
	for (const page of [layout, homepage, blog, topics, topicPage, about]) {
		assert.doesNotMatch(page, /SiteBanner/);
	}
});

test('collection and about pages keep their content inside the mobile viewport', async () => {
	const [blog, topics, topicPage, about] = await Promise.all([
		read('../src/pages/blog/index.astro'),
		read('../src/pages/topics/index.astro'),
		read('../src/pages/topics/[topic].astro'),
		read('../src/pages/about.astro'),
	]);
	for (const page of [blog, topics, topicPage, about]) {
		assert.match(page, /main\s*\{[\s\S]*?width:\s*min\([^,]+, calc\(100% - 2\.5rem\)\)/);
	}
});

test('footer retains the subtle CMS entry point', async () => {
	const footer = await read('../src/components/Footer.astro');
	assert.match(footer, /href="\/admin\/"/);
	assert.match(footer, /內容管理後臺/);
});
