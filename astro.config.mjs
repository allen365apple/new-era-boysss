// @ts-check

import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import swup from '@swup/astro';
import { defineConfig, fontProviders } from 'astro/config';

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
