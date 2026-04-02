## 汎用機能リスト

このプロジェクトで実装されている、他のプロジェクトや機能でも再利用可能な汎用性の高いコンポーネント、サービス、ユーティリティのリストです。

### 1. 認証・ユーザー管理

#### 1.1 認証システム
- **NextAuth.js (Auth.js v5) 統合** ([`src/auth.ts`](src/auth.ts))
  - セッション管理、JWT 方式
  - カスタムページ対応（ログイン、サインアップ、パスワードリセット等）
- **メールアドレス/パスワード認証** ([`src/lib/actions/auth.ts`](src/lib/actions/auth.ts))
  - 新規登録、ログイン、ログアウト
  - パスワードハッシュ化（bcrypt）
- **OAuth 認証（Google）** ([`src/auth.ts`](src/auth.ts))
  - Google アカウントでのサインイン
- **ゲスト認証** ([`src/lib/guest-auth.ts`](src/lib/guest-auth.ts))
  - パスワードによる一時的な編集権限の付与
  - JWT Cookie を使用したセッション管理
  - 期限付きトークンによるセキュリティ制御

#### 1.2 パスワード管理
- **パスワードリセット** ([`src/app/api/auth/password-reset/route.ts`](src/app/api/auth/password-reset/route.ts), [`src/app/api/auth/password-reset/confirm/route.ts`](src/app/api/auth/password-reset/confirm/route.ts))
  - メールによるリセットリンク発行
  - トークン検証と新しいパスワード設定
  - 期限付きトークン（24 時間）

#### 1.3 ユーザー情報管理
- **ユーザーサービス** ([`src/service/user-service.ts`](src/service/user-service.ts))
  - `getCurrentUser()`: 現在のログインユーザー情報を取得
  - `getUserById()`: 指定した ID のユーザー情報を取得
  - `updateUserProfile()`: プロフィール更新（表示名、自己紹介文）
  - `isAdminEmail()`: 管理者メール判定
- **ユーザーアクション** ([`src/service/user-actions.ts`](src/service/user-actions.ts))
  - ユーザー関連の操作をカプセル化

- **管理者ダッシュボード** ([`src/app/(main)/admini/page.tsx`](src/app/(main)/admini/page.tsx))
  - Looker Studio 連携による統計表示
  - Vercel OG プレビュー機能
  - 管理者専用アクセス制御（`ADMINISTRATOR_MAIL`）
- **動的ページタイトル設定** ([`src/app/(main)/layout.tsx`](src/app/(main)/layout.tsx))
  - 各ページで `Metadata` を使用した統一感のあるタイトル設定

### 2. コメント機能

- **コメントサービス** ([`src/service/comments-service.ts`](src/service/comments-service.ts))
  - `getPostComments()`: 投稿のコメント一覧取得
  - `createComment()`: コメント新規作成
  - `deleteComment()`: コメント削除（権限チェック付き）
  - `updateComment()`: コメント更新（権限チェック付き）
- **コメント API** ([`src/app/api/comments/[id]/route.ts`](src/app/api/comments/[id]/route.ts))
  - GET: コメント一覧取得
  - POST: コメント作成
  - DELETE: コメント削除
  - PUT: コメント更新
- **コメント UI コンポーネント**
  - [`CommentCard`](src/components/organisms/CommentCard.tsx): コメントカード表示
  - [`CommentList`](src/components/pages/qppost/CommentList.tsx): コメント一覧表示
  - [`CommentSection`](src/components/pages/qppost/CommentSection.tsx): コメント投稿セクション

### 3. 投稿管理

- **投稿サービス** ([`src/service/qppost-service.ts`](src/service/qppost-service.ts))
  - `getPosts()`: 投稿一覧取得（フィルタリング対応）
  - `getPostById()`: 投稿詳細取得
  - `createPost()`: 投稿新規作成
  - `updatePost()`: 投稿更新
  - `deletePost()`: 投稿削除
  - `getUnlistedPost()`: 限定公開トークン付き投稿取得
- **投稿 API** ([`src/app/api/posts/route.ts`](src/app/api/posts/route.ts), [`src/app/api/posts/[id]/route.ts`](src/app/api/posts/[id]/route.ts))
  - GET: 投稿一覧/詳細取得
  - POST: 投稿作成
  - PUT: 投稿更新
  - DELETE: 投稿削除
- **投稿アクション** ([`src/lib/actions/qppost.ts`](src/lib/actions/qppost.ts))
  - 限定公開 URL 生成・管理
  - トークン期限設定・延長
  - リンクの再生成・削除

### 4. クエリプラン可視化

- **プラン可視化コンポーネント**
  - [`PlanVisualizer`](src/components/pages/queryplanview/PlanVisualizer.tsx): SSMS 風のグラフィカル表示
  - [`PlanTable`](src/components/pages/queryplanview/PlanTable.tsx): テーブル形式での詳細表示
  - [`PlanXml`](src/components/pages/queryplanview/PlanXml.tsx): XML 形式の表示
- **プランデータ処理**
  - XML パース処理
  - ノード情報抽出
  - ツリー構造構築

### 5. UI コンポーネント

#### 5.1 shadcn/ui コンポーネント
- [`button`](src/components/ui/button.tsx): ボタン
- [`input`](src/components/ui/input.tsx): 入力フィールド
- [`textarea`](src/components/ui/textarea.tsx): テキストエリア
- [`card`](src/components/ui/card.tsx): カードコンテナ
- [`dialog`](src/components/ui/dialog.tsx): ダイアログ（モーダル）
- [`drawer`](src/components/ui/drawer.tsx): ドラウ（スライドアウト）
- [`tabs`](src/components/ui/tabs.tsx): タブ切り替え
- [`switch`](src/components/ui/switch.tsx): スイッチ
- [`badge`](src/components/ui/badge.tsx): バッジ
- [`separator`](src/components/ui/separator.tsx): 区切り線
- [`label`](src/components/ui/label.tsx): ラベル
- [`table`](src/components/ui/table.tsx): テーブル
- [`collapsible`](src/components/ui/collapsible.tsx): 折りたたみ可能コンテンツ

#### 5.2 カスタム UI コンポーネント
- [`markdown`](src/components/ui/markdown.tsx): Markdown レンダラー（react-markdown 使用）
- [`HelpModal`](src/components/organisms/HelpModal.tsx): ヘルプ表示モーダル
- [`UnlistedGuideDrawer`](src/components/organisms/UnlistedGuideDrawer.tsx): 限定公開ガイド表示ドラウ
- [`UserTooltip`](src/components/organisms/UserTooltip.tsx): ユーザー情報ツールチップ
- [`PostCard`](src/components/organisms/PostCard.tsx): 投稿カード
- [`MobileMenuButton`](src/components/layout/MobileMenuButton.tsx): モバイルメニューボタン

### 6. レイアウトコンポーネント

- [`Header`](src/components/layout/Header.tsx): ヘッダー（ロゴ、ナビゲーション、ユーザーメニュー）
- [`Sidebar`](src/components/layout/Sidebar.tsx): サイドバー（ナビゲーションリンク）
- [`SidebarProvider`](src/components/layout/SidebarProvider.tsx): サイドバー状態管理コンテキスト
- [`MobileMenuButton`](src/components/layout/MobileMenuButton.tsx): モバイル用メニューボタン

### 7. 共通ユーティリティ

#### 7.1 日付ユーティリティ ([`src/lib/utils/date.ts`](src/lib/utils/date.ts))
- `getRelativeTime()`: 相対時間表示（例：「2 時間前」）
- `displayDate()`: 日付フォーマット表示
- `getCurrentUTC()`: 現在の UTC ISO 文字列取得

#### 7.2 一般ユーティリティ ([`src/lib/utils.ts`](src/lib/utils.ts))
- `cn()`: クラス名結合（clsx + tailwind-merge）
- ID 生成ユーティリティ
- 形式検証ユーティリティ

#### 7.3 データベース ([`src/lib/db.ts`](src/lib/db.ts))
- `query()`: SQL クエリ実行（Turso/libSQL）
- トランザクションサポート
- プリペアドステートメント

#### 7.4 メール送信 ([`src/lib/mail.ts`](src/lib/mail.ts))
- Resend API を使用したメール送信
- テンプレートベースのメール作成
- パスワードリセットメール、登録確認メール等

### 8. 定数・設定

- [`unlisted-guide.ts`](src/constants/unlisted-guide.ts): 限定公開ガイドコンテンツ
- [`menu_dashboard.tsx`](src/constants/menu_dashboard.tsx): ダッシュボードメニュー定義
- [`post-defaults.ts`](src/constants/post-defaults.ts): 投稿デフォルト値
- [`qps_sample.ts`](src/constants/qps_sample.ts): クエリプランサンプルデータ

### 9. API ルートパターン

- **認証 API**
  - `/api/auth/[...nextauth]`: NextAuth.js エンドポイント
  - `/api/auth/signup`: 新規登録
  - `/api/auth/password-reset`: パスワードリセット
  - `/api/auth/password-reset/confirm`: パスワードリセット確認
  - `/api/guest-auth/verify`: ゲスト認証検証
- **投稿 API**
  - `/api/posts`: 投稿一覧/作成
  - `/api/posts/[id]`: 投稿詳細/更新/削除
  - `/api/posts/[id]/comments`: 投稿のコメント一覧/作成
- **コメント API**
  - `/api/comments`: コメント一覧/作成
  - `/api/comments/[id]`: コメント詳細/更新/削除
- **ヘルプ API**
  - `/api/help/[slug]`: ヘルプ記事取得

### 10. ページコンポーネントパターン

- **認証ページ**
  - `/auth/login`: ログイン
  - `/auth/signup`: サインアップ
  - `/auth/password-reset`: パスワードリセット
  - `/auth/verify`: メール確認
- **メインページ**
  - `/`: ホーム
  - `/dashboard`: ダッシュボード
  - `/qpposts`: 投稿一覧
  - `/qpposts/[id]`: 投稿詳細
  - `/qpposts/new`: 新規投稿
  - `/qpposts/unlisted/[token]`: 限定公開投稿
  - `/comments`: コメント一覧
  - `/help/[slug]`: ヘルプ記事
  - `/setting`: 設定

### 11. 状態管理・プロバイダー

- [`AuthProvider`](src/components/providers/AuthProvider.tsx): 認証状態管理
- [`SidebarProvider`](src/components/layout/SidebarProvider.tsx): サイドバー状態管理

### 12. 権限・アクセス制御パターン

- 投稿者本人のみ編集可能
- 管理者は全投稿・コメント編集可能
- ゲストは一時的な編集権限のみ
- 限定公開トークンによるアクセス制御
- `IsActive` フラグによるコメント制限
- `IsPublic` フラグによる公開範囲制御

---

これらの機能は、他のプロジェクトや機能でも再利用可能な汎用性の高いコンポーネントやサービスです。各モジュールは単一責任の原則に従い、独立してテスト・再利用できるよう設計されています。
