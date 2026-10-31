import test from 'node:test';
import assert from 'node:assert/strict';
import { isYouTubeVideoUrl } from '../src/utils/video-links.mjs';

test('影片入口接受 HTTPS YouTube 單支影片，拒絕非影片與偽冒網址', () => {
	for (const value of ['https://www.youtube.com/watch?v=YlEaWM3NAKs', 'https://youtu.be/YlEaWM3NAKs']) {
		assert.equal(isYouTubeVideoUrl(value), true, value);
	}
	for (const value of ['', 'javascript:alert(1)', 'http://www.youtube.com/watch?v=YlEaWM3NAKs', 'https://www.youtube.com/', 'https://www.youtube.com/watch?v=bad', 'https://www.youtube.com.evil.example/watch?v=YlEaWM3NAKs', 'https://evil.example@www.youtube.com/watch?v=YlEaWM3NAKs']) {
		assert.equal(isYouTubeVideoUrl(value), false, value);
	}
});
