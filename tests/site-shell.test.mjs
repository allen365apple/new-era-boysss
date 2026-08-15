import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const read = (path) => readFile(new URL(path, import.meta.url), 'utf8');

test('Fuwari interaction primitives and license notice stay connected', async () => {
	const [config, header, styles, articleStyles, notices] = await Promise.all([
		read('../astro.config.mjs'),
		read('../src/components/Header.astro'),
		read('../src/styles/global.css'),
		read('../src/styles/fuwari-article.css'),
		read('../THIRD_PARTY_NOTICES.md'),
	]);

	assert.match(config, /@swup\/astro/);
	assert.match(config, /containers:\s*\['main'\]/);
	assert.match(header, /card-base/);
	assert.match(header, /astro:page-load/);
	assert.match(header, /navbar-hidden/);
	assert.match(styles, /\.expand-animation::before/);
	assert.match(styles, /transform:\s*scale\(0\.85\)/);
	assert.match(articleStyles, /@tailwind utilities/);
	assert.match(articleStyles, /\.custom-md blockquote/);
	assert.match(notices, /Fuwari/);
	assert.match(notices, /MIT License/);
});

test('recent article cards keep complete square covers', async () => {
	const cards = await read('../src/components/ArticleCard.astro');
	assert.match(cards, /\.post-card\.grid \.thumb \{[\s\S]*aspect-ratio:\s*1 \/ 1/);
	assert.match(cards, /\.post-card\.grid \.thumb img \{[\s\S]*object-fit:\s*contain/);
});

test('article pages expose clickable category and topic tags', async () => {
	const layout = await read('../src/layouts/BlogPost.astro');
	assert.match(layout, /aria-label="文章分類與議題標籤"/);
	assert.match(layout, /href="\/blog\/">節目文章/);
	assert.match(layout, /href={`\/topics\/\$\{topic\.slug\}\//);
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

test('footer retains the subtle CMS entry point', async () => {
	const footer = await read('../src/components/Footer.astro');
	assert.match(footer, /href="\/admin\/"/);
	assert.match(footer, /內容管理後臺/);
});
