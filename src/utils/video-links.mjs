/**
 * 確認影片入口是 HTTPS YouTube 單支影片，避免誤填頻道或不受信任的網址。
 * @param {string} value
 * @returns {boolean}
 */
export function isYouTubeVideoUrl(value) {
	try {
		const url = new URL(value);
		if (url.protocol !== 'https:' || url.username || url.password || url.port) return false;
		if (url.hostname === 'youtu.be') return /^\/[\w-]{11}$/.test(url.pathname);
		return ['www.youtube.com', 'youtube.com'].includes(url.hostname)
			&& url.pathname === '/watch' && /^[\w-]{11}$/.test(url.searchParams.get('v') ?? '');
	} catch {
		return false;
	}
}
