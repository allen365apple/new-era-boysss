import test from 'node:test';
import assert from 'node:assert/strict';
import { taipeiDay, articleLastmod } from '../src/utils/content-dates.mjs';
import { createSearchIndex, normalizeSearchText } from '../src/utils/search-index.mjs';

test('Taipei date changes at local midnight even when UTC is still yesterday', () => {
	assert.equal(taipeiDay(new Date('2026-11-05T15:59:59Z')), '2026-11-05');
	assert.equal(taipeiDay(new Date('2026-11-05T16:00:00Z')), '2026-11-06');
});

test('sitemap dates reflect article dates rather than build time or body text', () => {
	assert.equal(articleLastmod('---\npubDate: 2026-08-15\nupdatedDate: "2026-11-01"\n---\nupdatedDate: 2026-11-06'), '2026-11-01');
	assert.equal(articleLastmod('---\npubDate: 2026-08-15\n---\n'), '2026-08-15');
	assert.equal(articleLastmod('---\npubDate: 2026-08-15\nupdatedDate: 2026-08-14\n---\n'), '2026-08-15');
	assert.equal(articleLastmod('---\npubDate: 2026-02-30\n---\n'), undefined);
});

test('search index excludes drafts and supports episode, topic and body searches', () => {
	const posts = [
		{ id: 'ep1', data: { title: '第一集', description: '摘要', pubDate: new Date('2026-08-15'), episode: 'EP1', topics: ['情感腳本'] }, body: '獨特的內文\n兩個段落' },
		{ id: 'draft', data: { title: '未公開', draft: true, pubDate: new Date('2026-11-06') }, body: '私人草稿' },
		{ id: 'ep2', data: { title: '<不是 HTML>', description: '第二集', pubDate: new Date('2026-08-16'), episode: 'EP2' }, body: '其他內容' },
	];
	const index = createSearchIndex(posts);
	assert.deepEqual(index.map((post) => post.href), ['/blog/ep2/', '/blog/ep1/']);
	assert.equal(index[0].title, '<不是 HTML>');
	for (const query of ['EP1', '情感腳本', '獨特的內文 兩個段落']) {
		assert.equal(index.filter((post) => post.searchText.includes(normalizeSearchText(query))).length, 1);
	}
	assert.ok(!JSON.stringify(index).includes('私人草稿'));
});
