import { getCollection } from 'astro:content';
import { createSearchIndex } from '../utils/search-index.mjs';

export async function GET() {
	const posts = await getCollection('blog', ({ data }) => !data.draft);
	return new Response(JSON.stringify(createSearchIndex(posts)), {
		headers: { 'Content-Type': 'application/json; charset=utf-8' },
	});
}
