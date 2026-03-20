## 要件
- 特定プランについては、URLを直接ひらくことでのみ参照できるようにしたい
- URL自体は時限的に公開する（デフォルトは３０日、検証は１時間を想定）
- 編集画面で、このURLはクリップボードにコピーできる

## API
- unlisted用のURLを取得する機能


## 画面
- src\app\(main)\qpposts\[id]\edit\page.tsx：プラン編集ページ
- src\app\(main)\qpposts\[id]\page.tsx：プラン参照ページ
- src\app\(main)\qpposts\unlisted\[unlitedtoken]\page.tsx：開示用のプラン参照ページ
- src\app\(main)\qpposts\page.tsx：プラン一覧ページ
- src\app\(main)\qpposts\new\page.tsx：プラン新規ページ

- プラン編集ページ
開示用URL取得のボタンを追加
取得後は画面に表示されて、クリップボードへのコピー機能をもつ
開示用のURLは期限をもち、編集ページでその期間について調整はできる（１日追加、１０日追加、１００日追加など）
開示用のURLについては採番し直しも可能。また期限の切れたものはその旨明示すること、そこから期限の落とし直しも可能にする。
このページいついては表示条件として「is_public：２」か「is_public：１で限定公開用のプラン参照ページから呼ばれた時」か
「is_public：ログイン者が製作者かAdmin」という条件を付与する。

- 開示用のプラン参照ページ
期限は問題ないか、qps_unlisted_links.id とunlitedtokenは同じかどうか
実体は持たずに、URLが妥当かどうかのみを確認
期限が同じなら、プラン参照ページへと遷移
該当するものがない、期限が切れている場合は４０４で表示


## アクセス制御（is_public）の整理
表示条件のロジック:
- 一覧 (/qpposts): is_public = 2 (Public) のみ表示。
- 直接参照 (/qpposts/[id]):
  - is_public = 2 または 1 (Unlisted) なら誰でも表示。
  - is_public = 0 なら「所有者 or Admin」のみ。
- 限定URL (/unlisted/[token]):
  - qps_unlisted_links に存在し、期限内であれば、/qpposts/[id] へリダイレクト。

## 追加すると良い技術指示（ヒント）
ID生成: 「nanoid ライブラリを使用して 10〜12 文字程度の短い ID を生成してください」と指定する。
期限操作: 「期限更新ボタン（+1日など）は、Server Actions を使用して qps_unlisted_links の expires_at を更新するようにしてください」と指定する。
クリップボード: 「navigator.clipboard.writeText を使用し、コピー成功時に shadcn/ui の use-toast で通知を出してください」と指定する。

## 追加の補足指示:
unlisted/[token] からの遷移先は、編集ページではなくプラン詳細（参照）ページ /qpposts/[id] としてください。
期限切れの判定は、サーバーサイドで行い、期限切れ時は next/navigation の notFound() または専用の期限切れメッセージ画面を表示してください。
編集画面での「URL再採番」機能は、既存の qps_unlisted_links レコードを削除し、新しい id で生成し直す挙動にしてください。

## DDL
既存分

```sql
-- Query Plan Posts table
CREATE TABLE IF NOT EXISTS qps_posts (
    id TEXT PRIMARY KEY, -- UUID
    query_plan_xml TEXT NOT NULL,
    title TEXT NOT NULL,
    comment_markdown TEXT,
    owner_id TEXT, -- UUID, NULL for guest
    edit_token TEXT, -- Token for guest editing
    is_active INTEGER DEFAULT 1, -- 1: Active, 0: Archived
    is_public INTEGER DEFAULT 2, -- 2: Public(一覧あり), 1: Unlisted:限定公開(一覧なし/URLのみ), 0: Private(本人/Adminのみ)
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL,
    FOREIGN KEY (owner_id) REFERENCES users(id)
);

-- 追加
-- 時限トークン管理用テーブル
CREATE TABLE IF NOT EXISTS qps_unlisted_links (
    id TEXT PRIMARY KEY, -- 短いトークン (例: YrsLqc, xxxxx) NanoIDで生成する。
    post_id TEXT NOT NULL, -- qps_posts.id への参照
    expires_at TEXT NOT NULL, -- ISO 8601形式 (例: 2026-04-21T...)
    created_at TEXT NOT NULL,
    FOREIGN KEY (post_id) REFERENCES qps_posts(id) ON DELETE CASCADE
);

-- 検索を高速化するためのインデックス
CREATE INDEX IF NOT EXISTS idx_unlisted_links_post_id ON qps_unlisted_links(post_id);
```
