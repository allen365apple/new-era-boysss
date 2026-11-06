/** 只採用正文裡明確的本站文章連結，忽略註解與程式碼範例。 */
function articleLinks(body = '') {
	const markdown = body.replace(/<!--[\s\S]*?-->|```[\s\S]*?```|~~~[\s\S]*?~~~|`[^`\n]*`/g, '');
	const links = new Map();
	for (const match of markdown.matchAll(/\[([^\]\n]+)\]\(\/blog\/([^/?#)\s]+)\/?(?:#[^)\s]*)?\)/g)) {
		if (!links.has(match[2])) links.set(match[2], match[1].replace(/[*_~]/g, '').trim());
	}
	return links;
}

function recommendationReason(candidate, outgoing, incoming, sharedTopics) {
	if (outgoing !== undefined) {
		const label = outgoing && outgoing.length <= 24 ? `「${outgoing}」` : '本文的討論';
		return `延伸${label}：${candidate.data.description}`;
	}
	if (incoming) return `從另一集回看本文的討論：${candidate.data.description}`;
	return `同樣從「${sharedTopics.join('、')}」切入：${candidate.data.description}`;
}

/** 正文連結優先；接著比較反向連結、共同議題數與分類稀少度，日期只作同分排序。 */
export function getRelatedPosts(current, posts, limit = 3) {
	const published = [...new Map(posts.filter((post) => !post.data.draft).map((post) => [post.id, post])).values()];
	const links = new Map(published.map((post) => [post.id, articleLinks(post.body)]));
	const outgoing = articleLinks(current.body);
	const currentTopics = [...new Set(current.data.topics ?? [])];
	const frequencies = new Map();
	for (const post of published) {
		for (const topic of new Set(post.data.topics ?? [])) frequencies.set(topic, (frequencies.get(topic) ?? 0) + 1);
	}
	return published.filter((post) => post.id !== current.id).map((post) => {
		const sharedTopics = currentTopics.filter((topic) => post.data.topics?.includes(topic));
		const outgoingLabel = outgoing.get(post.id);
		const incoming = links.get(post.id)?.has(current.id);
		return {
			post,
			relation: outgoing.has(post.id) ? 3 : incoming ? 2 : sharedTopics.length ? 1 : 0,
			sharedTopics,
			specificity: sharedTopics.reduce((sum, topic) => sum + 1 / frequencies.get(topic), 0),
			reason: recommendationReason(post, outgoingLabel, incoming, sharedTopics),
		};
	}).filter((entry) => entry.relation > 0)
		.sort((a, b) => b.relation - a.relation || b.sharedTopics.length - a.sharedTopics.length || b.specificity - a.specificity || new Date(b.post.data.pubDate).valueOf() - new Date(a.post.data.pubDate).valueOf() || a.post.id.localeCompare(b.post.id))
		.slice(0, Math.max(0, Math.trunc(limit)))
		.map(({ post, reason }) => ({ post, reason }));
}
