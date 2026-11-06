export function taipeiDay(date = new Date()) {
	return new Intl.DateTimeFormat('en-CA', {
		timeZone: 'Asia/Taipei', year: 'numeric', month: '2-digit', day: '2-digit',
	}).format(date);
}

// Only use date fields inside frontmatter; never invent a modification date at build time.
export function articleLastmod(markdown) {
	const frontmatter = /^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/.exec(markdown)?.[1] ?? '';
	const readDate = (field) => {
		const value = new RegExp(`^${field}:\\s*["']?(\\d{4}-\\d{2}-\\d{2})["']?\\s*(?:#.*)?$`, 'm').exec(frontmatter)?.[1];
		if (!value) return undefined;
		const parsed = new Date(`${value}T00:00:00Z`);
		return Number.isFinite(parsed.valueOf()) && parsed.toISOString().slice(0, 10) === value ? value : undefined;
	};
	const published = readDate('pubDate');
	const updated = readDate('updatedDate');
	return updated && (!published || updated >= published) ? updated : published;
}
