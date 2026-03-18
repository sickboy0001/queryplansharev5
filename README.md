# qps5 - SQL Server Query Plan Share

SQL Server の実行プラン（Query Plan XML）を共有・可視化し、コメントを通じて分析を支援するWebアプリケーションです。

## 概要

`qps5` は、SQL Server の実行プラン（.sqlplan / XML）を貼り付けるだけで、SSMS（SQL Server Management Studio）風のグラフィカルなプランをブラウザ上で再現・共有できるプラットフォームです。

投稿されたプランに対して、本人や他のユーザー、さらにはゲストもコメントを残すことができ、パフォーマンスチューニングの議論を加速させます。

### 主な機能

- **プラン可視化**: XMLデータを SSMS 風のアイコンとツリー構造で表示。
- **柔軟な投稿**: ログインユーザーはもちろん、ゲストによる一時的な投稿（編集トークン付き）も可能。
- **詳細なアクセス制御**:
  - `IsPublic`: 全員に公開、またはログイン者のみに公開を切り替え。
  - `IsActive`: アーカイブ機能により、一覧からの非表示やコメントの制限を管理。
- **コメント機能**: Markdown形式でのコメント投稿に対応。プラン投稿者は他者のコメント削除が可能。
- **認証**: Google認証およびメールアドレスによるサインインに対応。

## 技術スタック

- **Framework**: [Next.js](https://nextjs.org/) (App Router)
- **Language**: TypeScript
- **Database**: [Turso](https://turso.tech/) (SQLite / libSQL)
- **Auth**: [NextAuth.js (Auth.js v5)](https://authjs.dev/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/), [shadcn/ui](https://ui.shadcn.com/)
- **Mailing**: [Resend](https://resend.com/)
- **Visualization**: `html-query-plan`
- **Deployment**: [Vercel](https://vercel.com/)

## セットアップ

### 1. リポジトリのクローン

```bash
git clone https://github.com/your-username/qps5.git
cd qps5
```

### 2. 依存関係のインストール

```bash
npm install
```

### 3. 環境変数の設定

`.env.local` ファイルを作成し、以下の項目を設定してください。

```env
# Database (Turso)
TURSO_CONNECTION_URL=libsql://your-db-name.turso.io
TURSO_AUTH_TOKEN=your-auth-token

# Auth.js
AUTH_SECRET=your-auth-secret
AUTH_URL=http://localhost:3000

# OAuth (Google)
AUTH_GOOGLE_ID=your-google-client-id
AUTH_GOOGLE_SECRET=your-google-client-secret

# Mailing (Resend)
RESEND_API_KEY=re_...
EMAIL_FROM=noreply@yourdomain.com
```

### 4. 開発サーバーの起動

```bash
npm run dev
```

[http://localhost:3000](http://localhost:3000) でアプリケーションが起動します。

## ディレクトリ構成

- `src/app`: App Router ページ、APIルート、認証グループ
- `src/components`: UIコンポーネント（Atomic Design 準拠）
- `src/lib`: データベース接続、ユーティリティ、認証設定
- `src/service`: ビジネスロジック
- `docs`: 仕様書、データベーススキーマ、設計図

## UIデザインコンセプト

「**Classic meets Modern**」
Windows 95/98/2000 時代の信頼感あるネイビー（#000080）を基調としつつ、現代的な余白とコンポーネント配置を採用しています。

## ライセンス

[MIT License](LICENSE)
