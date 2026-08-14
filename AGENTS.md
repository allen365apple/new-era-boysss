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
```

Node 18+ 即可。沒有資料庫、沒有後端伺服器（後台登入除外，見下）。

---

## 程式碼地圖

| 路徑 | 作用 |
|------|------|
| `src/content.config.ts` | **文章資料結構（frontmatter schema）**。所有欄位與議題分類（7 種）定義在此。 |
| `src/content/blog/*.md` | 所有文章。一篇一個 markdown 檔，檔名即網址 slug。 |
| `src/consts.ts` | 網站標題、描述、節目名等品牌常數。 |
| `src/styles/global.css` | **設計變數（design tokens）**。改顏色/字體/間距只改這裡的 `:root`，全站連動。 |
| `src/layouts/BlogPost.astro` | **文章版型**。含頂部 AI 標示、左側目錄+捲動高亮、金句引用、文末收聽區塊。 |
| `src/pages/index.astro` | 首頁（文章列表，正方形縮圖）。 |
| `src/pages/about.astro` | 關於節目頁。 |
| `src/pages/blog/[...slug].astro` | 單篇文章動態路由。 |
| `src/components/BaseHead.astro` | 每頁的 SEO meta + Open Graph + JSON-LD 結構化資料。 |
| `public/robots.txt` | **明確允許 AI 爬蟲**（GPTBot、ClaudeBot、PerplexityBot…）。 |
| `public/admin/` | Decap CMS 後台（`index.html` + `config.yml`）。 |
| `functions/api/` | Cloudflare Pages Functions，處理 GitHub OAuth 登入握手。 |
| `astro.config.mjs` | Astro 設定（`site` 網址、sitemap、mdx）。 |

---

## 三大工作流程

### A. 發一篇文章
在 `src/content/blog/` 新增 `.md`，填好 frontmatter（見 `content.config.ts` 的 schema），push 到 `main` 即自動上線。
或由夥伴走後台 `/admin`（GitHub 登入 → 寫 → Publish）。**新文章預設 `draft: true`，審核過才改 `false` 發布。**

### B. 改網站風格
只改 `src/styles/global.css` 最上方的 `:root` 變數。細節見 `客製化指南.md`。不要在各元件檔裡零散改色。

### C. 內容生產線（Podcast → 文章）
半自動、人工審稿：Memo AI 轉逐字稿 → 依 `部落格改寫規則.md` 用 LLM 產出 Markdown 草稿 → 進後台審核 → 發布。
細節與成本見 `系統架構.md` 第 9 節。

---

## 部署與密鑰

- **部署**：push 到 GitHub `main` → Cloudflare Pages 自動 `npm run build` 並上線（約 20–60 秒）。不需 GitHub Actions。
- **後台登入密鑰**：GitHub OAuth 的 `GITHUB_CLIENT_ID` / `GITHUB_CLIENT_SECRET` 存在 **Cloudflare 專案的環境變數**，**不在 repo 裡**。改動 `functions/api/` 後要確認這兩個變數還在。

---

## 慣例與紅線（務必遵守）

- **不要把個資放進 repo 或網站**：本 repo 為 public。成員真實全名、電話、Email、地址等，一律不得出現在程式碼、文章或文件中（公開頁面只用節目公開的主持人暱稱）。
- **設計集中管理**：改風格走 `global.css` 的 `:root`，不要硬編色碼。
- **文章品質優先**：AI 只產草稿，一定經人工審稿才 `draft: false` 發布。
- **議題分類固定 7 種**（見 schema）：男性特權／情感腳本／性別凝視／身份認同／在地事件／多元對話／聽眾互動。不要自創。
- **繁體中文台灣用語**：文章與 UI 文字避免中國用語與八股腔（詳見 `部落格改寫規則.md`）。

---

*若你是 AI 代理：讀完上面「閱讀順序」的 2–4 份文件後，你應該已能獨立完成發文、改風格、與內容生產線的工作。有不確定的地方，優先查 `系統架構.md`。*
