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


## 汎用的・再利用可能な機能リスト

本プロジェクトでは、他の機能やプロジェクトでも再利用可能な汎用性の高いコンポーネント、サービス、ユーティリティを実装しています。詳細は [`README_part.md`](README_part.md) を参照してください。

### 主なカテゴリ

| カテゴリ | 説明 |
|----------|------|
| **認証・ユーザー管理** | NextAuth.js 統合、ゲスト認証、パスワードリセット、ユーザー情報管理 |
| **コメント機能** | コメントの CRUD、権限チェック、Markdown 対応 |
| **投稿管理** | 投稿の CRUD、限定公開 URL 管理、アクセス制御 |
| **クエリプラン可視化** | SSMS 風グラフィカル表示、テーブル表示、XML 表示 |
| **UI コンポーネント** | shadcn/ui コンポーネント、カスタム UI（Markdown レンダラー等） |
| **レイアウト** | ヘッダー、サイドバー、モバイルメニュー |
| **共通ユーティリティ** | 日付処理、クラス名結合、データベースクエリ、メール送信 |
| **定数・設定** | ガイドコンテンツ、メニュー定義、デフォルト値 |
| **API ルートパターン** | 認証、投稿、コメント、ヘルプの API エンドポイント |
| **権限・アクセス制御** | 投稿者・管理者・ゲストの権限管理、公開範囲制御 |

詳細な機能リストとファイル参照については、[`README_part.md`](README_part.md) をご覧ください。

## ライセンス

[MIT License](LICENSE)


## TODO
- [x] Adminの場合はコメントの編集可能　削除可能
- [x] ヘルプ画面文面精査
- [x] コメント一覧画面も権限ある時は編集へ飛べる
- [x] プラン一覧画面も権限ある時は編集へ飛べる
- [x] プラン詳細の画面で、Xmlを見れるように
- [x] プラン詳細の画面で各ノード毎の情報も見れるように（ツールチップだと扱いにくいため）
- [x] ヘルプ画面の実装
- [x] 資格ごとの機能の割り当て
- [x] デプロイ後でResendでのテスト
- [x] ゲストでのプラン編集不可
- [x] ログイン者が投稿者の場合はブランの編集可能
- [x] ログイン者と投稿者が異なる場合はプランの編集不可
- [x] ログイン者が投稿者の場合はコメントの編集可能
- [x] ログイン者と投稿者が異なる場合はコメントの編集不可
- [x] Adminの場合のログイン名横にバッヂ表示
- [x] Adminの場合はブランの編集可能
- [x] 投稿者記載者などの名前についてツールチップで個人のコメントなど表示できるように、
  - [x] マークダウンでの記載もありえるので、クリックしてのリンクの機能を想定した動きが必要
- [ ] 認知のために
  - [x] QueryPlanの有用性、Zennへの投稿、
  - [x] citへの投稿、
  - [ ] LP作成
  - [ ] LP公開、
  - [ ] Zenn用記事の作成
  - [ ] Zenn用記事のアップロード


## history
- 2026/04/02 
  - 管理者用ダッシュボード、Looker対応（URL外だし）、ページタイトル調整
- 2026/03/20 
  - デザイン調整、AuthID周り、資料作成中・・
- 2026/03/20 [デプロイ](https://queryplansharev5.vercel.app/)
- 2026/03/19 FirstCommit