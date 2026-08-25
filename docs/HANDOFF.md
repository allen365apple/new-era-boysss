# 交接紀錄 (HANDOFF)

> 本檔是 Codex、Claude 與其他 agent 共用的交接板。最新紀錄放最上方，舊紀錄不得刪除；專案長期規則以根目錄 `AGENTS.md` 為單一來源。

## 最新交接 — 2026-08-25 by Codex（EP14／EP15 歷史補文）

- 本次發布：依歷史佇列完成 EP14、EP15；EP14 沿用既有本機 SRT，EP15 使用 Memo AI Small 本機模型轉錄。音檔、SRT、JSON、metadata、模型與 state 均留在 repo 外。新增 `src/content/blog/ep14.md`、`src/content/blog/ep15.md` 與兩張 RSS 封面，文章皆為 `draft: false`、`aiGenerated: true`。
- 文章核心：EP14 從偶像劇戀愛腳本、霸凌記憶與越界式癡情，談受傷後的情感封閉、求助及跨文化家庭裡的性別分工；EP15 從聯誼中的挑選視線、催婚催生、言語騷擾與資產展示，談界線回應、男性資格感與真誠傾聽。
- 名稱與引言：EP14 只使用主持人公開暱稱柏文、孝成、博志、沁儒；EP15 來賓依 metadata 使用 Nina，主持人為柏文、孝成、博志。只替上下文明確可確認的孝成與 Nina 引言署名；SRT 中無法確認的參加者姓名、作品名與組織名未寫入文章。
- 語感校稿：`speak-human-tw` 採自動產線「跳過確認、事後摘要」。EP14 第二輪無需追加修改；EP15 修改 3 處，降低重複的「真正」式強調，改成具體敘述，保護欄位、專有名詞與引言均未變動。
- 驗證狀態：EP14 約 1476 字、EP15 約 1568 字，兩篇皆為 5 節、4 句引用並通過 `validate:article`；`npm test` 18/18 通過、`npm run build` 33 頁成功、`git diff --check` 與敏感資訊／本機素材掃描通過。Spotify 未設定憑證，僅同步 SoundOn、Apple Podcasts 與 RSS 封面。
- 提交狀態：文章 commit `aa4bb99`（`docs(content): 發布 EP14、EP15 文章`）已建立；本交接紀錄以獨立文件 commit 提交後，一併推送 `origin/main`。

## 最新交接 — 2026-08-24 by Codex（EP12／EP13 歷史補文）

- 本次發布：依歷史佇列完成 EP12、EP13；兩集均使用 Memo AI Small 本機模型轉錄，音檔、SRT、JSON、metadata、模型與 state 留在 repo 外。新增 `src/content/blog/ep12.md`、`src/content/blog/ep13.md` 與兩張 RSS 封面，文章皆為 `draft: false`、`aiGenerated: true`。
- 文章核心：EP12 從陰柔男性、男性群體的陽剛表演與劇場身體訓練，談直男特權、未經邀請的指導與身體同意；EP13 從國中性平教育現場，整理身體界線、愛情價值觀、多元性別、月經知識與知情同意。
- 名稱與引言：EP12 來賓使用 metadata 可確認的蟲子、毓茹，作品為《不可憐的東西》、劇團為「不然，B 計畫」；EP13 來賓為小獅，節目為《獅來想去腐導室》。僅替上下文明確可確認的來賓引言署名，SRT 中無法確認的人名、書名與網路案例未寫入文章。
- 語感校稿：`speak-human-tw` 採自動產線「跳過確認、事後摘要」。EP12 第二輪無需追加修改；EP13 修改 2 處，移除生硬導引句，並把「不是 A，而是 B」降至全文一次，保護內容與事實保真回讀均完成。
- 驗證狀態：EP12 約 1610 字、EP13 約 1550 字，兩篇皆為 5 節、4 句引用並通過 `validate:article`；`npm test` 18/18 通過、`npm run build` 31 頁成功、`git diff --check` 與敏感資訊／本機素材掃描通過。Spotify 未設定憑證，僅同步 SoundOn、Apple Podcasts 與 RSS 封面。
- 提交狀態：文章 commit `2359ab0`（`docs(content): 發布 EP12、EP13 文章`）已推送 `origin/main`；本交接紀錄完成後另以文件 commit 推送。

## 最新交接 — 2026-08-23 by Codex（EP10／EP11 歷史補文）

- 本次發布：依歷史佇列完成 EP10、EP11；兩集均以 Memo AI Small 本機模型轉錄，音檔、SRT、JSON、metadata、模型與 state 留在 repo 外。新增 `src/content/blog/ep10.md`、`src/content/blog/ep11.md` 與兩張 RSS 封面，文章皆為 `draft: false`、`aiGenerated: true`。
- 文章核心：EP10 從 AV 片場工作、色情啟蒙與固定性愛腳本，談幻想和現實中的同意；EP11 從兄弟群體的叛徒感、情慾羞恥與「慾犬」，談拒絕文化、性自主及不傷人的慾望表達。
- 名稱與引言：本集來賓依 metadata 使用「小度」；主持人為柏文、孝成、博志、沁儒。僅替上下文明確可確認的小度引言署名，其餘不猜測。SRT 中數個疑似誤聽的作品／人物名未寫入文章。
- 驗證狀態：EP10 約 1535 字、EP11 約 1508 字，兩篇皆為 5 節、4 句引用並通過 `validate:article`；`npm test` 18/18 通過、`npm run build` 29 頁成功、`git diff --check` 與敏感資訊／本機素材掃描通過。Spotify 未設定憑證，僅同步 SoundOn、Apple Podcasts 與 RSS 封面。
- 提交狀態：文章 commit `8d7cb65`（`docs(content): 發布 EP10、EP11 文章`）；另有使用者指示保存封存的 `3aef92a`。本交接紀錄完成後一併推送 `origin/main`。

## 最新交接 — 2026-08-23 by Codex（保存 2026-08-21 改版前備份）

- 這次做了什麼：確認 `_archive/2026-08-21/` 是 SEO／內部連結與文章重構前的本機備份，包含 18 份已公開文章舊版，以及 `Footer.astro.bak`、`faq.astro.bak`，總計約 192 KB；依使用者指示納入版本控制。
- 安全檢查：未發現 API 金鑰、Token、Email、電話、地址、成員真實姓名、內部 URL、客戶資訊、音檔、逐字稿或 metadata；檔案中的網址只有公開 Podcast 平台連結與 Schema.org。
- 驗證狀態：封存檔不參與 Astro 建置；提交前仍執行 `git diff --check`、`npm test` 與 `npm run build`。
- 提交狀態：本次建立獨立 `chore(archive)` commit，不混入 Podcast 歷史補文文章提交；是否 push 另依使用者指示。

## 最新交接 — 2026-08-21 by Codex（修正文章發布日與單集上線日混用）

- 問題：EP6～EP9 初次補文時把 RSS `publishedAt` 填進 `pubDate`，導致文章頁顯示 2024 年的節目上線日，沒有反映本次 2026-08-21 的本站發布日。
- 修正：EP6～EP9 的 `pubDate` 已改為 `2026-08-21`；`episodeDate` 分別保留 RSS 轉台灣日期的 `2024-06-07`、`2024-06-21`、`2024-07-05`、`2024-07-19`。網站的雙日期語意重新寫入規則、Podcast 流程與系統架構。
- 防呆：文章驗證器現在要求新文章必填 `episodeDate`；排程提示已明確要求 `pubDate` 使用本次台灣發布日，`episodeDate` 使用 RSS `publishedAt` 的台灣日期。
- 驗證狀態：EP6～EP9 逐篇通過 `validate:article`；`npm test` 18 項通過、`npm run build` 24 頁成功、`git diff --check` 通過；同步工具確認沒有其他文章被改動。修正 commit `963dff2` 已推送至 `origin/main`。

## 最新交接 — 2026-08-21 by Codex（prepare 後直接接續產文與發布）

- 這次做了什麼：把 Podcast 流程明定為 `podcast:prepare` 成功後立即讀取 metadata／SRT、產生文章、逐篇驗證、同步單集連結、測試／建置、敏感資訊檢查，再 commit／push；不再停在「素材已就緒」。下載器新增公開音檔的有限重試，Whisper 提示改用精簡 KB2 名稱清單，避免提示超過模型上限。
- 本次發布：新增 `src/content/blog/ep6.md`、`src/content/blog/ep7.md` 與對應封面；兩篇均 `draft: false`、`aiGenerated: true`，已同步 SoundOn／Apple Podcasts 連結。
- 驗證狀態：EP6、EP7 的文章驗證通過；`npm test` 18 項通過、`npm run build` 成功、`git diff --check` 通過；文章文字敏感資訊掃描乾淨。音檔、SRT、metadata、模型均留在 repo 外。
- 人工確認：EP6 開場 SRT 出現無法可靠確認的「Ariel／笑真」；EP7 來賓正式寫法以「小P」為待確認項目。文章未猜測不確定主持人署名，只使用公開暱稱。
- 提交狀態：流程修正 commit `e1a4b62`、文章發布 commit `61b55de`、交接文件 commit `2c03d9c` 已建立並推送至 `origin/main`。

## 最新交接 — 2026-08-20 by Codex（修正音檔下載重試與 Whisper prompt）

- 這次做了什麼：`scripts/podcast-pipeline.mjs` 的音檔下載加入 3 次有限重試（1 秒／3 秒退避），對 408／425／429／5xx 與網路例外處理；最終錯誤會保留並顯示底層 `cause`。Whisper 的 KB2 提示改成只傳正確名稱清單並限制長度，避免超過 1024 token 上限。
- 背景：EP6 曾因 SoundOn 音檔 URL 302 轉址到 CDN 時暫時回報 `fetch failed`；重試後已成功完成本機 Memo AI Small 轉錄。EP6 音檔、metadata、SRT、JSON 均留在 repo 上層，不進 site repo。
- 測試狀態：新增重試與 prompt 長度測試；`npm test` 18 項通過、`npm run build` 20 頁成功、`git diff --check` 通過。
- 發布狀態：本次只修改下載器、測試與交接文件；尚未 commit／push，也未產出 EP6 文章。`site/` 目前有預期中的未提交修改，後續須先完成 EP6／EP7 文章流程或由使用者確認提交策略。

## 最新交接 — 2026-08-18 by Codex（補充圖片中的 SRT 辨識錯字）

- KB2 新增：`新世紀指南戰士` → `《新世紀直男戰士》`、`夏晨` → `孝成`、`沁如` → `沁儒`；開場整句範例補上 `伐GO 歡迎來到新世紀指南戰士 我是博文／我是夏晨／我是沁如／我是博智`。
- `伐GO` 暫列為開場口頭詞辨識結果，不能自行猜字；須回聽音檔確認。
- 轉錄正規化測試已同步涵蓋新增錯字；原始 SRT 不改。

## 最新交接 — 2026-08-18 by Codex（KB2 納入 Podcast 產線）

- 這次做了什麼：新增 `docs/KB2_人名與專有名詞對照表.md` 作為 Podcast 產線共用正本；同步更新 `Podcast自動化與審稿.md`、`AGENTS.md` 與 `系統架構.md`，要求音檔轉 SRT 及 SRT 轉文章前完整讀取 KB2。
- 程式調整：`scripts/podcast-pipeline.mjs` 會在 `prepare`／`normalize` 讀取並檢查 KB2，將對照內容帶入 Whisper 提示；已知安全錯字包含「吳英章 → 吳英彰」。
- 來源同步：`SoundOn上架規則/GPTs設定包/KB2_人名與專有名詞對照表.md` 標註為同步副本；原始 SRT 保留不改。
- 驗證狀態：新增 Podcast pipeline 的 KB2 載入與「吳英彰」正規化測試；`npm test` 16 項通過、`npm run build` 20 頁成功、`git diff --check` 通過；`validate:article` 已以 EP2 實測通過。
- 發布狀態：尚未 commit／push；本次不執行發布，待確認既有工作樹變更後再處理。

## 最新交接 — 2026-08-17 by Codex（建立本機故事回饋工作台）

- 這次做了什麼:
  - 在 repo 外層的 `故事資料庫/故事回饋.html` 新增離線回饋頁，嵌入 `stories.v0.2.json` 的 21 筆真人／具體場景故事。
  - 每筆故事顯示標題、故事內容與單一回饋欄；支援搜尋、只看已寫回饋、瀏覽器 localStorage 暫存、深淺色切換與下載 JSON 回饋檔。
  - 回饋檔包含 `storyId`、標題／故事內容快照、回饋文字與時間，之後可直接丟回給 AI 依 ID 對照修訂。
  - `故事資料庫/README.md` 已補上工作台連結與本機使用說明。
- 重要決策:
  - 工作台刻意放在 repo 外層故事資料庫，**不接入 Astro、不上線、不部署**；故事含身體界線、騷擾與家庭經驗，避免被公開網站索引。
  - 回饋只在本機瀏覽器暫存，按下載後才產生可交回的 JSON；頁面本身不會自動上傳資料。
- 驗證狀態:
  - 已確認 HTML 可解析、嵌入 21 筆且 ID 唯一；內嵌 JavaScript 通過語法解析。
  - `site/` 沒有本次變更；既有未追蹤 `_archive/` 保持原樣。
  - 尚未 commit／push，因使用者明確要求僅本機使用。
- 使用方式:
  - 直接開啟 `故事資料庫/故事回饋.html`，逐篇填寫；按右上角「下載回饋檔」後，把下載的 JSON 傳回對話即可。

## 最新交接 — 2026-08-21 by Claude（SEO/AEO 稽核＋修軟 404、GSC 欄位、sitemap）

- 這次做了什麼:
  - **修軟 404**：新增 `src/pages/404.astro`。原本專案沒有 404 頁，Cloudflare Pages 對所有不存在的網址回 **HTTP 200**（實測 `/this-page-does-not-exist`、`/blog/ep999/`、`/random-xyz` 全部 200），形成軟 404，會拖累 Google 對整站的信任。Astro 會輸出 `dist/404.html`，Cloudflare Pages 自動以 404 狀態提供。頁面套全站風格、帶 `noindex, follow`、導向首頁／所有文章／議題索引，並列出最新 3 篇。
  - **加 Google Search Console 驗證欄位**：`src/consts.ts` 新增 `GOOGLE_SITE_VERIFICATION`（目前留空字串），`BaseHead.astro` 只在有值時輸出 `<meta name="google-site-verification">`。**待使用者從 Search Console 取得驗證碼後填入即可**。
  - **修 sitemap 收錄 noindex 頁**：`astro.config.mjs` 的 `sitemap()` 加 `filter`，排除 `/topics/male-privilege/`（舊網址 301 轉址 stub，本身帶 `noindex`）。原本會讓 Search Console 報「已提交的網址標記為 noindex」。sitemap 由 24 → 23 個網址。
- 重要發現（線上實測）:
  - **網站目前完全沒被 Google 收錄**：搜節目名＋網域、搜文章獨特句（「善意的性別歧視」「走外側」）都查不到本站；排前面的是 TVBS、關鍵評論網、PanSci、udn 等高權重站。節目本身在 Apple／Castbox／Listen Notes／IG／Threads 收錄良好，只有部落格隱形。
  - **技術面沒有東西在擋**：robots.txt 全開含 6 種 AI 爬蟲並指向 sitemap、sitemap 200、無 noindex header、首頁 0.34s。
  - **最大結構性問題是 `.pages.dev` 網域**（在公共後綴清單上，Google 幾乎不給權重）。買自訂網域是投報率最高的動作，但需使用者付費決定，未執行。
  - 站上**沒有** Google Search Console 驗證痕跡、**沒有**任何分析工具（GA4／Plausible 皆無）。
  - 期間 Codex 已發布 EP6–EP9，現共 **12 篇**已發布文章；`llms.txt` 自動收錄無需手改（實測 12 筆）。
- **本回合後續已完成（承上稽核）**:
  - **Google Search Console 驗證成功**：使用者選「HTML 檔案上傳」法，驗證檔放在 `public/googled0126dcd9d5a177d.html`（此檔不可修改或刪除，否則會失去驗證）。注意 Cloudflare Pages 會把 `/xxx.html` 308 轉址到 `/xxx`，Google 仍成功跟隨轉址驗證通過。`consts.ts` 的 `GOOGLE_SITE_VERIFICATION` 保留為備用的 meta 標記法（目前留空、不輸出）。
  - **robots.txt 大幅更新**：補上決定「AI 回答時能否即時引用本站」的爬蟲 `OAI-SearchBot`、`ChatGPT-User`、`Claude-SearchBot`、`Claude-User`、`Perplexity-User`，以及 `Applebot`／`Applebot-Extended`、`meta-externalagent`；移除已停用的 `Anthropic-AI`；註記 llms.txt 位置。原本只開放訓練用爬蟲（GPTBot 等），是 AEO 的關鍵漏洞。
  - **加入 `PodcastEpisode` 與 `BreadcrumbList` 結構化資料**（`BlogPost.astro`）：PodcastEpisode 含 `episodeNumber`、`datePublished`（優先用 episodeDate）、主持人／來賓以 `、` 拆成 Person 陣列、SoundOn 單集音檔當 `associatedMedia`、`partOfSeries` 串到節目與六大平台、`subjectOf` 指回 BlogPosting。BreadcrumbList 為「首頁 › 所有文章 › 本篇」。BaseHead 的 BlogPosting 補 `inLanguage: zh-TW`。已驗證 12/12 篇三種 schema 齊全且 JSON 合法。
  - **12 篇加入 24 條內部連結**（原本總數 0）：每篇 2 條，自然嵌在既有句子、錨點含關鍵字，未新增段落、未動 frontmatter 與 blockquote 引言。EP48 ⇄ EP49 上下集互連已補。已驗證無自連、無死連結、無孤島頁。改動前備份在 `_archive/2026-08-21/blog-before-internal-links/`。
  - **EP48／EP49 依 v3.8 重構完成**：拆掉篇名式 H2、H3 升 H2 並改問句、補本集簡介開頭、12 處粗體引句改為正式引用框（各挑 3–4 句，歸屬不明確者不署名）、EP48 2288→1541 字／EP49 3445→1700 字、清掉 EP49 髒空格、EP48 補「女權自助餐」定義、補 `guests: 志豪` 與第三個 topic。
  - **EP3／EP5 小標全改問句**（原本各 0 個問句），並補關鍵字與定義：EP3「男子氣概」（站上原本 0 次）、EP5「Not All Men」「mansplaining」「情緒勞動」、EP64「跟蹤騷擾」＋《跟蹤騷擾防制法》。EP1 單段小節拆兩段。
  - **12/12 篇 `validate:article` 首次全數通過**。備份在 `_archive/2026-08-21/blog-before-restructure/`。
  - Google Search Console 的 sitemap 一度顯示「無法擷取」：已逐項實測（HTTP 200、`application/xml`、XML 合法含 23 網址、Googlebot UA 也回 200），且「上次讀取時間」為空，判定為 Google 尚未實際抓取的正常現象，不需重複提交。
  - **社群連結**：新增 `SOCIAL_LINKS`（Instagram／Threads／Facebook／Portaly，來源官方導覽頁，已逐一確認可連線）與共用元件 `SocialLinks.astro`（compact 給頁尾、full 給關於頁），logo 用 Simple Icons 官方路徑。首頁 `PodcastSeries` 的 `sameAs` 併入社群共 10 筆，協助實體整合。頁尾另加導覽（常見問題／議題索引／關於節目）。
  - **新增 `/faq/` 常見問題頁 + FAQPage 結構化資料**（12 題）：補上稽核指出的 AEO 最大缺口。**刻意不寫成「聽眾來信 Q&A」**——手上沒有真實聽眾提問，不編造；每題都是節目實際談過的內容，答案標明出自哪一集並連回文章（共連向 9 篇）。若要做真正的「聽眾互動」分類文章，需使用者提供真實的聽眾提問（Portaly 上有意見表單、IG 私訊）。
- 完整稽核結果（尚未執行的待辦，依投報率）:
  - **技術面高優先**：缺 `PodcastEpisode` schema（`episode`/`episodeTitle`/`listenLinks`/`hosts` 資料齊備卻沒標記，Podcast 站最大浪費）、缺 `BreadcrumbList` 與可見麵包屑、`dateModified` 全站不存在（schema 有 `updatedDate` 但 12 篇都沒填）、sitemap 無 `lastmod`、robots.txt 缺「即時檢索」bot（`OAI-SearchBot`、`ChatGPT-User`、`Claude-User`、`Claude-SearchBot` — 這幾支才決定 AI 回答時能否引用，GPTBot 只是訓練用）。
  - **內容面高優先**：12 篇正文的 Markdown 內部連結 **總數 0**（連 EP48 結語寫「下一集…」都沒連到 EP49）；EP48／EP49 結構嚴重不符 v3.8（只有 1 個篇名式 H2、小節全降級成 H3、0 個 blockquote 金句、EP49 達 3963 字約規格 2.5 倍、無導言段）；H2 標題偏文學（EP3／EP5 各 0 個問句），對 SEO/AEO 不利。
  - **關鍵字缺口（站上 0 覆蓋、台灣搜量高）**：兵役／當兵、家務分工、育嬰假／父職、情緒勞動、mansplaining、家暴、男性心理健康／自殺率、恐同／同志議題。另「男子氣概」是純關鍵字錯配（站上只用「陽剛氣質」）。
  - **`topics` 有兩個分類 0 篇文章**：`在地事件`、`聽眾互動`。後者天生是 FAQ 結構，是目前 AEO 最缺的一塊。
- 目前狀態(能不能跑 / 有無已知問題):
  - `npm run build` 25 頁成功（20→25 是 EP6–EP9 加上 404 頁）；`dist/404.html` 產生、`robots` meta 為 `noindex, follow`；sitemap 已排除 male-privilege；GSC 留空時不輸出 meta（已驗證）。
  - 瀏覽器實測 `/this-page-does-not-exist` 顯示自製 404 頁、樣式與導覽正常。
- 尚未完成 / TODO:
  - 使用者需自行：①登錄 Google Search Console 取得驗證碼交給 agent 填入 → 提交 sitemap → 用「網址檢查／要求建立索引」逐篇催收錄；②評估購買自訂網域；③社群貼文附文章連結取得外部連結。
  - 上述稽核待辦都未執行，等使用者決定優先順序。
- 給下一位 agent 的建議:
  - 投報率最高且最無風險的是**補內部連結**（現在是 0），尤其 EP48 → EP49 上下集互連。
  - 加 `PodcastEpisode` schema 不需新內容，資料已在 frontmatter。

## 最新交接 — 2026-08-17 by Claude（改寫規則升 v3.8、EP2–4 去 AI 味）

- 這次做了什麼:
  - **`部落格改寫規則.md` 升到 v3.8**（正本）。四項調整：①開頭＝本集簡介（綜合 RSS single `description`＋讀完逐字稿後的理解「自己寫」，不照抄 RSS，避免與平台簡介重複傷 SEO）；②每個 H2 小節維持 **2 個正文段落**（不再「可到 3 段」）、文末收尾 **2 段精簡短段**；③結尾**融入一個性別理論概念**，白話講、**自然帶出**（「這其實是一種善意的性別歧視」），**不掛學術招牌**（不要「性別研究裡認為…／女性主義主張…」），但**專有名詞用「」標出並解釋一句**；④**金句署名放進 `>` 引用區塊內**。§1 流程、§2–3 結構、§6 範本、§7 System Prompt、§9 檢查清單、footer 全部同步。
  - **去 AI 味依 `speak-human-tw`（v1.4.0）實戰補兩條規則**：`references/patterns.md` 第 12 種「不是A而是B」整篇最多一次、第 16 種不用反問句收尾整節；並清掉正文多餘破折號（第 23 種，署名的 `——` 不受限）。
  - **依新規重寫 EP2／EP3／EP4** 當對照範例：本集簡介開頭、每節 2 段、結尾 2 段融入一個概念（EP2「性別腳本」「善意的性別歧視」、EP3「男性腳本」「霸權陽剛氣質」、EP4「有毒的陽剛氣質」）、署名進引用區塊。
  - **`scripts/validate-generated-article.mjs`**：金句計數從 `^>\s+`（會把署名行與空 `>` 分隔行誤算）改為只數 `^>\s*[「『]`，署名移進引用區塊後不再誤判超量。
  - **EP48／EP49 的 `description` 重寫**：原本一篇是直接貼 RSS（截斷成「…」）、一篇是華麗 AI 腔，已依 v3.8「描述自己寫、白話、不照抄 RSS」改成乾淨自寫版（各約 68／78 全形字）；SEO meta 與 llms.txt 同步更新。註：這兩篇內文仍是舊結構（只有 1 個 H2），本次未動內文。
  - **新增 `llms.txt`（AEO）**：建 `src/pages/llms.txt.js` endpoint，建置時自動從 blog collection 產生 `/llms.txt`（規範見 llmstxt.org），依集數排序列出全部已發布文章（標題＋描述＋絕對網址）＋收聽平台＋關於／議題／RSS。新文章發布後自動更新，零維護。輸出 `content-type: text/plain`，已本機驗證。
  - **修手機版首頁 hero 標題頂到邊**：`.hero-title-line` 原本 `white-space: nowrap`，Android 系統字體放大時「台灣第一個由直男視角出發的」整行撐破容器頂到右緣。已在 `index.astro` 的 `@media (max-width:600px)` 加上 `.hero-title-line { white-space: normal }`，讓標題在手機上可換行；實測 root 放大到 24px（約 1.5×）時 `overflowX:false`、自動換行，正常字級維持設計的兩行。
  - **標題路線＝為 SEO 改寫，並定調「關鍵字優先型」**：本回合曾試著把 8 篇 `title` 改成「節目原標題去 EPXX：前綴」，但團隊確認標題目的是 SEO（從逐字稿挑關鍵字改寫），已撤回。接著把方向定為**關鍵字優先型**（核心概念詞放句首、`[關鍵字]+[白話鉤子問句]`、≤約30全形字、全形標點、系列上下集差異化），並**重擬全 8 篇已發布文章標題**（EP1–EP5、EP48、EP49、EP64）。例：EP3「陽剛氣質一定要強大？從動漫影視看非典型男性角色」、EP48/49 差異化為「女權vs平權/女性弱勢」與「男性權益/性別困境」。規則寫進 v3.8 §6、§7。日後可接 Google Search Console 用真實搜尋詞再微調。
- 為什麼這樣做 / 重要決策:
  - 使用者要「不掛學術招牌但要標專有名詞」是刻意的平衡：既不要說教感，又要保留 AEO／SEO 需要的關鍵詞（`「性別腳本」` 這類詞被 AI 引用時是加分項）。
  - `speak-human-tw` 是**互動式 skill**，鐵則是「先列編號清單、等使用者勾選才動筆」；本次照走，使用者確認核心項目後才改。低優先的兩處（EP3 開頭「不只是娛樂」、EP4 連續反問收尾）在容忍範圍內、還帶人味，暫留未改。
- 目前狀態(能不能跑 / 有無已知問題):
  - EP2/3/4 均通過 `npm run validate:article`（3–4 句引用、5 節、每節 2 段、結尾 2 段）、`npm run build` 20 頁成功。
  - 渲染確認：署名（`—— 博志，主持人` 等）已在 `<blockquote>` 內，且引用框的自動引號符號本就以 `content: none` 關閉，不會把署名套上「」。
- 尚未完成 / TODO:
  - 其餘已發布文章（EP1、EP5、EP48、EP49、EP64）尚未回頭套 v3.8 的開頭簡介／結尾理論／署名進引用格式；日後補文或校稿時再逐篇對齊。
  - 低優先的 ③⑤ 兩處（見上）如要一致化可再處理。
- 給下一位 agent 的建議:
  - 寫新文章一律以 `部落格改寫規則.md` v3.8 的 System Prompt 為準；金句署名務必包在 `>` 內。
  - `speak-human-tw` 工具在 <https://github.com/Raymondhou0917/speak-human-tw>；本機環境沒有掛成 skill，需要時直接讀 repo 的 `SKILL.md` 與 `references/patterns.md`。

## 最新交接 — 2026-08-16 by Claude（修好排序失效、精簡首頁文案）

- 這次做了什麼:
  - **修正 `/blog/` 排序在換頁後失效**：原本排序 script 寫在頁面層。swup 換頁不會重新執行頁面自己的 `<script>`，所以從導覽列點「文章」進來時監聽器根本沒掛上，點選單毫無反應；只有直接輸入網址載入才有效。已把排序邏輯搬進 `Header.astro` 的共用 shell：`applySortOrder()`／`restoreSortOrder()` 加上 document 層 `change` 事件委派（與既有 theme／search 的做法一致），並在 `handlePageView()` 還原上次選擇。
  - 排序選項提供四種：「最新文章」「最舊文章」「最新集數」「最舊集數」；文章日期讀 `data-pub-date`，集數日期讀 `data-episode-date`（未填 `episodeDate` 時退回 `pubDate`）。
  - 首頁移除三個區塊標題右側的說明長句（最新一集／最近的節目文章／從哪個問題開始），`.section-heading` 由雙欄 grid 改為單欄。
  - 英文小標改為看得懂的字：`LATEST TRANSMISSION` → `LATEST EPISODE`、`RECENT STORIES` → `RECENT ARTICLES`（`SEVEN QUESTIONS` 對應七大議題，保留）；移除 hero 左下角無實際意義的裝飾字 `QUESTIONS IN ORBIT / 2026` 與其樣式。
- 為什麼這樣做 / 重要決策:
  - 這個 repo 有 swup 客戶端換頁，**任何需要互動的 JS 都不能只放在單一頁面的 `<script>`**，否則只有直接載入該頁才會生效。共用 shell（Header）＋事件委派是本專案既定模式，之後新增互動功能都應照這個做。
  - 除錯過程留下的教訓：用 `new Event('change')` 測試事件委派會誤判為壞掉，因為它預設 `bubbles: false`；驗證委派時必須用 `new Event('change', { bubbles: true })`，真實使用者操作本來就會冒泡。
- 目前狀態(能不能跑 / 有無已知問題):
  - `npm test` 14 項通過、`npm run build` 20 頁成功、`git diff --check` 無誤。
  - 已實測兩種進入方式：直接載入 `/blog/`、以及從首頁點導覽列「文章」（swup 換頁），排序都正確作用並記住選擇。
  - 首頁確認：三個區塊已無說明長句、小標為 LATEST EPISODE／RECENT ARTICLES／SEVEN QUESTIONS、hero 裝飾字已移除。
- 尚未完成 / TODO:
  - 首頁 `index.astro` 的收聽彈窗 script 仍在頁面層。目前彈窗只出現在首頁，且首頁多為初次載入，暫時可用；若日後發現從其他頁 swup 回首頁時彈窗打不開，要用同樣方式搬進共用 shell。
- 給下一位 agent 的建議:
  - 新增任何需要事件監聽的前端功能前，先確認它在 swup 換頁後仍會初始化；優先放進 `Header.astro` 的 shell 並用 document 事件委派。

## 前次交接 — 2026-08-16 by Claude（恢復富文字、數據附註、三段主題）

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
