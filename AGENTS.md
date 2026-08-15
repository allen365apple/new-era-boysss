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

## ⚠️ 先照這個順序讀（讀完就懂全貌）

1. **本檔（AGENTS.md）** — 你正在讀，是索引。
2. **`系統架構.md`** — 整個系統怎麼組成、怎麼運作、內容如何從 Podcast 變成文章。**最重要，務必讀完。**
3. **`部落格改寫規則.md`** — 「逐字稿 → 文章」的改寫規則（v3 精簡版）。做內容生產線一定要看。
4. **`客製化指南.md`** — 改風格（顏色、字體、版面）的說明，全靠 `src/styles/global.css` 的設計變數。
5. **關鍵程式碼**（下方「程式碼地圖」）— 對照著看，理解資料結構與版型。

> 補充：本 repo 只含 Astro 專案本身。逐字稿、節目企劃書（金鐘報名 PDF）、施工歷史紀錄放在**本 repo 的上層資料夾**，不在版控內，需要時向專案負責人索取。

---

## 快速上手

```bash
git clone https://github.com/allen365apple/new-era-boysss.git
cd new-era-boysss
npm install
npm run dev          # 開發預覽 http://localhost:4321
npm run build        # 產生正式靜態檔到 dist/（部署用）
npm run sync:episode-links  # 預覽同步單集連結與 SoundOn RSS 封面
```

Node 22.12+。沒有資料庫、沒有後端伺服器（後台登入除外，見下）。

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

*若你是 AI 代理：讀完上面「閱讀順序」的 2–4 份文件後，你應該已能獨立完成發文、改風格、與內容生產線的工作。有不確定的地方，優先查 `系統架構.md`。*
