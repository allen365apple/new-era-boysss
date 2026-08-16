# 交接紀錄 (HANDOFF)

> 本檔是 Codex、Claude 與其他 agent 共用的交接板。最新紀錄放最上方，舊紀錄不得刪除；專案長期規則以根目錄 `AGENTS.md` 為單一來源。

## 最新交接 — 2026-08-16 by Claude（首頁收聽彈窗與星空）

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
