# AGENTS.md — 新世紀直男戰士部落格（AI 接手指南）

> 給接手本專案的 AI 代理（Codex、Claude 等）與工程師的入口。有不確定的地方，先查對應正本，再以實際程式碼為準。

## 這個專案是什麼

把 Podcast《新世紀直男戰士》（直男視角討論性別議題的節目）每集內容整理成部落格。Astro 靜態網站＋Decap CMS 後台（`/admin`）＋GitHub＋Cloudflare Pages 自動部署，目標是 SEO 與 AEO（被 AI 引用）。

- 線上網址：<https://new-era-boysss.pages.dev>
- GitHub repo：`allen365apple/new-era-boysss`（本 repo 根目錄 = Astro 專案）
- 最新狀態看 `docs/HANDOFF.md` 最上面那筆。

## 跨 Agent 協作規則

以下為本專案的固定協作規則，必須原文保留：

```text
「每位 agent 收工前務必更新 docs/HANDOFF.md;開工前務必先讀
AGENTS.md 與 docs/HANDOFF.md。commit message 要清楚描述改動。」
```

- `AGENTS.md` 是所有 agent 的單一規則來源；根目錄 `CLAUDE.md` 維持為指向 `AGENTS.md` 的 symlink，不得改成另一份獨立規則。
- `docs/HANDOFF.md` 是逐次追加的交接板：最新放最上方，舊紀錄保留（太長時原文搬到 `docs/handoff-archive/`，不刪）；規則完整內容回到各自正本，不在交接板複製一套。
- 開工先看 `git status`，既有未提交修改視為其他 agent 或使用者的工作，不得擅自 reset、checkout、覆蓋或刪除。
- 收工前至少記錄：做了什麼、重要決策、測試狀態、已知問題、TODO、是否已 commit／push。

## 紀錄寫哪裡

- 每次工作的更新紀錄 → `docs/HANDOFF.md`（最上方新增一筆）。
- 會影響後續工作的規則或決策變更 → `docs/規則沿革.md` 最上方，按日期寫摘要與 commit；推翻舊決策時明寫「取代哪一版」，不要讓下一位 AI 猜。
- 詳細規則只改對應正本，本檔與沿革只記「改了什麼、正本在哪裡、是否已發布」。
- `_archive/`、`可刪除封存/` 與上層指標檔都不是正本，不得拿來覆蓋現行規則。

## 閱讀順序

1. 本檔，再讀 `docs/HANDOFF.md`（最新交接、測試狀態、已知問題與下一步）。
2. `系統架構.md`：系統組成、資料流、內容如何從 Podcast 變成文章。最重要，要讀完。
3. `部落格改寫規則.md`：「逐字稿 → 文章」的唯一正本（目前 v4.0），做內容生產線一定要看。
4. `docs/KB2_人名與專有名詞對照表.md`：Podcast 產線共用正本，音檔轉 SRT 與逐字稿轉文章前都要完整讀取，不是可跳過的參考資料。
5. 改風格才讀 `客製化指南.md`。

想查某條規則何時、為什麼改 → `docs/規則沿革.md`（不必每次讀）。逐字稿、節目企劃書（金鐘報名 PDF）、施工歷史放在 repo 上層資料夾，不在版控內，需要時向專案負責人索取。

## 規則正本在哪裡

| 想確認的事情 | 唯一或優先正本 |
|---|---|
| AI 接手順序、跨 agent 規則 | `AGENTS.md`（本檔） |
| 目前狀態、最近做了什麼 | `docs/HANDOFF.md` 最上面那筆 |
| 規則與決策的歷史 | `docs/規則沿革.md` |
| 系統組成、資料流、schema、部署 | `系統架構.md` 與實際程式碼 |
| Podcast 逐字稿改寫文章 | `部落格改寫規則.md` |
| Podcast 人名、來賓、作品名與自創詞 | `docs/KB2_人名與專有名詞對照表.md` |
| RSS、Whisper、歷史補文與發布流程 | `Podcast自動化與審稿.md` |
| 顏色、字體、背景與互動設計 | `客製化指南.md`，實況以 `src/styles/global.css` 為準 |
| 節目定位、成員與內容理解 | repo 上層的 `新世紀直男戰士_Podcast理解.md` |
| SoundOn 上架文案 | repo 上層 `SoundOn上架規則/`，不要和部落格規則混用 |

## Build／Test／Lint／Run 指令

Node 22.12 以上；沒有資料庫、沒有常駐後端（後台登入用 Cloudflare Pages Functions）。

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

## 寫程式的規矩

- 延續現有格式（tab 縮排、單引號、句尾分號），不要為個人偏好重排整份檔案。函式維持單一職責，超過約 50 行優先拆分；複雜資料轉換補必要註解。
- 修 bug 先新增能重現問題的測試；新功能同步補測試。提交前至少跑 `npm test`、`npm run build`、`git diff --check`。
- Commit message 用 `type(scope): 簡短描述`，例如 `fix(topics): 修正手機版溢出`；常用 type：`feat`、`fix`、`docs`、`style`、`refactor`、`test`、`chore`。
- 文章檔與單集封面以集數命名（`ep3.md`、`ep3.jpeg`），檔名即網址 slug。

## 容易踩的坑

- 改風格只改 `src/styles/global.css` 的 `:root` 與 `:root[data-theme='light']` 設計變數，全站連動；元件只引用變數，不在元件裡散落新色碼。細節見 `客製化指南.md`。
- 議題分類固定 7 種，定義在 `src/content.config.ts` 的 schema（顯示名稱與 slug 在 `src/data/topics.ts`）：男性困境／情感腳本／性別凝視／身份認同／在地事件／多元對話／聽眾互動。不要自創。
- 單集收聽連結（SoundOn／Apple Podcasts／Spotify）與 RSS 封面由 `scripts/sync-episode-links.mjs` 依集數同步，產文時不手填、不猜連結；無法確認的連結不顯示。
- 音檔與逐字稿只留在 repo 上層，不進 repo（`scripts/podcast-pipeline.mjs` 已這樣處理）。
- `public/robots.txt` 刻意允許 AI 爬蟲（GPTBot、ClaudeBot、PerplexityBot 等），這是 AEO 目標的一部分，不要擋掉。
- 網站 UI 與文章用台灣用語，避免中國用語與八股腔（文章細則見 `部落格改寫規則.md`）。

## 發文與部署

- 發文：在 `src/content/blog/` 新增 `.md`（frontmatter 照 `content.config.ts`），push 到 `main` 即上線；或由夥伴走後台 `/admin`（GitHub 登入 → 寫 → Publish）。
- 新文章預設 `draft: false` 直接發布，但要先通過結構、來源、專有名詞與敏感資訊檢查；發現錯誤立即從後台修正，需要暫時下架才改成 `true`。
- 內容生產線（RSS → Whisper → 依改寫規則產文 → 自動檢查 → 發布）細節見 `系統架構.md` 第 9 節與 `Podcast自動化與審稿.md`。
- 部署：push 到 GitHub `main` → Cloudflare Pages 自動 `npm run build` 並上線（約 20–60 秒），不需 GitHub Actions。
- 單集資料同步：GitHub Actions（`.github/workflows/sync-episode-links.yml`）每日或手動執行；Spotify 的 `SPOTIFY_CLIENT_ID`、`SPOTIFY_CLIENT_SECRET` 放 GitHub secrets，不能寫入 repo。
- 後台登入密鑰：GitHub OAuth 的 `GITHUB_CLIENT_ID`／`GITHUB_CLIENT_SECRET` 存在 Cloudflare 專案的環境變數，不在 repo 裡。改動 `functions/api/` 後要確認這兩個變數還在。

## 紅線

- 本 repo 是 public：成員真實全名、電話、Email、地址等個資一律不得出現在程式碼、文章或文件中；公開頁面只用節目公開的主持人暱稱。
- 設計集中管理：改風格走 `global.css` 的 `:root`，不硬編色碼。
- 文章品質優先：自動文章未通過檢查不得發布。
- 議題分類只用固定 7 種。
