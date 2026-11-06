export function normalizeSearchText(value) {
	return value.replace(/\s+/g, ' ').trim().toLocaleLowerCase('zh-TW');
}

export function createSearchIndex(posts) {
	return posts
		.filter((post) => !post.data.draft)
		.sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf())
		.map(({ id, data, body }) => ({
			href: `/blog/${id}/`,
			title: data.title,
			description: data.description,
			episode: data.episode,
			topics: data.topics ?? [],
			searchText: normalizeSearchText([data.title, data.description, data.episode, ...(data.topics ?? []), body].filter(Boolean).join(' ')),
		}));
}
