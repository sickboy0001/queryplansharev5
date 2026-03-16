# qps5 開発プラン

## 1. プロジェクト初期化
- `npx create-next-app@latest` の実行
  - TypeScript, Tailwind CSS, ESLint, App Router, `src/` directory を使用
- 必要な依存ライブラリの追加
  - `@libsql/client` (Turso)
  - `next-auth@beta` (Auth.js v5)
  - `resend`
  - `fast-xml-parser`
  - `html-query-plan`
  - `lucide-react`
  - `clsx`, `tailwind-merge` (shadcn/ui 用)
- shadcn/ui の初期化

## 2. データベース・認証
- `docs/schema.sql` の作成とテーブル定義
  - `users`, `qps_posts`, `qps_comments`, `password_reset_tokens`, `email_verify_tokens`
- `src/lib/db.ts` で Turso クライアントの初期化
- `src/auth.ts` で Auth.js の設定（Credentials & Google）

## 3. サービス層 (Business Logic)
- `src/service/user-service.ts`: ユーザー情報の取得・更新
- `src/service/qppost-service.ts`: プランの投稿、一覧取得、編集、コメント管理
- 直接 SQL を実行する形式で実装（ORM 不使用）

## 4. UI/UX 実装
- 共通レイアウトとナビゲーション
- `PlanVisualizer` コンポーネントの実装 (`html-query-plan` 使用)
- 投稿画面: XML 貼り付け、タイトル・コメント入力
- 一覧画面: 公開プランの一覧、ユーザー別プラン一覧、新着コメント
- 設定画面: ユーザープロフィールの編集（Markdown 対応）

## 5. 認可・セキュリティ
- プラン閲覧・編集の認可ロジックの実装 (`is_public`, `is_active` に基づく)
- ゲスト投稿時の `edit_token` 管理
- レート制限と CAPTCHA (Turnstile) の検討

## 6. API・環境設定
- `.env.example` の作成
- `src/app/api/posts/route.ts` 等のエンドポイント実装
