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

test('footer retains the subtle CMS entry point', async () => {
	const footer = await read('../src/components/Footer.astro');
	assert.match(footer, /href="\/admin\/"/);
	assert.match(footer, /內容管理後臺/);
});
