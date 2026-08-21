// 瀏覽器分頁、SEO 與 RSS 使用的完整站名。
export const SITE_TITLE = '新世紀直男戰士｜部落格';
// 導覽列品牌只顯示節目名，避免標題過長。
export const SITE_BRAND = '新世紀直男戰士';
export const SITE_DESCRIPTION = '台灣第一個由直男視角出發、系統性探討性別平等與女性主義議題的 Podcast。我們相信改變不是透過說教，而是透過理解。每集對談整理成可讀、可搜尋的文字。';
export const PODCAST_NAME = '新世紀直男戰士';
export const PODCAST_HOST = '新世紀直男戰士製作團隊';

// Google Search Console 的 HTML 標記驗證碼（只填 content 值，不用整段 meta 標籤）。
// 在 https://search.google.com/search-console 新增「網址前置字元」資源後，
// 選「HTML 標記」會得到 <meta name="google-site-verification" content="XXXX">，把 XXXX 填在這裡。
// 留空字串時不會輸出任何 meta，不影響其他頁面。
export const GOOGLE_SITE_VERIFICATION = '';

// 節目社群帳號，來源為官方導覽頁 https://portaly.cc/new.era.boys（2026-08-21 逐一確認可連線）。
export const SOCIAL_LINKS = {
	instagram: 'https://www.instagram.com/new.era.boysss/',
	threads: 'https://www.threads.com/@new.era.boysss',
	facebook: 'https://www.facebook.com/new.era.boysss/',
	portaly: 'https://portaly.cc/new.era.boys',
} as const;

// 節目各平台入口，來源為官方導覽頁 https://portaly.cc/new.era.boys
export const PODCAST_LINKS = {
	spotify: 'https://open.spotify.com/show/1BAWRDklXg5vdIUxMoPCkr',
	apple: 'https://podcasts.apple.com/tw/podcast/%E6%96%B0%E4%B8%96%E7%B4%80%E7%9B%B4%E7%94%B7%E6%88%B0%E5%A3%AB/id1732062544',
	youtube: 'https://www.youtube.com/@new-era-boys',
	kkbox: 'https://podcast.kkbox.com/tw/channel/KtY2U76NqwOGIvnr0S',
	mixerbox: 'https://www.mbplayer.com/podcast/1463356',
	soundon: 'https://player.soundon.fm/p/77af8789-ee40-4dd4-94b9-35c32ed1a46a',
} as const;
