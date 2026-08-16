# 交接紀錄 (HANDOFF)

> 本檔是 Codex、Claude 與其他 agent 共用的交接板。最新紀錄放最上方，舊紀錄不得刪除；專案長期規則以根目錄 `AGENTS.md` 為單一來源。

## 最新交接 — 2026-08-16 by Claude（恢復富文字、數據附註、三段主題）

- 這次做了什麼:
  - **恢復關於頁的富文字編輯**：移除上一筆的 `modes: [raw]`。改以「不使用會觸發崩潰的結構」來規避——把「兩種關鍵聲音缺席」從「編號清單＋粗體」改寫為兩個粗體標號段落（**（1）…**、**（2）…**），視覺不變但不會建立會崩潰的 list-item 節點。
  - **節目數據附註**：schema 新增 `statsNote`，顯示在「節目數據」標題旁的淺色小字（目前為「截至 2026.08」）；四筆數據的 label 已移除各自的「（截至 2026.04）」。後台新增「數據附註」欄位，日後只需改這一處。
  - **主題切換改為三段循環**：深色 ☾ → 淺色 ☀ → 同系統預設 ◐。偏好值存在 `localStorage['site-theme']`，可為 `dark`／`light`／`system`；`system` 依 `prefers-color-scheme` 解析，且已註冊 media query 監聽，作業系統切換時即時跟著變。`documentElement` 同時帶 `data-theme`（實際外觀）與 `data-theme-preference`（使用者選擇）。
- 為什麼這樣做 / 重要決策:
  - 富文字模式對非技術編輯者是必要的，因此選擇改內容結構而不是關閉編輯器；崩潰的觸發點是 Decap 3.x 在 list-item 合併時的 stale selection，段落結構不會走到那條路徑。
  - 首次到訪的預設維持 `dark`，不改變既有訪客體驗；`system` 是使用者可選的第三種，而非新預設。若要改成預設同系統，只需調整 `readPreference()` 與 BaseHead inline script 的 fallback。
  - BaseHead 的 inline script 也同步支援三種偏好，避免載入時閃爍。
- 目前狀態(能不能跑 / 有無已知問題):
  - `npm test` 14 項通過、`npm run build` 20 頁成功、`git diff --check` 無誤。
  - 已在瀏覽器實測：主題按鈕連點三次可正確循環並更新圖示與 aria-label；`statsNote` 以 12.8px 淺灰顯示；關於頁六段落與兩個標號段落渲染正常。
  - ⚠️ 殘留風險：若編輯者日後在富文字模式**自行插入編號／項目清單並在其中使用粗體**，仍可能觸發同一個上游崩潰。崩潰時錯誤視窗底部會提供完整內容可直接救回。`blog` 集合的內文同樣是富文字，風險相同。
- 尚未完成 / TODO:
  - 觀察 Decap 上游修正；修好後可考慮把清單結構改回。
  - 若團隊希望「同系統」成為預設外觀，需同時改 Header 的 `readPreference()` 與 `BaseHead.astro` 的 inline fallback。
- 給下一位 agent 的建議:
  - 主題相關邏輯有兩處必須同步：`BaseHead.astro` 的 inline script（防閃爍）與 `Header.astro` 的 `applyTheme`／`readPreference`。只改一處會造成載入時閃爍或狀態不一致。
  - 使用者回報後台崩潰時，先請他複製錯誤視窗最下方「已恢復的內容」，那是完整檔案內容，可直接存回 repo。

## 前次交接 — 2026-08-16 by Claude（修正關於頁後台編輯崩潰）

- 這次做了什麼:
  - 使用者從 `/admin` 編輯「關於節目」時，Decap 富文字編輯器丟出 `Cannot find a descendant at path [3,2,0,1]` 並中止。已把錯誤視窗保留下來的使用者版本存回 `src/content/pages/about.md`（第一、二段改寫與第一點的措辭都已保留）。
  - 將該欄位的 markdown widget 固定為 `modes: [raw]`，並補上簡易語法提示，讓後台改用純 Markdown 編輯。
- 為什麼這樣做 / 重要決策:
  - 崩潰發生在 Decap 3.15.1 的 Slate 富文字模式：在「編號清單項目內含粗體」的節點上做 merge/split 時，selection 仍指向已不存在的路徑。屬上游已知問題，與本專案設定無關。
  - 內容本身要保留編號清單與粗體（版面需要），因此改動編輯模式而非改寫內容結構；raw 模式不會建立 Slate 樹，可根絕這條崩潰路徑。
- 目前狀態(能不能跑 / 有無已知問題):
  - `npm test` 14 項通過、`npm run build` 20 頁成功、`git diff --check` 無誤；本機已確認關於頁六段落與兩個清單項目都正確渲染。
  - ⚠️ 已知風險：`blog` 集合的「內文」仍是富文字＋raw 雙模式。若文章內出現「清單項目內含粗體」並在富文字模式編輯，可能觸發同一個崩潰。目前文章多為段落、引言與標題，暫不更動編輯體驗；編輯者可自行切到 Markdown 模式規避。
- 尚未完成 / TODO:
  - 觀察 Decap 是否釋出修正；若上游修好，可評估把關於頁改回雙模式。
  - 若日後文章也遇到同樣崩潰，再考慮把 `blog` 的 body 一併改為 raw。
- 給下一位 agent 的建議:
  - 使用者回報後台崩潰時，先請他複製錯誤視窗最下方「已恢復的內容」，那是完整的檔案內容，可直接存回 repo，不必重打。

## 前次交接 — 2026-08-16 by Claude（站名、關於頁 CMS 化、雙日期與排序）

- 這次做了什麼:
  - 站名改為「新世紀直男戰士｜部落格」（`SITE_TITLE`，用於分頁標題／OG／RSS）；新增 `SITE_BRAND`＝「新世紀直男戰士」給導覽列，避免品牌列過長。
  - 修正既有的標題重複 bug：`about`／`blog`／`topics`／`topics/[topic]` 原本自行串接 `— SITE_TITLE`，而 `BaseHead` 也會再串一次，導致「關於節目 — 站名 — 站名」。現在頁面只傳純標題。
  - **關於節目頁改為後台可編輯**：新增 `pages` content collection 與 `src/content/pages/about.md`，`about.astro` 改為讀取該檔；`public/admin/config.yml` 新增「頁面 → 關於節目」的 files 集合（含標題、副標、SEO 摘要、各區塊標題、節目數據 list、初衷內文 markdown）。
  - 關於頁改版為使用者指定的順序：大標＋副標 → 分隔線 → 節目初衷 → 節目數據 → 收聽節目；移除舊的「節目特色／我們談的議題／主持群／節目願景」四個區塊。收聽區改用 6 平台清單。
  - 收聽平台資料抽出成 `src/data/listen-platforms.ts`，首頁彈窗與關於頁共用，避免兩處各維護一份。
  - **文章雙日期**：schema 新增 `episodeDate`（Podcast 上線日）。原本 `pubDate` 存的其實是節目上線日，已用 git 首次提交日回填為真正的文章發布日，並把舊值搬到 `episodeDate`（8 篇皆已轉換）。文章頁顯示「文章發布 X · 節目上線 Y」，列表卡片仍只顯示文章發布日。
  - **文章列表新增排序**：`/blog/` 右上角下拉選單，可選最新／最舊文章、最新／最舊集數；選擇會記在 localStorage。
  - 首頁「最新一集」改依 `episodeDate` 排序，維持 Podcast 時序（否則會變成最近整理的文章）。
  - 首頁收聽彈窗與列表排序的 script 都改為同時在載入與 `astro:page-load` 初始化，避免 swup 換頁後失效。
- 為什麼這樣做 / 重要決策:
  - `pubDate` 的語意正式定為「文章在本站發布的日期」，`episodeDate` 為「該集節目上線日期」；未填 `episodeDate` 時退回 `pubDate`。RSS 與 JSON-LD `datePublished` 沿用 `pubDate`，符合各自語意。
  - 關於頁內容改由 CMS 管理，是為了讓團隊自行修改文案，不必再改程式碼；頁面結構（區塊順序與樣式）仍在 `about.astro`。
  - 排序採前端 DOM 重排，維持靜態網站、不需額外路由或建置。
- 目前狀態(能不能跑 / 有無已知問題):
  - `npm test` 14 項通過、`npm run build` 20 頁成功、`git diff --check` 無誤。
  - 已在本機瀏覽器驗證：關於頁區塊順序與 6 平台、`/blog/` 四種排序實測正確、EP1 顯示「文章發布 2026年8月15日 · 節目上線 2024年2月18日」、分頁標題不再重複。
  - 變更**已本機提交，尚未 push**（等使用者確認上線）。
- 尚未完成 / TODO:
  - 等使用者確認後 `git push origin HEAD:main`。
  - `scripts/validate-generated-article.mjs` 的必填欄位尚未納入 `episodeDate`；自動產線寫新文章時應同時填寫兩個日期，`部落格改寫規則.md` 的 frontmatter 範本也還沒補上這個欄位。
  - 關於頁移除的「節目特色／議題／主持群／願景」內容目前沒有其他頁面承接，如需保留要另行安排。
- 給下一位 agent 的建議:
  - 新增文章時 `pubDate` 填當天（文章發布日）、`episodeDate` 填該集上線日，不要再把節目日期填進 `pubDate`。
  - 關於頁文案改在 `src/content/pages/about.md` 或 `/admin`，不要回頭把文字寫死在 `about.astro`。
  - 頁面標題只傳純標題給 `BaseHead`，站名由 `BaseHead` 統一串接。

## 前次交接 — 2026-08-16 by Claude（首頁收聽彈窗與星空）

- 這次做了什麼:
  - 首頁「收聽 Podcast」按鈕從直接外連改為開啟彈出式視窗（原生 `<dialog>`），內含 6 個平台，依序：Spotify、Apple Podcasts、YouTube、KKBOX、MixerBox、SoundOn，每個都有品牌 icon。
  - `src/consts.ts` 的 `PODCAST_LINKS` 從 3 個擴充為 6 個平台的節目主頁連結，來源為官方導覽頁 `https://portaly.cc/new.era.boys`。
  - 平台 icon：Spotify／Apple／YouTube 使用 Simple Icons 官方 logo（內嵌 SVG，品牌色）；KKBOX、MixerBox 的真 logo 從 portaly 下載，SoundOn 使用使用者提供的節目頭像圖，存於 `src/assets/platform-icons/`。
  - 首頁星空（全站 `body::before/after`，定義在 `global.css`）加多、加亮：小星點從 7 層增為 12 層、發光星從 8 顆增為 12 顆，並上調暗色模式 `--star-*` 透明度與 `body::after`／twinkle 峰值。往下淡出的遮罩維持不變。
- 為什麼這樣做 / 重要決策:
  - 用原生 `<dialog>` + `showModal()`，Esc 與背景點擊皆可關閉，無需額外套件；icon 全部內嵌／本機化，不依賴外部載入。
  - 星空只調暗色模式的亮度（`:root`），淺色模式 token 不動，避免白底星點變髒；「更多」則是兩種模式共用的圖層數量增加。
  - ⚠️ SoundOn 那張圖其實是節目在 YouTube 的頭像（使用者指定使用），並非 SoundOn 平台官方 logo；若要更精準可日後替換。KKBOX／MixerBox 為 portaly 上的真 logo。
- 目前狀態(能不能跑 / 有無已知問題):
  - `npm test` 14 項全部通過；`npm run build` 成功產生 20 頁；`git diff --check` 無空白錯誤。
  - 已在本機 `localhost:4321` 用瀏覽器實測：彈窗可開、6 平台 icon 與連結正確、✕ 可關；首頁頂部星空明顯變多變亮。
  - 變更**已在本機提交，但尚未 push 到 `main`**（等使用者確認是否上線）。
- 尚未完成 / TODO:
  - 等使用者確認後再 `git push origin HEAD:main` 讓 Cloudflare 部署。
  - 關於頁（`src/pages/about.astro`）的收聽區仍是舊的三顆平台按鈕，未套用此彈窗；若要一致化可後續處理。
  - SoundOn icon 若要換成官方 logo，替換 `src/assets/platform-icons/soundon.jpeg` 即可。
- 給下一位 agent 的建議:
  - 平台連結正本在 `src/consts.ts` 的 `PODCAST_LINKS`；彈窗與 icon 在 `src/pages/index.astro`。
  - 星空參數集中在 `global.css` 的 `--star-*`、`--top-starfield-*`；三個 `--top-starfield-background/size/position` 清單的圖層數必須一致。

## 最新交接 — 2026-08-16 by Codex（全站手機版修正）

- 這次做了什麼:
  - 直接在已部署網站以 390×844 手機尺寸檢查 `/blog/`、`/topics/`、`/about/` 與單篇文章；確認 `/blog/`、`/about/` 的主內容為 680px，確實超出手機視窗，`/topics/` 與單篇文章則正常。
  - 修正 `src/pages/blog/index.astro` 與 `src/pages/about.astro`，讓主內容寬度使用 `min(var(--content-width), calc(100% - 2.5rem))`，保留桌面 680px 閱讀寬度，手機左右各保留 1.25rem。
  - 擴大 `tests/site-shell.test.mjs` 的手機寬度回歸測試，文章總覽、議題索引、單一議題與關於節目頁都必須宣告不超出視窗的寬度規則。
  - 本機逐頁檢查首頁、文章總覽、議題索引、關於節目、EP1／2／3／4／5／48／49／64 與單一議題頁，所有頁面的文件寬度都沒有超出手機視窗。
  - 本次發布會一併帶上前一筆 `8ac3995` 的跨 agent 協作文件。
- 為什麼這樣做 / 重要決策:
  - 問題不是單一卡片，而是頁面 scoped CSS 的 `main { max-width: 760px; }` 權重較高，蓋掉全域 `max-width: calc(100% - 2.5rem)`，讓 `main` 維持 680px。
  - 不使用 `overflow-x: hidden` 掩蓋問題，而是修正實際內容寬度；桌面版仍沿用 `--content-width` 設計變數。
  - 手機驗證不能再只抽查一頁；公開前需至少覆蓋首頁、所有列表／介紹頁、單篇文章與單一議題頁。
- 目前狀態(能不能跑 / 有無已知問題):
  - `npm test` 14 項全部通過，`npm run build` 成功產生 20 個頁面，本機 390px 全頁巡檢通過。
  - `/topics/` 與單篇文章原本就沒有溢出；這次真正修改的是 `/blog/` 和 `/about/`。
  - 手機修正 commit `68d5711` 已推到 `main` 並完成 Cloudflare 部署；前一筆跨 agent 協作文件 `8ac3995` 也已一併上線。
  - 部署後再次以 390px 巡檢線上首頁、文章總覽、議題索引、關於節目、EP1／2／3／4／5／48／49／64 與單一議題頁，全部符合 `scrollWidth <= clientWidth`，目前沒有已知橫向溢出。
- 尚未完成 / TODO:
  - EP6 之後的歷史文章仍待依序處理；EP3–EP5 仍等待夥伴提供品質回饋。
- 給下一位 agent 的建議:
  - 遇到手機溢出先比較 `documentElement.scrollWidth` 與 `clientWidth`，再列出超出視窗的元素；不要只靠截圖猜，也不要直接隱藏橫向捲軸。
  - 修改任何主要頁面寬度後，都要以 390px 重新巡檢主要公開路由，並更新本交接板。

## 前次交接 — 2026-08-16 by Codex（建立協作架構）

- 這次做了什麼:
  - 建立跨 agent 協作架構：擴充根目錄 `AGENTS.md`，補齊技術棧、實際指令、程式碼風格、命名慣例、資料夾重點與固定協作規則。
  - 確認根目錄 `CLAUDE.md` 已是指向 `AGENTS.md` 的 Git symlink，兩個 agent 會讀到同一份規則，沒有另外建立會漂移的 Claude 專用副本。
  - 建立本交接板 `docs/HANDOFF.md`，往後每位 agent 收工前都要在最上方追加紀錄。
  - 將近期 Codex 更新整理進 `AGENTS.md`：前端視覺基線、文章版型、Podcast 自動化、單集連結與封面同步、EP3–EP5、手機版議題頁修正，以及 `部落格改寫規則.md` v3.7。
  - 更新 `系統架構.md`：補上 `episodeTitle`／`hosts` schema、目前雙欄文章版面、星空背景、`speak-human-tw` 校稿與完整發布步驟。
  - 更新 `客製化指南.md`：現行設計是全頁宇宙漸層加頂端漸淡星空，不再渲染獨立 Banner。
- 為什麼這樣做 / 重要決策:
  - `AGENTS.md` 負責長期規則與正本索引，`docs/HANDOFF.md` 只負責每次工作的短期狀態，避免規則散落在 Codex 與 Claude 各自的文件中。
  - `CLAUDE.md` 使用 symlink 而非複製檔，確保修改 `AGENTS.md` 後 Claude 立即讀到同一版。
  - 寫作、系統、自動化與視覺的詳細內容仍留在各自正本；交接板只記摘要、狀態與下一步。
  - 現行文章依使用者決策採 `draft: false` 直接發布；上線前仍須通過文章驗證、建置與敏感資訊檢查。
- 目前狀態(能不能跑 / 有無已知問題):
  - 網站可以正常執行。最近一次檢查為 `npm test` 全部 14 項通過；最近一次 `npm run build` 成功產生 20 個頁面。
  - 最近一個已推上 `main` 的功能 commit 是 `6ef29ec`，包含手機版議題頁修正與寫作規範 v3.7；Cloudflare Pages 已被觸發部署。
  - 已公開文章為 EP1、EP2、EP3、EP4、EP5、EP48、EP49、EP64。EP3–EP5 是供團隊檢查自動文章品質的最新一批。
  - 本機分支是 `agent/auto-episode-links`，它追蹤的 `origin/agent/auto-episode-links` 較舊；最近發布採 `git push origin HEAD:main`。操作前一定要先看 `git status` 與 `origin/main`。
  - `gh auth status` 顯示 GitHub CLI token 已失效，但 Git HTTPS push 目前可用。若下一步需要建立或管理 PR，須先重新登入 `gh`。
  - 本次協作文件會依使用者要求建立本機 commit，但沒有收到 push 指示，因此不會自行推到 GitHub。
- 尚未完成 / TODO:
  - 使用者若確認要公開這套協作文件，再把本次 commit 推到 `main`。
  - EP6 之後仍有大量歷史集數尚未轉成文章；下一批應從 EP6 依序處理，除非使用者另行指定。
  - Repo 已有 Podcast 自動化腳本，但「每兩週檢查新集、每天補兩篇歷史文章」是否已在 Codex App 建立持續排程，repo 內沒有可驗證紀錄；下一位 agent 不可直接宣稱排程正在執行，必須先查實際自動化狀態。
  - EP3–EP5 已上線等待夥伴審閱；若收到修改意見，需依 `部落格改寫規則.md` v3.7 與 `speak-human-tw` 回修。
- 給下一位 agent 的建議:
  - 開工先完整閱讀 `AGENTS.md` 與本檔，再依任務讀 `系統架構.md`、`部落格改寫規則.md`、`Podcast自動化與審稿.md` 或 `客製化指南.md`。
  - 保留使用者與其他 agent 的未提交修改，不得 reset、checkout、覆蓋或刪除；本機任何檔案也不得刪除。
  - 文章來源以逐字稿與 RSS metadata 為準；不確定引言講者時不署名，不可猜測平台連結、人物資料或事實。
  - 公開前必須檢查真實姓名、電話、Email、地址、API 金鑰、內部 URL 與其他敏感資訊；公開主持人名稱只能使用柏文、孝成、博志、沁儒。
  - 收工前在本檔最上方新增自己的交接區塊，寫明測試、commit、push 與未完成事項，不要覆蓋本次紀錄。
