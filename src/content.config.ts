import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const listenLinksSchema = z.object({
	soundon: z.string().url().optional(),
	spotify: z.string().url().optional(),
	apple: z.string().url().optional(),
	kkbox: z.string().url().optional(),
}).optional();

const blog = defineCollection({
	loader: glob({ base: './src/content/blog', pattern: '**/*.{md,mdx}' }),
	schema: ({ image }) =>
		z.object({
			title: z.string(),
			description: z.string(),
			pubDate: z.coerce.date(),
			updatedDate: z.coerce.date().optional(),
			episode: z.string().optional(),        // e.g. "EP52"
			guests: z.string().optional(),         // e.g. "方念萱老師"
			topics: z.array(z.enum([
				'男性特權',
				'情感腳本',
				'性別凝視',
				'身份認同',
				'在地事件',
				'多元對話',
				'聽眾互動',
			])).optional(),
			listenLinks: listenLinksSchema,
			coverImage: z.optional(image()),
			aiGenerated: z.boolean().default(true),
			draft: z.boolean().default(false),
		}),
});

export const collections = { blog };
