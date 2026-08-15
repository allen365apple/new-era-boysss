import test from 'node:test';
import assert from 'node:assert/strict';

import { inspect } from '../scripts/validate-generated-article.mjs';

const paragraph = '約會中的體貼不能只靠既定性別規則判斷，真正需要的是先看見對方的處境，再透過詢問確認彼此是否舒服。'.repeat(3);

function article({ draft = false, includeConclusion = true, topic = '男性困境' } = {}) {
	const finalParagraphs = includeConclusion
		? `${paragraph}\n\n${paragraph}\n\n---\n\n${paragraph}`
		: `${paragraph}\n\n${paragraph}`;
	return `---
title: "測試文章"
description: "測試文章摘要"
pubDate: 2026-08-16
episode: EP99
episodeTitle: "EP99：測試集數"
hosts: "柏文、孝成、博志"
topics:
  - ${topic}
aiGenerated: true
draft: ${draft}
---

文章開場用一個具體情境帶讀者進入問題，並交代這篇文章準備處理的關係困惑。

## 第一節

${paragraph}

${paragraph}

> 「第一句來源引言。」

## 第二節

${paragraph}

${paragraph}

> 「第二句來源引言。」

## 第三節

${paragraph}

${paragraph}

> 「第三句來源引言。」

## 最後一節

${finalParagraphs}
`;
}

test('published article with a closing summary passes', () => {
	const result = inspect(article(), 'ep99.md');
	assert.deepEqual(result.errors, []);
});

test('direct-publish validation rejects drafts by default', () => {
	const result = inspect(article({ draft: true }), 'ep99.md');
	assert.ok(result.errors.some((error) => error.includes('draft: false')));
});

test('final section must include an additional closing-summary paragraph', () => {
	const result = inspect(article({ includeConclusion: false }), 'ep99.md');
	assert.ok(result.errors.some((error) => error.includes('文章最後需要')));
	assert.ok(result.errors.some((error) => error.includes('Markdown 分隔線')));
});

test('男性困境是固定分類，舊分類男性特權不再接受', () => {
	assert.deepEqual(inspect(article({ topic: '男性困境' }), 'ep99.md').errors, []);
	assert.ok(
		inspect(article({ topic: '男性特權' }), 'ep99.md').errors.some((error) => error.includes('不允許的議題分類')),
	);
});
