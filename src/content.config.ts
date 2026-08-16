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
			// 文章在本站發布的日期。
			pubDate: z.coerce.date(),
			// 該集 Podcast 在各平台上線的日期；未填時視同與文章同日。
			episodeDate: z.coerce.date().optional(),
			updatedDate: z.coerce.date().optional(),
			episode: z.string().optional(),        // e.g. "EP52"
			episodeTitle: z.string().optional(),   // 原集標題（Podcast 上的完整集名）
			hosts: z.string().optional(),          // 本集主持人，如 "柏文、孝成、博志"
			guests: z.string().optional(),         // e.g. "方念萱老師"
			topics: z.array(z.enum([
				'男性困境',
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
			// 新文章預設直接發布；需要暫時下架時才改成 true。
			draft: z.boolean().default(false),
		}),
});

// 單一頁面內容（目前只有「關於節目」），讓團隊能直接從 /admin 編輯。
const pages = defineCollection({
	loader: glob({ base: './src/content/pages', pattern: '**/*.md' }),
	schema: z.object({
		title: z.string(),
		subtitle: z.string().optional(),
		description: z.string(),               // SEO meta 用
		missionTitle: z.string().default('節目初衷'),
		statsTitle: z.string().default('節目數據'),
		stats: z.array(z.object({
			num: z.string(),
			label: z.string(),
		})).default([]),
		listenTitle: z.string().default('在這裡收聽節目'),
		listenIntro: z.string().optional(),
	}),
});

export const collections = { blog, pages };
