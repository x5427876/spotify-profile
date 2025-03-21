# Spotify Profile

一個使用 Next.js 和 Spotify Web API 構建的個人化 Spotify 資料統計儀表板。通過這個應用程式，您可以查看您的 Spotify 聆聽習慣、最愛的歌手、播放清單等詳細資訊。

## 測試帳號

根據 Spotify 開發者政策，此應用程式目前無法直接訪問所有 Spotify 用戶資訊。您可以使用以下測試帳號進行體驗：

```bash
電子郵件: yitoxo4224@jobsfeel.com
密碼: spotifyprofiledemo
```

## 功能特點

- 🎵 查看您最近播放的音樂
- 👥 發現您最常聽的歌手
- 📊 獲取您的播放清單統計資料
- 🎧 即時播放控制
- 📱 響應式設計，支援所有裝置

## 技術棧

- [Next.js](https://nextjs.org/) - React 框架
- [NextAuth.js](https://next-auth.js.org/) - 身份驗證
- [Spotify Web API](https://developer.spotify.com/documentation/web-api/) - Spotify 資料存取
- [Tailwind CSS](https://tailwindcss.com/) - 樣式設計

## 開始使用

### 前置需求

- Node.js 18.0.0 或更高版本
- Spotify 開發者帳號
- Spotify API 憑證（Client ID 和 Client Secret）

### 安裝步驟

1. 克隆專案儲存庫：
```bash
git clone https://github.com/x5427876/spotify-profile.git
cd spotify-profile
```

2. 安裝依賴：
```bash
npm install
# 或
yarn install
# 或
pnpm install
```

3. 設定環境變數：
   - 複製 `.env.example` 到 `.env`
   - 在 [Spotify Developer Dashboard](https://developer.spotify.com/dashboard) 註冊您的應用程式
   - 將您的 Spotify API 憑證填入 `.env` 文件

4. 啟動開發伺服器：
```bash
npm run dev
# 或
yarn dev
# 或
pnpm dev
```

5. 在瀏覽器中打開 [http://localhost:3000](http://localhost:3000)

### 環境變數設定

在 `.env` 文件中設定以下環境變數：

```plaintext
SPOTIFY_CLIENT_ID=your_client_id_here
SPOTIFY_CLIENT_SECRET=your_client_secret_here
SPOTIFY_REDIRECT_URI=http://localhost:3000/api/auth/callback
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_nextauth_secret_here
```

## 部署

本專案可以輕鬆部署到 Vercel：

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/your-username/spotify-profile)

## 貢獻指南

歡迎提交 Pull Requests！對於重大更改，請先開啟 issue 討論您想要更改的內容。

## 授權

本專案採用 MIT 授權 - 查看 [LICENSE](LICENSE) 文件了解詳情。

Enjoy😉



