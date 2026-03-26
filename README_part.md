## 汎用機能リスト

### 1. 認証・ユーザー管理
- **ログイン/ログアウト** ([`src/app/auth/login/page.tsx`](src/app/auth/login/page.tsx))
  - メールアドレスとパスワードによる認証
  - NextAuth.js を使用
- **サインアップ** ([`src/app/auth/signup/page.tsx`](src/app/auth/signup/page.tsx))
  - 新規ユーザー登録
  - メールアドレス、パスワード、表示名の設定
- **パスワードリセット** ([`src/app/auth/password-reset/page.tsx`](src/app/auth/password-reset/page.tsx))
  - メールによるパスワードリセットリンクの送信
  - 新しいパスワードの設定
- **ゲスト認証** ([`src/lib/guest-auth.ts`](src/lib/guest-auth.ts))
  - パスワードによる一時的な編集権限の付与
  - JWT Cookie を使用したセッション管理

### 2. ユーザー情報管理
- **プロフィール編集** ([`src/app/(main)/setting/page.tsx`](src/app/(main)/setting/page.tsx))
  - 表示名の変更
  - 自己紹介文の編集
- **管理者判定** ([`src/service/user-service.ts`](src/service/user-service.ts))
  - 管理者メールによる権限チェック

### 3. ヘルプ・ドキュメント
- **ヘルプページ** ([`src/app/(main)/help/[slug]/page.tsx`](src/app/(main)/help/[slug]/page.tsx))
  - マークダウン形式のヘルプ記事表示
  - カテゴリ別のヘルプコンテンツ
- **ヘルプモーダル/ドラウ** ([`src/components/organisms/HelpModal.tsx`](src/components/organisms/HelpModal.tsx), [`src/components/organisms/UnlistedGuideDrawer.tsx`](src/components/organisms/UnlistedGuideDrawer.tsx))
  - 画面内でのヘルプ表示
  - 限定公開ガイドの表示

### 4. コメント機能
- **コメント一覧表示** ([`src/components/pages/qppost/CommentList.tsx`](src/components/pages/qppost/CommentList.tsx))
- **コメント投稿** ([`src/components/pages/qppost/CommentSection.tsx`](src/components/pages/qppost/CommentSection.tsx))
- **コメント削除** ([`src/app/api/comments/[id]/route.ts`](src/app/api/comments/[id]/route.ts))
- **コメントサービス** ([`src/service/comments-service.ts`](src/service/comments-service.ts))

### 5. 投稿管理
- **投稿一覧表示** ([`src/components/pages/qppost/QpPostList.tsx`](src/components/pages/qppost/QpPostList.tsx))
- **投稿詳細表示** ([`src/components/pages/qppost/QpPost.tsx`](src/components/pages/qppost/QpPost.tsx))
- **新規投稿** ([`src/components/pages/qppost/NewPost.tsx`](src/components/pages/qppost/NewPost.tsx))
- **投稿編集** ([`src/components/pages/qppost/EditPost.tsx`](src/components/pages/qppost/EditPost.tsx))
- **投稿削除** ([`src/app/api/posts/[id]/route.ts`](src/app/api/posts/[id]/route.ts))
- **限定公開リンク管理** ([`src/lib/actions/qppost.ts`](src/lib/actions/qppost.ts))
  - 限定公開 URL の生成
  - 期限設定・延長
  - リンクの再生成・削除

### 6. クエリプラン可視化
- **ビジュアル表示** ([`src/components/pages/queryplanview/PlanVisualizer.tsx`](src/components/pages/queryplanview/PlanVisualizer.tsx))
- **テーブル形式表示** ([`src/components/pages/queryplanview/PlanTable.tsx`](src/components/pages/queryplanview/PlanTable.tsx))
- **XML 表示** ([`src/components/pages/queryplanview/PlanXml.tsx`](src/components/pages/queryplanview/PlanXml.tsx))

### 7. UI コンポーネント
- **マークダウンレンダラー** ([`src/components/ui/markdown.tsx`](src/components/ui/markdown.tsx))
- **ダイアログ** ([`src/components/ui/dialog.tsx`](src/components/ui/dialog.tsx))
- **ドラウ** ([`src/components/ui/drawer.tsx`](src/components/ui/drawer.tsx))
- **タブ** ([`src/components/ui/tabs.tsx`](src/components/ui/tabs.tsx))
- **スイッチ** ([`src/components/ui/switch.tsx`](src/components/ui/switch.tsx))
- **バッジ** ([`src/components/ui/badge.tsx`](src/components/ui/badge.tsx))
- **カード** ([`src/components/ui/card.tsx`](src/components/ui/card.tsx))

### 8. レイアウト
- **ヘッダー** ([`src/components/layout/Header.tsx`](src/components/layout/Header.tsx))
- **サイドバー** ([`src/components/layout/Sidebar.tsx`](src/components/layout/Sidebar.tsx))
- **モバイルメニュー** ([`src/components/layout/MobileMenuButton.tsx`](src/components/layout/MobileMenuButton.tsx))

### 9. 共通機能
- **トースト通知** ([`src/components/providers/AuthProvider.tsx`](src/components/providers/AuthProvider.tsx) で sonner を使用)
- **日付表示ユーティリティ** ([`src/lib/utils/date.ts`](src/lib/utils/date.ts))
- **ID 生成ユーティリティ** ([`src/lib/utils.ts`](src/lib/utils.ts))
- **データベースクエリ** ([`src/lib/db.ts`](src/lib/db.ts))

これらの機能は、他のプロジェクトや機能でも再利用可能な汎用性の高いコンポーネントやサービスです。