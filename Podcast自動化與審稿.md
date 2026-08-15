# Podcast 自動化與審稿

這份文件說明「RSS → 本機逐字稿 → 文章草稿 → 人工審稿 → 發布」的現行流程。文章寫作仍以 `部落格改寫規則.md` 為唯一正本。

## 自動化會做什麼

1. 讀取 SoundOn RSS，以集數與單集 GUID 判斷目前節目清單。
2. 新集數與歷史補文使用不同佇列，避免彼此重複處理。
3. 從 RSS 的 `enclosure` 下載 MP3 到本機。
4. 使用本機 `whisper.cpp`，優先沿用 Memo AI 已下載的 `Small` 模型轉成 SRT，讓每日批次在合理時間內完成。EP2 已用 Large 轉完，保留既有結果、不重跑。
5. 依 `部落格改寫規則.md` 產生 `draft: true` 的 Markdown 草稿。
6. 執行文章結構、公開暱稱、議題分類與敏感資訊檢查。
7. 同步單集封面與 SoundOn／Apple Podcasts／Spotify 連結。
8. 建置成功後才提交並推送；Cloudflare 不會公開 `draft: true` 的文章。

音檔、逐字稿、RSS metadata 與處理狀態都放在 repo 上層的本機資料夾，不會提交到公開 GitHub：

```text
podcast-automation/
├── audio/       # RSS 下載的 MP3
├── metadata/    # 單集 RSS 資訊
├── models/      # Whisper 模型
└── state.json   # 啟用自動化時的集數基準

各集逐字稿/
└── EPxx 自動轉錄.srt
```

## 最方便的審稿方式

1. 打開 `https://new-era-boysss.pages.dev/admin/`。
2. 進入「文章」，選擇「待審稿」篩選。
3. 點文章後直接修改標題、摘要、主持人、分類與內文。
4. 依下方「五分鐘審稿」順序檢查。
5. 確認後關閉最上方的「草稿（審完關閉即可發布）」並儲存。
6. GitHub 收到變更後，Cloudflare Pages 會自動部署。

後台已停用刪除文章，避免審稿時誤刪。排程完成時也會在 Codex 的排程紀錄列出新增文章與需要特別確認的地方。

### 五分鐘審稿

- **先看事實**：本集標題、來賓、主持人、作品名與專有名詞是否正確。
- **再看引言**：原話有沒有被改變意思；不確定講者的引言不得署名。
- **快速掃內文**：是否有逐字稿沒有的事件、心理狀態或過度延伸。
- **確認閱讀感**：4–5 節，每節至少兩個正文段落，沒有明顯 AI 套話。
- **最後看分類與摘要**：議題分類是否貼切，Google 摘要是否講清楚文章內容。

## 本機指令

在 `site/` 執行：

```bash
npm run podcast:status
npm run podcast:queue -- --mode=backfill --limit=2
npm run podcast:queue -- --mode=new --limit=2
npm run podcast:prepare -- --episode=2
npm run validate:article -- src/content/blog/ep2.md
npm run sync:episode-links -- --write --include-drafts
```

`podcast:prepare` 可重複執行：已有逐字稿時會直接沿用，不會重新下載和轉錄。任何步驟失敗時，都不得建立空文章或把該集標成完成。

## 安全與發布原則

- 自動化只建立 `draft: true` 草稿，不自行改成公開。
- 逐字稿、音檔與模型不可進入 public repo。
- 公開主持人名稱只能使用柏文、孝成、博志、沁儒。
- 文章提交前必須檢查 Email、電話、地址、API 金鑰、內部 URL 與成員真實姓名。
- 自動檢查只能降低風險，不能取代人工審稿。
- 本機排程需要 Mac 保持開機、連網，並讓 Codex 桌面 App 持續執行。
