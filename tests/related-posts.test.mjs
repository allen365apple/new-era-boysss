import test from 'node:test';
import assert from 'node:assert/strict';
import { getRelatedPosts } from '../src/utils/related-posts.mjs';

const post = (id, topics = [], body = '', options = {}) => ({ id, body, data: { title: id, description: `${id} 的內容摘要`, pubDate: new Date('2026-01-01'), topics, ...options } });

test('正文連結優先於反向連結與分類，排除自己、草稿、重複及無關文章', () => {
	const current = post('current', ['A', 'B'], '[延伸問題](/blog/direct/#section) [私人草稿](/blog/draft/) [缺文](/blog/missing/)');
	const direct = post('direct');
	const incoming = post('incoming', [], '[回看](/blog/current/)');
	const shared = post('shared', ['A', 'B'], '', { pubDate: new Date('2026-12-01') });
	const result = getRelatedPosts(current, [current, shared, incoming, direct, direct, post('draft', ['A'], '', { draft: true }), post('unrelated')]);
	assert.deepEqual(result.map(({ post }) => post.id), ['direct', 'incoming', 'shared']);
	assert.match(result[0].reason, /延伸「延伸問題」/);
	assert.match(result[1].reason, /另一集回看/);
	assert.match(result[2].reason, /A、B/);
	assert.ok(result.every(({ post, reason }) => reason.includes(post.data.description)));
	assert.equal(getRelatedPosts(current, [direct], 0).length, 0);
});

test('分類相關度優先於新舊，同分依日期與 id 穩定排序，不修改輸入陣列', () => {
	const current = post('current', ['A', 'B']);
	const candidates = [post('new', ['A'], '', { pubDate: new Date('2026-12-01') }), post('b', ['A', 'B']), post('a', ['A', 'B'])];
	const before = [...candidates];
	assert.deepEqual(getRelatedPosts(current, candidates).map(({ post }) => post.id), ['a', 'b', 'new']);
	assert.deepEqual(candidates, before);
	assert.deepEqual(getRelatedPosts(current, [post('old', ['A']), post('new', ['A'], '', { pubDate: new Date('2026-02-01') })]).map(({ post }) => post.id), ['new', 'old']);
});

test('同樣只共用一個議題時，較少見的議題優先於普遍分類', () => {
	const current = post('current', ['常見', '特定']);
	assert.equal(getRelatedPosts(current, [post('latest', ['常見'], '', { pubDate: new Date('2026-12-01') }), post('specific', ['特定']), post('filler', ['常見'])])[0].post.id, 'specific');
});

test('不將程式碼、註解與站外網址當作正文連結，沒有關聯時留空', () => {
	const current = post('current', [], '`[code](/blog/code/)`\n```md\n[fenced](/blog/fenced/)\n```\n<!-- [comment](/blog/comment/) -->\n[external](https://example.com/blog/external/)');
	assert.deepEqual(getRelatedPosts(current, ['code', 'fenced', 'comment', 'external'].map((id) => post(id))), []);
	assert.deepEqual(getRelatedPosts(post('empty'), []), []);
});
