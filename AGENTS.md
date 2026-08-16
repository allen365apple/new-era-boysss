# AGENTS.md — 新世紀直男戰士部落格（AI 接手指南）

> 這份文件是給接手本專案的 AI 代理（Codex、Claude 等）與工程師看的入口。
> 讀完這份，再照「閱讀順序」看完幾份文件，你就能全盤理解這個系統並開始工作。

---

## 這個專案是什麼（30 秒版）

把 Podcast 節目《新世紀直男戰士》（台灣第一個由直男視角出發、討論性別議題的節目）的每集內容，
整理成一個部落格網站。技術上是 **Astro 靜態網站 + Decap CMS 後台 + GitHub + Cloudflare Pages 自動部署**。
兩大目標：**SEO**（被 Google 搜到）與 **AEO**（被 AI 引用）。

- 線上網址：<https://new-era-boysss.pages.dev>
- GitHub repo：`allen365apple/new-era-boysss`（本 repo 根目錄 = Astro 專案）
- 後台：`/admin`

---

## 技術棧

- **前端與內容框架**：Astro 7、TypeScript（strict）、Markdown／MDX Content Collections。
- **互動與頁面切換**：原生瀏覽器 API、`@swup/astro`，以及標示於 `THIRD_PARTY_NOTICES.md` 的 Fuwari MIT 授權互動實作。
- **內容後台**：Decap CMS，設定在 `public/admin/`。
- **部署與登入**：GitHub public repo、Cloudflare Pages、Cloudflare Pages Functions、GitHub OAuth。
- **內容自動化**：Node.js 腳本、SoundOn RSS、Apple Podcasts 公開資料、Spotify API、本機 `whisper.cpp`。
- **執行環境**：Node.js 22.12 以上；沒有資料庫，也沒有常駐後端應用程式。

## 跨 Agent 協作規則

以下為本專案的固定協作規則，必須原文保留：

```text
「每位 agent 收工前務必更新 docs/HANDOFF.md;開工前務必先讀
AGENTS.md 與 docs/HANDOFF.md。commit message 要清楚描述改動。」
```

- `AGENTS.md` 是所有 agent 的單一規則來源；根目錄 `CLAUDE.md` 必須維持為指向 `AGENTS.md` 的 symlink，不得改成另一份獨立規則。
- `docs/HANDOFF.md` 是逐次追加的交接板。最新交接放最上方，保留舊紀錄；重要規則的完整內容仍回到各自正本，不在交接板複製另一套。
- 開工先檢查 `git status`，把既有未提交修改視為其他 agent 或使用者的工作，不得擅自 reset、checkout、覆蓋或刪除。
- 收工前至少記錄：做了什麼、重要決策、測試狀態、已知問題、TODO、是否已 commit／push。

---

## ⚠️ 先照這個順序讀（讀完就懂全貌）

1. **本檔（AGENTS.md）** — 你正在讀，是索引。
2. **`docs/HANDOFF.md`** — 最新一位 agent 做了什麼、測試狀態、已知問題與下一步。
3. **`系統架構.md`** — 整個系統怎麼組成、怎麼運作、內容如何從 Podcast 變成文章。**最重要，務必讀完。**
4. **`部落格改寫規則.md`** — 「逐字稿 → 文章」的唯一正本（目前 v3.8）。做內容生產線一定要看。
5. **`客製化指南.md`** — 改風格（顏色、字體、版面）的說明，全靠 `src/styles/global.css` 的設計變數。
6. **關鍵程式碼**（下方「程式碼地圖」）— 對照著看，理解資料結構與版型。

> 補充：本 repo 只含 Astro 專案本身。逐字稿、節目企劃書（金鐘報名 PDF）、施工歷史紀錄放在**本 repo 的上層資料夾**，不在版控內，需要時向專案負責人索取。

---

## 最新狀態與更新紀錄（交接必讀）

這一節是跨 AI 的共用交接點。每次有已完成、會影響後續工作的功能或規則變更，都在這裡新增一筆；**只記決策摘要與正本位置，不複製完整規則**。下一位 Codex、Claude 或工程師應先讀這一節，再依連結回到正本。

### 目前狀態快照（2026-08-16）

- 線上 `main` 功能基線以 `git log origin/main -1` 為準。網站由 GitHub `main` 觸發 Cloudflare Pages 自動部署；2026-08-16 已完成主要公開頁的全站手機寬度檢查。
- 已公開文章：EP1、EP2、EP3、EP4、EP5、EP48、EP49、EP64。
- 寫作規則：`部落格改寫規則.md` v3.8；標題為 SEO／AEO 從逐字稿關鍵字改寫、採「關鍵字優先型」（核心概念詞放句首、≤約30全形字、上下集差異化）、開頭＝本集簡介（綜合 RSS＋逐字稿自己寫、不照抄）、4–5 節、每節 2 個正文段落、金句署名放進引用區塊內、文末分隔線 + 2 段收尾且融入一個性別理論概念（自然帶出、不掛學術招牌，專有名詞用「」標出並解釋一句）。
- 去 AI 味：`speak-human-tw` 為文章第二輪校稿正本；自動產線採「跳過確認、事後摘要」。實戰重點：「不是A而是B」整篇最多一次、不用反問句收尾整節、正文少用破折號（署名除外）、全形標點。集數、日期、名稱、公開暱稱、平台連結與已選定引言屬保護內容。
- 文章發布：目前依團隊決策使用 `draft: false` 直接發布，通過建置與敏感資訊檢查後推到 `main`；錯誤可從 `/admin` 修正，嚴重時再改成草稿下架。
- 單集資料：SoundOn／Apple Podcasts／Spotify 連結與 RSS 單集封面由 `sync-episode-links.mjs` 依集數同步，文章產出時不手填猜測連結。
- 自動化：本機使用 `whisper.cpp` 與 Memo AI 已下載的 Small 模型；新集與歷史補文流程見 `Podcast自動化與審稿.md`。
- 前端基線：以 `680f880` 的 Fuwari 導覽列與互動為底，再保留連續文章閱讀版面；全站有深色／淺色模式、文章搜尋、頁面過渡、滑鼠互動與頂部漸淡星空背景，不再顯示獨立 Banner。
- 文章頁：左欄顯示本文目錄、CATEGORY、TAGS、EPISODE；右欄為主要文章。來源說明與收聽按鈕在文章上方，文末小結後提供文字收聽連結。
- 行動版：首頁、文章總覽、議題索引、關於節目、所有已發布單篇文章與單一議題頁都已用 390px 裝置寬度實測；文章總覽與關於頁的 scoped CSS 溢出問題已修正。

### 規則正本在哪裡

| 想確認的事情 | 唯一或優先正本 |
|---|---|
| AI 接手順序、目前狀態、跨版本更新 | `AGENTS.md`（本檔） |
| 系統組成、資料流、schema、部署 | `系統架構.md` 與實際程式碼 |
| Podcast 逐字稿改寫文章 | `部落格改寫規則.md` |
| RSS、Whisper、歷史補文與發布流程 | `Podcast自動化與審稿.md` |
| 顏色、字體、背景與互動設計 | `客製化指南.md`，實況以 `src/styles/global.css` 為準 |
| 節目定位、成員與內容理解 | repo 上層的 `新世紀直男戰士_Podcast理解.md` |
| SoundOn 上架文案 | repo 上層 `SoundOn上架規則/`，不要和部落格規則混用 |

### 近期更新

#### 2026-08-17

- `部落格改寫規則.md` 升到 **v3.8**（正本，取代 v3.7 的段落與收尾規格）：①開頭＝本集簡介（綜合 RSS single description＋逐字稿理解自己寫，不照抄 RSS）；②每節 2 個正文段落、文末收尾 2 段精簡；③結尾融入一個性別理論概念，自然帶出、不掛「性別研究裡…／女性主義主張…」的說教招牌，但專有名詞用「」標出並解釋一句；④金句署名放進 `>` 引用區塊內。去 AI 味依 `speak-human-tw` 實戰補兩條：「不是A而是B」整篇最多一次、不用反問句收尾整節。
- 依新規重寫 EP2／EP3／EP4 作為對照範例，並清掉正文多餘破折號；三篇通過 `validate:article` 與 `npm run build`。
- 標題路線維持「為 SEO 從逐字稿關鍵字改寫」（不用節目原標題；曾一度改成節目標題去 EPXX，已撤回）。並定調**關鍵字優先型**：核心概念詞放句首、`[關鍵字]+[白話鉤子問句]`、≤約30全形字、全形標點、系列上下集差異化。已依此重擬全 8 篇已發布文章標題（EP1–EP5、EP48、EP49、EP64）。
- `scripts/validate-generated-article.mjs`：金句計數改成只數 `> 「…」` 開頭的引用行，署名行（`> —— 姓名`）與空的 `>` 分隔行不再被誤算成金句（署名移進引用區塊後的必要修正）。
- 舊版正本備份於 `_archive/2026-08-17/`（規則 v3.7、AGENTS、HANDOFF）。

#### 2026-08-16

- `68d5711`：線上量測發現 `/blog/` 與 `/about/` 的 scoped `max-width` 蓋過全域手機寬度，造成主內容固定為 680px；改用 `min(var(--content-width), calc(100% - 2.5rem))`，並把首頁、列表、關於頁、所有文章與單一議題頁納入 390px 實測。
- `6ef29ec`：修正議題索引與單一議題頁在手機上超出畫面的問題；`部落格改寫規則.md` 更新到 v3.7，加入 `speak-human-tw`、台灣用語、全形標點、AI 痕跡與保真檢查。
- `1fe07ab`、`2e3e978`：完成 EP3、EP4、EP5 文章並直接發布；同步 EP1–EP5 等既有文章的正確單集連結與 RSS 封面。
- `199869d`、`651a291`：依使用者決定回到 `680f880` 的版面基線，再加入頂部星空漸淡背景、文章左側 CATEGORY／TAGS／EPISODE、導覽列捲動行為、tag 動畫與完整正方形縮圖；維持雙欄而非三欄文章版面。
- `680f880`：移植 Fuwari 的 MIT 授權導覽列與互動基礎，加入搜尋、深淺色切換與頁面過渡；授權記錄在 `THIRD_PARTY_NOTICES.md`。
- `603c016`、`04155f5`、`ad92bdd`：統一文章頂部來源說明與收聽按鈕、文末分隔線／小結／文字連結，並修正 Decap CMS 預覽的空連結錯誤。
- `3fe1e10`、`87ca19d`、`6f615f8`：確立「宇宙編輯部」視覺方向、將固定分類「男性特權」改為「男性困境」，並換上節目主視覺 favicon。

#### 2026-08-15

- `e6223f4`：建立 RSS → 音檔 → 本機 Whisper → SRT → 文章 → 驗證 → 發布的 Podcast 自動化骨架；歷史文章可由 EP2 起依序補齊。
- `af09b19` 至 `2e3e978`：建立並多次校準 `sync-episode-links`，依單集集數同步 SoundOn、Apple Podcasts、Spotify 與 RSS 封面；無法確認的連結不顯示。
- `19aca26`、`df44efd`、`9dbf1bf`、`42492e5`：完成 EP64 初稿、發布、重寫與規則校準。
- `2be8cc0`、`66dfd02`：逐步更新文章規則的篇幅、4–5 節結構、引言署名與段落密度；後續以目前 v3.7 為準。
- `3ed4830`、`311d6cb`：建立議題索引、SEO／AEO、來源資訊卡、金句版型、CMS 欄位與本 AI 接手文件。

### 維護這份紀錄的規則

1. 完成一批會影響後續工作的變更後，在「近期更新」最上方按日期新增摘要與 commit。
2. 詳細規則只改對應正本；本節只記「改了什麼、正本在哪裡、是否已發布」。
3. 若新決策推翻舊決策，更新「目前狀態快照」，並在紀錄中明寫「取代哪一版」，不要讓下一位 AI 猜。
4. `_archive/`、`可刪除封存/` 與上層指標檔都不是正本，不得拿來覆蓋現行規則。

---

## 快速上手

```bash
git clone https://github.com/allen365apple/new-era-boysss.git
cd new-era-boysss
npm install
```

Node 22.12+。沒有資料庫、沒有後端伺服器（後台登入除外，見下）。

### Build／Test／Lint／Run 指令

| 工作 | 指令 | 說明 |
|---|---|---|
| 安裝依賴 | `npm install` | 依 `package-lock.json` 安裝；CI 可使用 `npm ci`。 |
| Run（開發） | `npm run dev` | 啟動 Astro 開發伺服器，預設 `http://localhost:4321`。 |
| Build | `npm run build` | 正式建置到 `dist/`；提交前必跑。 |
| Preview | `npm run preview` | 預覽已建置的 `dist/`。 |
| Test | `npm test` | 執行 `tests/*.test.mjs` 的 Node 測試。 |
| Lint | 目前沒有獨立指令 | 專案尚未配置 ESLint／Prettier，不得假裝已通過 lint；最低檢查是 `npm test`、`npm run build` 與 `git diff --check`。 |
| 驗證文章 | `npm run validate:article -- src/content/blog/epN.md` | 檢查文章結構、分類、公開暱稱與敏感資訊。 |
| 預覽單集同步 | `npm run sync:episode-links` | 預覽單集連結與 RSS 封面，不寫檔。 |
| 寫入單集同步 | `npm run sync:episode-links -- --write --include-drafts` | 確認結果後才寫入文章與封面。 |
| 查看 Podcast 佇列 | `npm run podcast:status` | 查看本機 RSS／轉錄處理狀態。 |

## 程式碼風格與命名慣例

- TypeScript／JavaScript 使用 camelCase；元件與型別使用 PascalCase；常數使用 UPPER_SNAKE_CASE。
- Astro 元件檔使用 PascalCase（如 `ArticleCard.astro`）；腳本與一般工具檔使用 kebab-case（如 `sync-episode-links.mjs`）。
- 文章檔與單集封面以集數命名：`ep3.md`、`ep3.jpeg`；網址 slug 使用小寫 kebab-case。
- 延續現有格式：tab 縮排、單引號、句尾分號；不要為了個人偏好重排整份檔案。
- 函式維持單一職責，新增公開函式或複雜資料轉換時補上必要註解；避免超過約 50 行，超過時優先拆分。
- 修 bug 時先新增能重現問題的測試；新功能同步補測試。提交前至少執行 `npm test`、`npm run build`、`git diff --check`。
- UI 色彩與主題值集中在 `src/styles/global.css` 的 `:root` 與 `:root[data-theme='light']`；元件只引用設計變數，不散落新色碼。
- UI、文件與文章使用繁體中文台灣用語；文章額外遵守 `部落格改寫規則.md`。
- Commit message 使用 `type(scope): 簡短描述`，例如 `fix(topics): 修正手機版溢出`；常用 type 為 `feat`、`fix`、`docs`、`style`、`refactor`、`test`、`chore`。

---

## 程式碼地圖

| 路徑 | 作用 |
|------|------|
| `src/content.config.ts` | **文章資料結構（frontmatter schema）**。所有欄位與議題分類（7 種）定義在此。 |
| `src/content/blog/*.md` | 所有文章。一篇一個 markdown 檔，檔名即網址 slug。 |
| `src/data/topics.ts` | 七種議題的顯示名稱、網址 slug 與說明，供議題索引與主題頁共用。 |
| `src/consts.ts` | 網站標題、描述、節目名等品牌常數。 |
| `src/styles/global.css` | **設計變數（design tokens）**。改顏色/字體/間距只改這裡的 `:root`，全站連動。 |
| `src/components/ArticleCard.astro` | 首頁、文章總覽與議題頁共用的文章卡片。 |
| `src/layouts/BlogPost.astro` | **文章版型**。含頂部 AI 來源與收聽按鈕、左側目錄+捲動高亮、金句引用、文末完整集名與文字收聽連結。 |
| `src/components/Header.astro` | Fuwari 基礎的導覽列、文章搜尋、深淺色切換與捲動顯示行為。 |
| `src/pages/index.astro` | 首頁（文章列表，正方形縮圖）。 |
| `src/pages/about.astro` | 關於節目頁。 |
| `src/pages/blog/index.astro` | 所有文章總覽頁。 |
| `src/pages/topics/` | 議題索引與七種議題的文章彙整頁。 |
| `src/pages/blog/[...slug].astro` | 單篇文章動態路由。 |
| `src/components/BaseHead.astro` | 每頁的 SEO meta + Open Graph + JSON-LD 結構化資料。 |
| `scripts/sync-episode-links.mjs` | 從 RSS／Apple／Spotify 比對並同步文章的單集收聽連結與 RSS 封面。 |
| `scripts/podcast-pipeline.mjs` | RSS 佇列、音檔下載與本機 Whisper 轉錄；音檔和逐字稿只留在 repo 上層。 |
| `scripts/validate-generated-article.mjs` | 檢查自動文章的結構、文末小結、固定分類、公開暱稱與常見敏感資訊。 |
| `Podcast自動化與審稿.md` | 自動生產線、後台待審流程與本機指令。 |
| `docs/HANDOFF.md` | 多 agent 逐次追加的交接板；開工與收工都要讀寫。 |
| `.github/workflows/sync-episode-links.yml` | 每日或手動執行單集連結與封面同步。 |
| `public/robots.txt` | **明確允許 AI 爬蟲**（GPTBot、ClaudeBot、PerplexityBot…）。 |
| `public/admin/` | Decap CMS 後台（`index.html` + `config.yml`）。 |
| `functions/api/` | Cloudflare Pages Functions，處理 GitHub OAuth 登入握手。 |
| `astro.config.mjs` | Astro 設定（`site` 網址、sitemap、mdx）。 |

---

## 三大工作流程

### A. 發一篇文章
在 `src/content/blog/` 新增 `.md`，填好 frontmatter（見 `content.config.ts` 的 schema），push 到 `main` 即自動上線。
或由夥伴走後台 `/admin`（GitHub 登入 → 寫 → Publish）。**新文章預設 `draft: false` 直接發布；發現錯誤可從後台修改，需要暫時下架才改成 `true`。**

### B. 改網站風格
只改 `src/styles/global.css` 最上方的 `:root` 變數。細節見 `客製化指南.md`。不要在各元件檔裡零散改色。

### C. 內容生產線（Podcast → 文章）
本機自動發布、後台修正：RSS 下載音檔 → Whisper 轉逐字稿 → 依 `部落格改寫規則.md` 產出 Markdown → 自動檢查 → 發布；發現問題再進後台修正。
細節見 `系統架構.md` 第 9 節與 `Podcast自動化與審稿.md`。

---

## 部署與密鑰

- **部署**：push 到 GitHub `main` → Cloudflare Pages 自動 `npm run build` 並上線（約 20–60 秒）。不需 GitHub Actions。
- **單集資料同步**：GitHub Actions 每日或手動同步單集連結與 RSS 封面；Spotify 需要設定 `SPOTIFY_CLIENT_ID` 與 `SPOTIFY_CLIENT_SECRET` secrets，不能寫入 repo。
- **後台登入密鑰**：GitHub OAuth 的 `GITHUB_CLIENT_ID` / `GITHUB_CLIENT_SECRET` 存在 **Cloudflare 專案的環境變數**，**不在 repo 裡**。改動 `functions/api/` 後要確認這兩個變數還在。

---

## 慣例與紅線（務必遵守）

- **不要把個資放進 repo 或網站**：本 repo 為 public。成員真實全名、電話、Email、地址等，一律不得出現在程式碼、文章或文件中（公開頁面只用節目公開的主持人暱稱）。
- **設計集中管理**：改風格走 `global.css` 的 `:root`，不要硬編色碼。
- **文章品質優先**：自動文章必須先通過結構、來源、專有名詞與敏感資訊檢查，再以 `draft: false` 發布；發現錯誤立即從後台修正或改成草稿下架。
- **議題分類固定 7 種**（見 schema）：男性困境／情感腳本／性別凝視／身份認同／在地事件／多元對話／聽眾互動。不要自創。
- **繁體中文台灣用語**：文章與 UI 文字避免中國用語與八股腔（詳見 `部落格改寫規則.md`）。

---

*若你是 AI 代理：先讀本檔的「最新狀態與更新紀錄」，再讀上面「閱讀順序」的 2–4 份文件。完成重要變更後，記得回來追加更新紀錄。有不確定的地方，先查對應正本，再以實際程式碼為準。最後更新：2026-08-16。*
