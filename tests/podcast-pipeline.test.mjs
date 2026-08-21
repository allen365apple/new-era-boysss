import test from 'node:test';
import assert from 'node:assert/strict';
import {
	episodeNumber,
	fetchWithRetry,
	buildTranscriptionPrompt,
	loadGlossary,
	normalizeTranscriptText,
	parseRss,
} from '../scripts/podcast-pipeline.mjs';

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

test('fetchWithRetry retries transient network failures', async () => {
	let calls = 0;
	const response = await fetchWithRetry('https://example.com/audio.mp3', {}, {
		attempts: 3,
		delays: [0, 0],
		fetchImpl: async () => {
			calls += 1;
			if (calls < 3) throw new TypeError('temporary connection failure');
			return new Response('ok', { status: 200 });
		},
		waitImpl: async () => {},
	});
	assert.equal(response.status, 200);
	assert.equal(calls, 3);
});

test('transcription prompt stays compact while keeping confirmed names', async () => {
	const glossary = await loadGlossary();
	const prompt = buildTranscriptionPrompt({ title: 'EP6：男孩危機' }, glossary);
	assert.ok(prompt.length < 1800);
	assert.match(prompt, /柏文/);
	assert.match(prompt, /孝成/);
	assert.match(prompt, /博志/);
	assert.match(prompt, /沁儒/);
});
