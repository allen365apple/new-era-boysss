import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { TOPIC_GUIDES, resolveTopicGuide } from '../src/data/topic-guides.mjs';

test('導讀不連到草稿、缺文或其他分類，標題跟隨文章資料', () => {
	const post = (id, title, draft = false, topics = ['男性困境']) => ({ id, data: { title, draft, topics } });
	const posts = [post('ep1', '更新後的標題'), post('ep29', '私人草稿', true), post('ep60', '其他分類', false, ['身份認同'])];
	const topic = { slug: 'male-struggles', name: '男性困境' };
	const result = resolveTopicGuide(topic, posts);
	assert.deepEqual(result.startHere.map(({ post }) => post.data.title), ['更新後的標題']);
	assert.equal(resolveTopicGuide(topic, []).startHere.length, 0);
});

test('七個導讀的入門單集均存在、已公開且屬於該分類，相關分類無失效連結', async () => {
	const source = await readFile(new URL('../src/data/topics.ts', import.meta.url), 'utf8');
	const topics = [...source.matchAll(/name: '([^']+)',\s+slug: '([^']+)'/g)].map(([, name, slug]) => ({ name, slug }));
	assert.equal(topics.length, 7);
	assert.deepEqual(Object.keys(TOPIC_GUIDES).sort(), topics.map(({ slug }) => slug).sort());
	for (const topic of topics) {
		const guide = TOPIC_GUIDES[topic.slug];
		assert.equal(new Set(guide.startHere.map(({ id }) => id)).size, guide.startHere.length);
		for (const entry of guide.startHere) {
			const markdown = await readFile(new URL(`../src/content/blog/${entry.id}.md`, import.meta.url), 'utf8');
			const frontmatter = markdown.split('---')[1];
			assert.doesNotMatch(frontmatter, /^draft:\s*true\s*$/m, entry.id);
			const categories = /^topics:\s*\n((?:[ \t]+- .+\n)+)/m.exec(frontmatter)?.[1];
			assert.ok(categories?.split('\n').some((line) => line.trim() === `- ${topic.name}`), `${entry.id} 應屬於 ${topic.name}`);
		}
		assert.ok(guide.related.every((slug) => slug !== topic.slug && topics.some((other) => other.slug === slug)));
		assert.match(guide.updatedDate, /^\d{4}-\d{2}-\d{2}$/);
	}
});
