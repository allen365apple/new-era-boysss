// @ts-check

import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import swup from '@swup/astro';
import { defineConfig, fontProviders } from 'astro/config';
import { readFile } from 'node:fs/promises';
import { FAQ_REVIEW_DATE } from './src/data/faq-meta.mjs';
import { TOPIC_GUIDES } from './src/data/topic-guides.mjs';
import { articleLastmod } from './src/utils/content-dates.mjs';

// https://astro.build/config
export default defineConfig({
	site: 'https://new-era-boysss.pages.dev',
	integrations: [
		mdx(),
		swup({
			theme: false,
			animationClass: 'transition-swup-',
			containers: ['main'],
			smoothScrolling: true,
			cache: true,
			preload: true,
			accessibility: true,
			updateHead: true,
			updateBodyClass: false,
			globalInstance: true,
		}),
		sitemap({
			// /topics/male-privilege/ 是舊網址的 301 轉址頁，本身帶 noindex。
			// 收進 sitemap 會讓 Search Console 報「已提交的網址標記為 noindex」，故排除。
			filter: (page) => !page.includes('/topics/male-privilege'),
			async serialize(item) {
				if (new URL(item.url).pathname.replace(/\/$/, '') === '/faq') item.lastmod = FAQ_REVIEW_DATE;
				const topicSlug = /^\/topics\/([^/]+)\/?$/.exec(new URL(item.url).pathname)?.[1];
				if (topicSlug && TOPIC_GUIDES[topicSlug]) item.lastmod = TOPIC_GUIDES[topicSlug].updatedDate;
				const slug = /^\/blog\/(ep\d+)\/?$/.exec(new URL(item.url).pathname)?.[1];
				if (slug) {
					const markdown = await readFile(new URL(`./src/content/blog/${slug}.md`, import.meta.url), 'utf8');
					const lastmod = articleLastmod(markdown);
					if (lastmod) item.lastmod = lastmod;
				}
				return item;
			},
		}),
	],
	fonts: [
		{
			provider: fontProviders.local(),
			name: 'Atkinson',
			cssVariable: '--font-atkinson',
			fallbacks: ['sans-serif'],
			options: {
				variants: [
					{
						src: ['./src/assets/fonts/atkinson-regular.woff'],
						weight: 400,
						style: 'normal',
						display: 'swap',
					},
					{
						src: ['./src/assets/fonts/atkinson-bold.woff'],
						weight: 700,
						style: 'normal',
						display: 'swap',
					},
				],
			},
		},
	],
});
