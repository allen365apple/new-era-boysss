# 全站架構、程式品質與搜尋能見度檢視

日期：2026-10-26。檢查版本：`47b7dd0`。本次為檢查與建議，未修改功能、文章或部署設定，未提交／推送。

## 整體判斷

現有 Astro 靜態網站、Markdown Content Collections、Decap CMS、GitHub 與 Cloudflare Pages 架構適合目前的內容型網站，不需要為 SEO 重寫框架或導入資料庫。主要改善方向是搜尋資料載入方式、後台授權、資料驗證、主題內容組織與搜尋成效量測。

「可被爬取」已有基礎，但不能據此推定「已被 Google 收錄」或「有排名」。本次沒有讀取 Search Console 的私人資料，無法判定全站實際收錄率、查詢字、點擊率或 Google 選用的 canonical。

## 已執行的檢查

- 19 個 Node 測試通過；68 篇文章驗證通過；正式建置成功產生 82 頁。
- 檢查建置後 HTML 的主要內容連結，未發現指向不存在的站內目標；公開內容頁的 H1、canonical 與 JSON-LD 語法檢查通過。驗證用 Google HTML 檔及轉址頁不套一般內容頁要求。
- 正式站抽查首頁、文章列表、EP68、FAQ、sitemap、舊議題 URL、後台與不存在的網址；一般內容回應 200，不存在的網址回應 404。
- 用瀏覽器實際操作換頁、站內搜尋、集數排序與 390px 手機版文章閱讀；抽查未出現瀏覽器 console error。這不是完整無障礙或跨裝置認證。
- 比對全部文章的正文內部連結，並以純記憶體反例檢查驗證器。OAuth 測試使用本機假的回應，未使用真實憑證或登入帳號。
- 執行 `npm audit --omit=dev`，未執行依賴修復或升級。
- 線上全站並行抓取遇到長時間未完成的回應，已停止該抓取；完整連結檢查以本地建置輸出為準，不宣稱全站 URL 均完成線上驗證。
- 沒有 Chrome DevTools MCP，未量測真實 LCP／INP／CLS，也沒有宣稱 Lighthouse 分數。

## 第一批：應優先修正

### 1. 後台 OAuth 缺少 state 與訊息來源驗證（高優先，安全）

位置：`functions/api/auth.js:6`、`functions/api/callback.js:4`、`functions/api/callback.js:40`。

授權入口沒有建立 state，callback 沒有核對 state；callback 收到任意 message 後，會將 token payload 回傳給 opener，卻沒有核對 `e.origin` 與 `e.source`。本機 mock 測試確認，缺少 state 的 callback 仍會產生成功頁。尚未進行正式站攻擊或證明真實帳號遭入侵。

建議建立一次性 state、驗證期限與回呼來源，使用 HttpOnly／Secure／SameSite cookie，限制 postMessage 的來源與接收 origin，加入 `Cache-Control: no-store`、錯誤處理與 opener 檢查。PKCE 與最小授權範圍一併評估；目前要求 `repo,user`，應核對實際需求。修改前需確認 Decap 的握手協議，避免修完無法登入。

### 2. 每頁攜帶完整全站搜尋資料（高優先，效能與擴充性）

位置：`src/components/Header.astro:6`、`src/components/Header.astro:19`、`src/components/Header.astro:77`。

正式站 EP68 HTML 約 457,767 bytes，其中搜尋 dialog 約 420,586 bytes，占約 92%。首頁約 462,101 bytes，文章列表約 556,625 bytes。這些是取得後的 HTML bytes，不是實測網路傳輸量。

本地 gzip 比較：EP68 整頁約 177 KB，移除該 dialog 的比較版本約 13 KB；首頁約 177 KB 對 11 KB。這是用來隔離搜尋資料成本的量測，並不代表完成搜尋功能後能達到完全相同的大小，也不能直接換算成 LCP 改善秒數。

建議將全文索引獨立為可快取資產，使用者開啟搜尋後再載入；結果以需要的數量呈現。先做輕量 JSON 索引即可，再依規模評估 Pagefind 等靜態搜尋工具，不必直接改成付費服務。正文仍保留在文章 HTML，確保搜尋引擎能直接讀取。

### 3. 鎖定依賴含多筆安全公告（高優先，維護）

位置：`package.json`、`package-lock.json`。

本次 npm audit 回報 33 個受影響套件節點：1 critical、20 high、12 moderate，包含直接與間接依賴，並非 33 個彼此獨立、可在網站上利用的漏洞。鎖定版本包含 Astro 7.0.3、sharp 0.34.5、@astrojs/rss 4.0.18、Vite 8.1.0。

網站前台是靜態輸出，部分 SSR／開發伺服器公告未必適用線上前台；圖片處理、RSS 產生與建置工具仍需要評估。應逐項分類、更新相容版本、驗證 CMS 與 swup 換頁，不要直接執行 `npm audit fix --force`。掃描曾對 swup 提出大幅降版方案，不能當成安全的自動修法。

### 4. 品質驗證未攔住已發生過的資料錯誤（高優先，防止復發）

位置：`scripts/validate-generated-article.mjs:32`、`src/content.config.ts`、`tests/site-shell.test.mjs`、`.github/workflows/`。

以 EP43 內容在記憶體中分別改成 `guest:`、`episodeDate: not-a-date`、移除正文站內連結，文章驗證器三種情況都回傳零錯誤。Astro 建置仍可能攔住無效日期，但不會替文章驗證器補上來源一致性與未知欄位檢查。

目前未見 push／PR 上必跑的完整品質檢查 workflow；已存在的 Actions 主要負責連結與封面同步。19 個測試中的 UI 測試多為原始碼字串比對，不能證明實際操作正確。

建議增加已知欄位檢查、真實日期與集數一致性、正文站內連結數量／目標檔案、來賓欄位提醒，以及建置 HTML 檢查。對需要來源的日期核對做獨立檢查，不強迫每次一般單元測試連外。加入精簡瀏覽器 smoke test，涵蓋換頁後搜尋、排序與手機閱讀。

## 第二批：搜尋收錄與結構化資料

### 5. sitemap 缺少真實 lastmod（中優先）

位置：`astro.config.mjs:25`。

正式 sitemap 有 80 個 URL，未包含 `<lastmod>`。不是無效 sitemap，也不是不收錄的證據，但文章的 updatedDate 尚未透過 sitemap 傳達。

建議文章 URL 使用可靠的最後實質修改日；分類頁則依內容清單的真實變動維護。不要所有頁面每次 build 都寫今天。Google 明確要求 lastmod 反映有意義且可驗證的更新。

### 6. 舊議題 URL 並未真正回傳 HTTP 301（中優先，已確認）

位置：`src/pages/topics/male-privilege.astro`。

程式寫 `Astro.redirect(..., 301)`，但靜態部署後正式 URL 回應 200、沒有 Location，內容以 HTML 轉址與 canonical 指向新 URL。搜尋引擎可能仍能理解，但與註解所稱的 301 不一致。

建議以 Cloudflare Pages 的平台轉址規則處理，再驗證舊 URL 回傳 301 與正確 Location。原本 sitemap 已排除舊 URL，這點維持。

### 7. Podcast 媒體與人物標記不夠精準（中優先）

位置：`src/layouts/BlogPost.astro:77`、`src/layouts/BlogPost.astro:104`、`src/components/BaseHead.astro:68`。

`associatedMedia.contentUrl` 目前填 SoundOn 播放器頁；HEAD 檢查回應為 text/html。Schema.org 的 contentUrl 指實際媒體 bytes。應依公開 RSS enclosure 核實音檔 URL，再用 AudioObject；若不保存／維護音檔 URL，就移除不準確的 contentUrl，保留普通收聽連結。

來賓字串以頓號與逗號切成 Person。像 EP62 的「郭雅真，前臺灣男性協會理事長」會被切成兩個人物。建議把姓名、職稱與機構分欄，或至少禁止把職稱切成另一個 Person。

文章 BlogPosting 把 hosts 當 author，但文章頁沒有顯示主持人／整理者／審稿者的對應資訊。應先定義真實編輯責任，再讓可見署名與結構化資料一致；不要為 SEO 虛構作者、學歷或審稿。

### 8. 日期維護仍有 UTC／台灣日界線問題（中優先，已確認）

位置：`scripts/stamp-updated-dates.mjs:28`、`public/admin/config.yml:55`。

`today()` 使用 `toISOString().slice(0, 10)`，取得的是 UTC 日期。台灣 2026-10-26 00:30 會得到 2026-10-25，凌晨執行會少一天，與註解「系統日期」不符。

另外，已有 updatedDate 的乾淨檔案會保留原值；CMS 編輯沒有自動呼叫 stamp，後台設定也未提供 updatedDate 欄位，因此後台內容修改可能留下舊更新日。EP68 的 CMS 更新例子亦值得納入日期回歸測試。

建議集中使用 Asia/Taipei 日期轉換；補上 CMS 發布時的修改日期維護，並避免單純同步連結或 metadata 時造成不必要的新鮮度宣稱。

## 第三批：讓讀者與搜尋引擎更容易找到有用內容

### 9. 補強正文內鏈與相關文章推薦（中優先）

正文掃描發現六篇未達兩個不同目標：EP23、EP24、EP48、EP49 各一個；EP25、EP30 零個。目標都存在，未發現正文內鏈死連結。

另有 25 篇沒有其他文章的正文指入；這不表示孤島頁，因為列表、分類、搜尋與自動推薦仍有連結。

位置：`src/pages/blog/[...slug].astro:16`。目前推薦只要共享一個大分類，就按文章發布日期取最新三篇。因此 EP68 會推薦議題較遠的兒少網路性剝削文章，舊文也容易被新文擠出。

建議優先上下集、同書／同作品／同來賓，再按細緻概念重疊與相關性排序，日期作最後排序條件。為舊文補真正有脈絡的內鏈，不機械平均分配連結。

### 10. 七大議題頁適合升級為主題導讀（高搜尋價值，屬優化）

位置：`src/pages/topics/[topic].astro`、`src/data/topics.ts`。

目前分類頁主要是一句介紹加文章清單。建議保留七大分類，再增加少量有明確搜尋意圖的導讀，例如「男性情緒與求助」、「父權紅利」、「情緒勞動」、「男性凝視」。每頁用本站節目素材回答核心問題、整理爭點、指出不同觀點與推薦閱讀順序，再連到詳細單集文章。

這比大量增加相似文章或堆砌關鍵字更值得優先投入。先依 Search Console 查詢資料選題，不假設任何詞已有搜尋量或本站能競爭到排名。

### 11. 補足來源、編輯責任與節目獨有材料（高搜尋價值，屬優化）

目前有 AI 整理聲明與收聽連結，這是好的起點。下一步應清楚區分節目中的個人經驗、主持人評論與可查核的外部事實。

FAQ 加入了理論、學者與法律背景，但多數只連單集文章。建議重要外部定義附第一手來源，醫療／法律說法尤其需要可靠來源與適當的表述範圍。節目引言可補經確認的音檔時間點，方便讀者核對，不公開完整 SRT。

可新增編輯方針／更正流程，說明誰整理、誰實際審閱；維持主持人公開暱稱。不要只因「AI 生成」就推定有排名處罰，也不要把罐頭審稿標籤當成可信度。

Google 對 AI 搜尋的公開指引仍以基本 SEO、可索引、可引用且有幫助的內容為主，不要求特殊 AI 檔案或特殊 schema。現有 llms.txt 可以保留，但不應以「已建立 llms.txt」當成 Google／所有 AI 都會引用的保證。

### 12. 搜尋精準度與手機閱讀（中／低優先）

搜尋目前是全文 `includes`，輸入 EP6 實際得到 22 個結果，EP6 排在後段；其他集數與正文提及也混入。建議集數採精確辨識，名稱／標題優先，再比對正文；支援多關鍵詞、顯示命中片段與結果數量。

390px 手機抽查，EP68 第一段正文位於約 1243px；長標題、封面及完整來源區塊占了前面的空間。手機目錄被隱藏。建議保留來源透明度，縮短其預設呈現、提供可展開詳情／快速跳正文，增加折疊目錄。

文章封面目前產生 `loading="lazy"`，手機抽查它出現在第一屏，適合按版面條件設定 eager 與合理優先順序；是否改善 LCP 仍需實測。不要把所有列表圖片都改成 eager。

手機搜尋與模式按鈕為 38×38px，可擴大點擊區。排序的「集數」目前實際以 episodeDate 排序，應改成數字集數或調整標籤，並在同日發布時提供明確次排序。

## 程式碼整理方向

- 拆出共用的 episodeNumber、台灣日期、連結格式及人物資料轉換，減少網站、同步器、llms 與驗證器各自實作。
- 將 Header 中的搜尋、主題切換、列表排序、文章 reveal／目錄監聽拆成小模組；為 swup 換頁後的 observer／事件生命週期建立清理規則。此次沒有量測到記憶體洩漏，這是維護性建議。
- 相關文章改採可理解的相關性排序；保持同一結果在建置與瀏覽器一致。
- CMS 腳本目前使用 `decap-cms@^3.0.0` CDN 浮動版本，建議鎖定實測版本並安排受控升級，降低後台未改程式卻變動的風險。
- 68 篇規模尚不需要為分頁重構整站；清單變長時再加入可爬取的分頁、篩選與結果數，不只靠無限捲動。

## 建議實作順序與驗收

1. 先處理 OAuth 與依賴公告：既有 CMS 正常登入、來源錯誤／state 缺失被拒絕；依賴公告按實際使用情境列出處置。
2. 搜尋改成獨立快取資產，修正精確集數查詢；比較前後 HTML bytes、冷載入與搜尋速度。
3. 增加品質 CI、日期與來賓／連結資料檢查，讓已知錯誤有回歸案例。
4. 修正 HTTP 301、媒體／人物結構化資料與台灣更新日期；增加真實 sitemap lastmod。
5. 檢視 Search Console 的收錄、Google canonical、曝光、查詢字與頁面點擊率，選少量主題頁及舊文優化。四週後比較同等期間，不以一週內沒有流量變化判定成敗。

## 參考依據

- [Google：AI features and your website](https://developers.google.com/search/docs/appearance/ai-features)
- [Google：Build and submit a sitemap](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap)
- [Google：Article structured data／author](https://developers.google.com/search/docs/appearance/structured-data/article)
- [GitHub：Authorizing OAuth apps](https://docs.github.com/en/apps/oauth-apps/building-oauth-apps/authorizing-oauth-apps)
- [Schema.org：contentUrl](https://schema.org/contentUrl)
- [Astro 安全公告](https://github.com/advisories/GHSA-26w7-cxv4-gfx2)
- [@astrojs/rss 安全公告](https://github.com/advisories/GHSA-8j5q-mfj2-5q9q)
