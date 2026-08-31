#!/usr/bin/env node
// 依 git 歷史自動為每篇文章補上 updatedDate（frontmatter）。
//
// 規則（求真，不灌水）：
//  - 一篇文章的「最後修改日」= 該檔案最後一次 git commit 的日期。
//  - 若檔案目前有未提交的變更（正在被編輯），視為「今天」修改。
//  - 只有當「最後修改日」晚於「首次加入日」時才寫 updatedDate；
//    從沒改過的文章（新發布、只 commit 過一次）不寫，dateModified 就不會憑空出現。
//  - 冪等：值沒變就不動檔案，不製造無意義 diff。
//
// 用法：node scripts/stamp-updated-dates.mjs         （寫入）
//       node scripts/stamp-updated-dates.mjs --check （只檢查、不寫，CI 用）
import { execSync } from 'node:child_process';
import { readFileSync, writeFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

const BLOG_DIR = 'src/content/blog';
const checkOnly = process.argv.includes('--check');

function git(cmd) {
	try {
		return execSync(`git ${cmd}`, { encoding: 'utf8' }).trim();
	} catch {
		return '';
	}
}

function today() {
	// 本機執行，允許用系統日期；格式 YYYY-MM-DD。
	return new Date().toISOString().slice(0, 10);
}

function firstCommitDate(file) {
	const out = git(`log --diff-filter=A --format=%as --follow -- "${file}"`);
	const lines = out.split('\n').filter(Boolean);
	return lines[lines.length - 1] || '';
}

function lastCommitDate(file) {
	return git(`log -1 --format=%as -- "${file}"`);
}

function isDirty(file) {
	return git(`status --porcelain -- "${file}"`) !== '';
}

const files = readdirSync(BLOG_DIR).filter((f) => f.endsWith('.md'));
let changed = 0;
const report = [];

for (const name of files) {
	const path = join(BLOG_DIR, name);
	const raw = readFileSync(path, 'utf8');
	const m = raw.match(/^---\n([\s\S]*?)\n---/);
	if (!m) continue;
	const fm = m[1];

	const hasLine = /^updatedDate:\s*.+$/m.test(fm);
	const currentVal = hasLine ? fm.match(/^updatedDate:\s*(.+)$/m)[1].trim() : null;

	// 決定這篇「應該」的 updatedDate（避免回饋迴圈）：
	//  - 有未提交的內容改動 → 今天。
	//  - 乾淨且已經有 updatedDate → 保留原值，絕不因為後續 commit 而往前跳。
	//  - 乾淨且還沒有 updatedDate → 用 git「最後修改日」一次性回填（僅在確實改過、最後晚於首次時）。
	let desired;
	if (isDirty(path)) {
		desired = today();
	} else if (hasLine) {
		desired = currentVal;
	} else {
		const first = firstCommitDate(path);
		const last = lastCommitDate(path);
		desired = first && last && last > first ? last : null;
	}

	if (desired && currentVal !== desired) {
		if (!checkOnly) {
			let newFm;
			if (hasLine) {
				newFm = fm.replace(/^updatedDate:\s*.+$/m, `updatedDate: ${desired}`);
			} else {
				// 放在 pubDate 之後（沒有就放最前面）
				newFm = /^pubDate:.*$/m.test(fm)
					? fm.replace(/^(pubDate:.*)$/m, `$1\nupdatedDate: ${desired}`)
					: `updatedDate: ${desired}\n${fm}`;
			}
			writeFileSync(path, raw.replace(fm, newFm));
		}
		report.push(`  ${name}: ${currentVal ?? '（無）'} → ${desired}`);
		changed++;
	}
}

if (report.length) {
	console.log(`${checkOnly ? '[檢查] 需要更新' : '已更新'} ${changed} 篇 updatedDate：`);
	console.log(report.join('\n'));
} else {
	console.log('所有文章的 updatedDate 都是最新的，無需更動。');
}
if (checkOnly && changed) process.exit(1);
