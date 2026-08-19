import test from 'node:test';
import assert from 'node:assert/strict';
import { episodeNumber, loadGlossary, normalizeTranscriptText, parseRss } from '../scripts/podcast-pipeline.mjs';

test('episodeNumber accepts common episode labels', () => {
	assert.equal(episodeNumber('EP2：標題'), 2);
	assert.equal(episodeNumber('ep 064'), 64);
	assert.equal(episodeNumber('45'), 45);
});

test('parseRss extracts and sorts downloadable episodes', () => {
	const xml = `
		<rss><channel>
			<item>
				<title><![CDATA[EP3：角色 &amp; 故事]]></title>
				<itunes:episode>3</itunes:episode>
				<pubDate>Fri, 26 Apr 2024 04:00:00 GMT</pubDate>
				<link>https://example.com/ep3</link>
				<guid>guid-3</guid>
				<itunes:image href="https://example.com/ep3.jpg" />
				<enclosure url="https://example.com/ep3.mp3" type="audio/mpeg" />
			</item>
			<item>
				<title>EP2：較早的一集</title>
				<link>https://example.com/ep2</link>
				<guid>guid-2</guid>
				<enclosure url="https://example.com/ep2.mp3" type="audio/mpeg" />
			</item>
			<item><title>沒有音檔</title></item>
		</channel></rss>`;

	const episodes = parseRss(xml);
	assert.deepEqual(episodes.map((item) => item.episode), ['EP2', 'EP3']);
	assert.equal(episodes[1].title, 'EP3：角色 & 故事');
	assert.equal(episodes[1].audioUrl, 'https://example.com/ep3.mp3');
	assert.equal(episodes[1].coverImage, 'https://example.com/ep3.jpg');
});

test('normalizeTranscriptText fixes recurring public names', () => {
	assert.equal(
		normalizeTranscriptText('我是博文。我是柏智。我是校成。我是夏晨。我是沁如。吳英章是室友。歡迎收聽新世界直男戰士和新世紀指南戰士，約會要不要A智慧？'),
		'我是柏文。我是博志。我是孝成。我是孝成。我是沁儒。吳英彰是室友。歡迎收聽新世紀直男戰士和新世紀直男戰士，約會要不要AA制？',
	);
});

test('podcast pipeline loads the shared KB2 glossary', async () => {
	const glossary = await loadGlossary();
	assert.match(glossary, /\*\*柏文\*\*/);
	assert.match(glossary, /\*\*吳英彰\*\*/);
	assert.match(glossary, /\*\*黃腔\*\*/);
});
