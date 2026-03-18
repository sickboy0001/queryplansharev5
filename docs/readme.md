# qps5
## 要件
### 概要
- プランはXMLの記載と、コメント。将来的には必要な情報案提示して、、登録aiに問い合わせるまでがゴール
### 基本
- QueryPlanのXmlを張り付けて登録できる。
  - デフォルトではタイトルはQueryPlan1などでOK（１は連番）
  - タイトル、クエリプランのXmlはあとで調整できることとする。
  - 投稿自体に投稿者がコメントを付与できる
  - 投稿者以外もコメントを付与できるものとする。
  - ログイン者以外もコメントの追加、閲覧可能は可能投稿者：閲覧可能

▼ 役割を分離させる
IsActive → 削除/アーカイブ/非表示 フラグ
IsPublic → 公開/非公開のアクセス制御フラグ
▼ 推奨仕様
✔ IsPublic
True → 全員閲覧可能
False → 投稿者＋ログイン者のみ
✔ IsActive
True → 通常表示
False →投稿者にだけ見える「アーカイブ」。一覧には出さない。コメントも禁止
GitHub Issues や Qiita 下書き管理と同じ方式になるため、ユーザーにとって理解しやすいです。


- コメント、タイトル、追加のコメントも必要かと
- コメントの削除機能については本人または、プラン作成者で可能とする。
- 
### ログイン者設定画面
- 表示名、コメント（PlanText)、フルコメント（Markdown）を登録できる。

### プラン一覧
- ログイン者投稿プラン一覧、プランの一覧がある。
- プランの一覧
  - ログイン者に寄らずに、IsActive：Trueの物を表示
  - 表示順は更新日順
- ログイン者の登録プランの一覧
  - ログイン者ごとのURLをもつ
  - ログイン者が登録したクエリプランの一覧を表示
  - 
### 間近で登録されたコメントの一覧
- ログイン者に寄らずに、IsActive：Trueの物を表示
- 表示順は更新日順


### コメント一覧
- まじかで入力されたコメントから並ぶようになる

### テーブル定義
- ユーザー 物理名：users
  - ログイン処理で利用する
  - メールアドレス、display_name：ユーザー名、self_intro_markdown：コメント（MarkDown）などを持つ
  - PKのIDはUUIDとする。
  - 登録日、更新日をもつ（UTC形式でもつこと）
 - QueryPlanXmls 物理名：qps_posts
  - クエリプラン本体を持つ
  - IDはUUIDとする
  - クエリプラン本体をXmlとしてもつ
  - コメント（Markdown）をもつ
  - 登録者（UUID）をもつ、ただし、ゲストで持つ登録可能とするため、NONEも許容する
  - キー（edit_token ）をもつ、登録者がNoneの時に書き直しを行うために必要
  - 有効、無効区分をもつ。IsEnabledとして、True（Def）、Falseの場合は一覧に表示しない
  - 登録日、更新日をもつ（UTC形式でもつこと）
- Comments 物理名：qps_comments
  - QueryPlanXmlのUUIDをもつ
  - PKはUUIDとする
  - コメント（MarkDown）をもつ
  - 登録者（UUID）をもつ、ただし、ゲストで持つ登録可能とするため、NONEも許容する
  - 登録日、更新日をもつ（UTC形式でもつこと）
 
## 非機能要件
- ログイン周り
  - Google連携
  - メアドでのサインイン、ログイン、忘れた場合
- 登録者の自己紹介は必要かな
- 問い合わせ先のメアド、Twitterは自分で記載する形、自己紹介は、マークアップ対応
- 各テーブルは作成日時以外に更新日時を持つ。

# システム構成

- 開発言語：React+NextJS
- デプロイ先：Vercel
- DB：SQLite(Turso)
- ソース管理：Github
- 認証：メール認証(Users,Turso)＋GoogleAuth
- メール：Rsend

## Directory構成

```
src/
├── app/
│   ├── api/                   # 外部連携・公開用API
│   │   └── posts/route.ts     # GET: 一覧取得, POST: 外部からの投稿など
│   ├── (auth)/                # 認証グループ
│   └── (user)/                # ログイン後グループ
│   │   └── setting/　　　　　　# ユーザー設定画面
│   │       └── page.tsx       # サーバーコンポーネント 
│   └── qpposts/               # qpposts一覧画面
│       └── page.tsx       　  # サーバーコンポーネント
├── components/
│   ├── ui/                    # shadcn/ui 等の低レイヤーコンポーネント
│   ├── atomic/                # Atoms, Molecules
│   ├── organisms/             # 複数の部品を組み合わせた塊
│   └── pages/                 # 各画面のメイン実装（page.tsxから呼ばれる）
│        ├── qppost/
│        │    ├── QpPost.tsx      # クライアント部分の実態（ページレイアウト）
│        │    ├── PostList.tsx    # クエリプラン一覧表示
│        │    ├── NewPost.tsx     # クエリプラン新規投稿画面
│        │    ├── EditPost.tsx    # クエリプラン編集画面
│        │    ├── PostSidebar.tsx # サイドバー（プラン情報など）
│        │    ├── CommentSection.tsx # コメントセクション（投稿フォーム＋一覧）
│        │    └── CommentList.tsx  # コメント一覧表示・編集・削除
│        ├── dashboard/
│        │    └── Dashboard.tsx   # ダッシュボード画面
│        └── comments/
│             └── Comments.tsx    # 全コメント一覧画面
├── service/                   # ビジネスロジック
│   ├── qppost-service.ts      # getPosts, createPost などの関数
│   └── user-service.ts        # 
├── lib/
│   ├── db.ts                  # Tursoクライアント初期化
│   └── utils/                 # utilDate.ts などをまとめるディレクトリ
│       └── date.ts            # DB上の日時と表示上の日時の差分の調整など
├── constants/
│   ├── menu.ts                # メニュー用の定数
│   └── qps_sample.ts          # queryplanxmlのサンプル、コメントのサンプルなども含む
└── middleware.ts

```


## DBへのアクセス手順
ORMは未使用を想定しています。

> sample source

```typescript
import { query } from "@/lib/db";
import { auth } from "@/auth";

export async function getUserProfile() {
  const session = await auth();
  if (!session?.user?.id) return null;

  const res = await query(
    "SELECT id, email, display_name, self_intro_text, self_intro_markdown, is_admin, updated_at FROM users WHERE id = ?",
    [session.user.id],
  );

  return res.rows[0] || null;
}
```
## GoogleAuth手順

## Resendの手順


## 1. 準備：ライブラリのインストール

まず、XML のパースと可視化に必要なライブラリをインストールします。

```bash
npm install html-query-plan fast-xml-parser

```

* **`html-query-plan`**: 実行プランを SSMS 風に描画するコアライブラリ。
* **`fast-xml-parser`**: XML 文字列を JavaScript オブジェクトに変換するために使用します。

---

## 2. サンプルコード (Next.js App Router)

### コンポーネントの作成 (`components/PlanVisualizer.tsx`)

このライブラリは DOM を直接操作するため、`useEffect` 内で初期化を行います。

```tsx
'use client';

import React, { useEffect, useRef } from 'react';
// @ts-ignore (型定義がない場合があるため)
import * as qp from 'html-query-plan';
import 'html-query-plan/css/qp.css'; // スタイルをインポート

interface Props {
  xmlData: string;
}

export default function PlanVisualizer({ xmlData }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current && xmlData) {
      // コンテナを一度クリア
      containerRef.current.innerHTML = '';
      try {
        // ライブラリを使用してXMLを可視化
        qp.showPlan(containerRef.current, xmlData);
      } catch (err) {
        console.error("Plan visualization failed:", err);
      }
    }
  }, [xmlData]);

  return (
    <div className="border rounded-lg p-4 bg-white overflow-auto min-h-[500px]">
      <div ref={containerRef} className="qp-root" />
    </div>
  );
}

```

### メインページ (`app/page.tsx`)

XML ファイルをアップロードして表示するシンプルな UI です。

```tsx
'use client';

import { useState } from 'react';
import PlanVisualizer from '@/components/PlanVisualizer';

export default function Home() {
  const [xml, setXml] = useState<string>('');

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      setXml(event.target?.result as string);
    };
    reader.readAsText(file);
  };

  return (
    <main className="p-8 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">SQL Server Query Plan Viewer</h1>
      
      <div className="mb-8 p-6 border-2 border-dashed border-gray-300 rounded-lg text-center">
        <input 
          type="file" 
          accept=".sqlplan,.xml" 
          onChange={handleFileUpload}
          className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
        />
        <p className="mt-2 text-gray-500">.sqlplan ファイルを選択してください</p>
      </div>

      {xml ? (
        <PlanVisualizer xmlData={xml} />
      ) : (
        <div className="text-center text-gray-400 py-20 bg-gray-50 rounded">
          プランを読み込むとここに表示されます
        </div>
      )}
    </main>
  );
}

```

---

## 3. 実装のポイントと注意点

### 構造の理解

SQL Server の実行プラン XML は、`ShowPlanXML` 要素をルートとし、その中に `BatchSequence` > `Batch` > `Statements` > `StmtSimple` > `QueryPlan` > `RelOp` というツリー構造を持っています。

* **RelOp (Relative Operation)**: 各ノード（Index Scan, Hash Join など）を表します。
* **Cost**: `EstimatedTotalSubtreeCost` などの属性から、どの処理が重いかを特定できます。

### 独自のカスタマイズをしたい場合

もし `html-query-plan` を使わず、**自前で D3.js や ReactFlow を使って描画したい場合**は、以下の手順が必要です：

1. `fast-xml-parser` で XML を JSON に変換。
2. `RelOp` 要素を再帰的にトラバースして、ノードとエッジのリストを作成。
3. 各 `RelOp` の属性（`PhysicalOp`, `LogicalOp`, `EstimatedExecutionMode` など）を元にアイコンや色を決定。

### 推奨される追加機能

* **コストのハイライト**: ノードの `EstimatedTotalSubtreeCost` が高いものを赤く表示する。
* **ツールチップ**: ノードにホバーした際に、推定行数 (EstimateRows) や CPU コストを表示する。

---

了解です。qps5 の仕様に合わせて、**認可（Authorization）ロジックのフローチャート**を用途別に用意しました。\
あなたが想定している **IsPublic / IsActive / 投稿者 / ログイン者 / ゲスト** の判定に加え、運用で便利な **Admin** ロールも入れてあります（不要なら削除可能）。

以下は **Mermaid** 形式です。OneNote / Markdown / draw\.io いずれでも扱いやすいように、用途ごとに分けています。

***

## 0. 前提（用語・判定式）

*   **Actors**
    *   `guest`：未ログイン
    *   `user`：ログイン済（投稿者ではない）
    *   `owner`：対象リソースの投稿者
    *   `admin`：管理者

*   **リソース属性**
    *   `isPublic`：公開/非公開
    *   `isActive`：アクティブ/アーカイブ（非表示）
    *   `ownerId`：投稿者のユーザーID

*   **リクエストコンテキスト**
    *   `session.user.id`：ログインユーザーID（なければ guest）
    *   `session.user.isAdmin`：管理者フラグ（任意）

*   **判定式（擬似コード）**
    ```ts
    const isGuest = !session?.user?.id;
    const isOwner = !!session?.user?.id && session.user.id === ownerId;
    const isAdmin = !!session?.user?.isAdmin;

    // 推奨仕様（役割分離）：
    // isPublic: True=全員閲覧可 / False=投稿者+ログイン者のみ
    // isActive: True=通常 / False=アーカイブ（一覧不可・閲覧/操作は owner/admin のみ）
    ```

***

## 1. プラン閲覧（詳細ページ / GET /qpposts/\[id]）

```Mermaid
flowchart TD
  A[リクエスト: プラン閲覧 /qpposts/:id] --> B{存在するか?}
  B -- No --> B1[404 Not Found] --> END1[終了]
  B -- Yes --> C{isActive?}
  C -- False --> D{owner or admin?}
  D -- No --> D1[403 Forbidden<br/>（アーカイブのため閲覧不可）] --> END2[終了]
  D -- Yes --> G[200 OK / 表示] --> END3[終了]
  C -- True --> E{isPublic?}
  E -- True --> G
  E -- False --> F{ログイン済み?}
  F -- No --> F1[401 Unauthorized<br/>（ログイン要求）] --> END4[終了]
  F -- Yes --> G

```

***

## 2. プラン一覧（公開一覧 / GET /qpposts）


```Mermaid
flowchart TD
  A[リクエスト: プラン一覧 /qpposts] --> B{isActive=True のみ?}
  B -- Yes --> C[絞り込み: isActive=True]
  C --> D{isPublic=True?}
  D -- Yes --> E[結果に含める]
  D -- No --> F{ログイン済み?}
  F -- No --> G[除外]
  F -- Yes --> H[結果に含める]
  E --> I[更新日降順で返却]
  G --> I
  H --> I
```

*   ポイント：**ログイン済みなら isPublic=False の公開一覧にも出す**（仕様通り）。

***

## 3. ユーザー別プラン一覧（マイページ / GET /users/:id/qpposts）


```Mermaid
flowchart TD
  A[リクエスト: /users/:id/qpposts] --> B{対象ユーザー存在?}
  B -- No --> B1[404] --> END
  B -- Yes --> C[プラン取得: ownerId=対象ユーザー]
  C --> D{isActive?}
  D -- False --> E{viewer は owner or admin?}
  E -- Yes --> F[含める]
  E -- No --> G[除外]
  D -- True --> H{isPublic?}
  H -- True --> F
  H -- False --> I{viewer はログイン済み?}
  I -- Yes --> F
  I -- No --> G
  F --> Z[更新日降順で返却]
  G --> Z
```

***

## 4. コメント一覧（直近 / GET /comments/recent）

```Mermaid
flowchart TD
  A[リクエスト: /comments/recent] --> B[最新コメント取得]
  B --> C{対象プラン isActive=True?}
  C -- No --> D[除外]
  C -- Yes --> E{対象プラン isPublic=True?}
  E -- Yes --> F[含める]
  E -- No --> G{viewer ログイン済み?}
  G -- Yes --> F
  G -- No --> D
  F --> Z[更新日降順で返却]
  D --> Z
```

***

## 5. コメント投稿（POST /qpposts/:id/comments）


```Mermaid
flowchart TD
  A[POST コメント] --> B{プラン存在?}
  B -- No --> B1[404] --> END
  B -- Yes --> C{プラン isActive?}
  C -- False --> C1[403（アーカイブには投稿不可）] --> END
  C -- True --> D{プラン isPublic?}
  D -- True --> E[投稿可（ゲストも許容）]
  D -- False --> F{ログイン済み?}
  F -- No --> F1[401（ログイン必要）] --> END
  F -- Yes --> E
  E --> G[RateLimit/CAPTCHA チェック]
  G --> H{OK?}
  H -- No --> H1[429/403] --> END
  H -- Yes --> I[保存（created_by: userId or NULL）]
  I --> J[201 Created / 返却]
```

***

## 6. コメント削除（DELETE /comments/:commentId）

> 仕様：「プラン投稿者以外のコメントについては削除機能をもつ（変更は不可）」\
> ＝ **プラン投稿者（owner）または管理者（admin）が、他者のコメントを削除可能**。自分のコメントは自分で削除しても良いなら追記可。


```Mermaid
flowchart TD
  A[DELETE コメント] --> B{ログイン済み?}
  B -- No --> B1[401] --> END
  B -- Yes --> C{コメント存在?}
  C -- No --> C1[404] --> END
  C -- Yes --> D[コメントの属するプラン取得]
  D --> E{isActive?}
  E -- False --> F{owner or admin?}
  F -- No --> F1[403（アーカイブ）] --> END
  F -- Yes --> G[判定へ]
  E -- True --> G{誰が削除できる?}
  G --> H{admin?}
  H -- Yes --> Z[削除OK]
  H -- No --> I{プランowner?}
  I -- Yes --> Z
  I -- No --> J{コメント作成者本人?（任意）}
  J -- Yes --> Z
  J -- No --> K[403 Forbidden]
  Z --> L[削除して 204 No Content]
```

> ※「コメント作成者本人の削除は不可」とするなら **J 分岐を削除**してください（指定仕様に忠実なら J 分岐は要らない）。

***

## 7. プラン作成（POST /qpposts）


```Mermaid
flowchart TD
  A[POST プラン作成] --> B{ログイン済み?}
  B -- Yes --> C[ownerId = userId]
  B -- No --> D[ownerId = NULL, edit_token 発行]
  C --> E[入力検証（サイズ/拡張子/XML妥当性）]
  D --> E
  E --> F{RateLimit/CAPTCHA OK?}
  F -- No --> F1[429/403] --> END
  F -- Yes --> G[保存（isActive=True が既定）]
  G --> H[201 Created + ID（ゲストは edit_token を返却）]
```

***

## 8. プラン編集（PUT /qpposts/:id）

*   ログイン者：**owner または admin のみ編集可**
*   ゲスト投稿（ownerId=NULL）：**edit\_token を提示した場合のみ編集可**


```Mermaid
flowchart TD
  A[PUT プラン編集] --> B{プラン存在?}
  B -- No --> B1[404] --> END
  B -- Yes --> C{isActive?}
  C -- False --> D{owner or admin?}
  D -- No --> D1[403（アーカイブ）] --> END
  D -- Yes --> E[編集可判定へ]
  C -- True --> E{編集者は?}
  E --> F{admin?}
  F -- Yes --> Z[編集可]
  F -- No --> G{owner?}
  G -- Yes --> Z
  G -- No --> H{ownerId=NULL のゲスト投稿?}
  H -- No --> I[403]
  H -- Yes --> J{edit_token 一致?}
  J -- Yes --> Z
  J -- No --> I
  Z --> K[更新して 200 OK]
```
***

## 9. 公開状態変更（PATCH isPublic / isActive）

*   **isPublic の変更**：owner / admin のみ
*   **isActive の変更（アーカイブ化）**：owner / admin のみ
*   ゲスト投稿は `ownerId=NULL` なので **edit\_token** での編集権限を認めるかは要件次第（通常は「公開状態変更不可」にする方が安全）

```Mermaid
flowchart TD
  A[PATCH 公開状態変更] --> B{プラン存在?}
  B -- No --> B1[404] --> END
  B -- Yes --> C{admin or owner?}
  C -- Yes --> D[変更適用 200 OK]
  C -- No --> E{ownerId=NULL かつ edit_token 一致?}
  E -- Yes --> F[※許すなら 200 OK / 許さないなら 403]
  E -- No --> G[403 Forbidden]
```

***

## 10. 認可ヘルパ（サーバーサイド擬似コード）

実装時にバラつかないよう、**共通のガード関数**化を強く推奨します。

```ts
type Viewer = { id?: string; isAdmin?: boolean } | null;

export function canViewPlan(viewer: Viewer, plan: { isPublic: boolean; isActive: boolean; ownerId?: string | null }) {
  const isGuest = !viewer?.id;
  const isOwner = viewer?.id && plan.ownerId && viewer.id === plan.ownerId;
  const isAdmin = !!viewer?.isAdmin;

  if (!plan.isActive) return isOwner || isAdmin; // アーカイブ：owner/adminのみ
  if (plan.isPublic) return true;                // 公開：誰でも
  return !isGuest;                               // 非公開：ログイン者以上
}

export function canListInPublicFeed(viewer: Viewer, plan: { isPublic: boolean; isActive: boolean }) {
  if (!plan.isActive) return false;
  if (plan.isPublic) return true;
  return !!viewer?.id; // 非公開はログイン者にのみ表示
}

export function canComment(viewer: Viewer, plan: { isPublic: boolean; isActive: boolean }) {
  if (!plan.isActive) return false;
  if (plan.isPublic) return true; // ゲスト可（スパム対策は別途）
  return !!viewer?.id;            // 非公開はログイン必須
}

export function canDeleteComment(viewer: Viewer, ctx: { planOwnerId?: string | null; commentOwnerId?: string | null }) {
  const isAdmin = !!viewer?.isAdmin;
  const isPlanOwner = viewer?.id && ctx.planOwnerId && viewer.id === ctx.planOwnerId;
  const isCommentOwner = viewer?.id && ctx.commentOwnerId && viewer.id === ctx.commentOwnerId;
  // 仕様通りなら「プラン投稿者と管理者のみ」：isCommentOwner は無視
  return isAdmin || isPlanOwner;
}

export function canEditPlan(viewer: Viewer, plan: { ownerId?: string | null }, token?: string) {
  const isAdmin = !!viewer?.isAdmin;
  const isOwner = viewer?.id && plan.ownerId && viewer.id === plan.ownerId;
  const isGuestOwned = !plan.ownerId;
  if (isAdmin || isOwner) return true;
  if (isGuestOwned) return token && verifyEditToken(token, plan); // ハッシュ一致
  return false;
}
```


***

## 0. 前提（共通仕様）

*   **アクター**
    *   `guest`（未ログイン）
    *   `user`（ログイン済み）
    *   `admin`（任意）

*   **用語**
    *   **サインアップ**：新規登録（メール/Google）
    *   **ログイン**：既存ユーザー認証（メール+PW / Google）
    *   **メール確認**：Email Verify（任意だが推奨）
    *   **パスワードリセット**：忘れた場合のフロー（メール送信→トークンで再設定）

*   **データ**
    *   `users`: id(UUID), email(Unique), display\_name, password\_hash(Nullable), email\_verified\_at(Nullable), is\_admin, created\_at, updated\_at
    *   `password_reset_tokens`: id(UUID), user\_id, token\_hash, expires\_at, used\_at(Nullable), created\_at
    *   `email_verify_tokens`: id(UUID), user\_id, token\_hash, expires\_at, used\_at(Nullable), created\_at
    *   いずれも **ハッシュ保存**（生のトークンは送信のみ・DBに保存しない）

*   **セキュリティ共通**
    *   **レート制限**（IP/Email）：/auth/login, /auth/signup, /auth/password-reset-request, /auth/password-reset-confirm
    *   **CAPTCHA**（Cloudflare Turnstile 推奨）を **匿名操作**に適用（サインアップ・パスワードリクエスト）
    *   **トークン**
        *   長さ：少なくとも 32 バイト以上のランダム（base64url 表現で 43–64文字程度）
        *   **DBは SHA-256 でハッシュ化して保存**
        *   **短期有効**（例：メール確認 24h、パスワードリセット 30–60分）
        *   1回使い切り（used\_at を記録・以後無効）

***

## 1. メール＋パスワード サインアップ（新規登録）


```Mermaid

flowchart TD
    A[ユーザー: メール/パスワード入力<br/>POST /auth/signup] --> B[入力検証<br/>email形式, PWポリシー, CAPTCHA, RateLimit]
    B --> C{email 未使用?}
    
    C -- No --> C1[409 Conflict: 既に登録済]
    C1 --> END([終了])
    
    C -- Yes --> D["ユーザー仮作成:<br/>users.insert(email, password_hash, email_verified_at=NULL)"]
    D --> E["メール確認用トークン生成 & 保存<br/>(hash, expires_at)"]
    E --> F["Resendで確認メール送信<br/>リンク: /auth/verify?token=..."]
    F --> G[201 Created: 確認メールを送信]
    G --> END
```


### メール確認（Email Verify）


```Mermaid


flowchart TD
    A[GET /auth/verify?token=...] --> B{トークン検証}
    
    B -- "不一致 / 期限切れ / 使用済" --> C[400/410: 無効なトークン]
    
    B -- 有効 --> D["users.email_verified_at = NOW()"]
    D --> E["email_verify_tokens.used_at = NOW()"]
    E --> F[ログイン状態に遷移]
    F --> G["/dashboard へリダイレクト"]
    
    C --> END([終了])
    G --> END

```


> *備考*: メール確認前でもログイン許可するかは運用方針次第。**セキュリティ重視ならメール確認必須**に。

***

## 2. メール＋パスワード ログイン

```Mermaid
flowchart TD
  A[ユーザー: メール/パスワード入力<br/>POST /auth/login] --> B[入力検証 & CAPTCHA（連続失敗時）& RateLimit]
  B --> C[users 取得 by email]
  C -- なし --> C1[401: 認証失敗] --> END
  C -- あり --> D{password_hash 検証OK?}
  D -- No --> D1[401 + 失敗カウント↑ + 必要ならCAPTCHA必須化] --> END
  D -- Yes --> E{メール確認必須?}
  E -- Yes --> F{email_verified_at あり?}
  F -- No --> F1[403: メール未確認 / 確認メール再送リンク] --> END
  F -- Yes --> G[セッション発行（JWT/Cookie）]
  E -- No --> G
  G --> H[200 OK: ログイン成功 / リダイレクト]
```


*   **パスワードポリシー**：最低長、英大小/数字/記号、過去パスワード再利用禁止（任意）
*   **CAPTCHA エスカレーション**：数回失敗後に出す

***

## 3. Google でログイン／サインアップ（OAuth2）


```Mermaid
flowchart TD
  A[ユーザー: 'Googleで続ける'] --> B[OAuth開始 /auth/google/start]
  B --> C[Google OAuth Consent]
  C --> D[GoogleからCallback /auth/google/callback]
  D --> E[Google ID Token 検証 & Email取得]
  E --> F{対応ユーザー存在?（email一致 or google_sub一致）}
  F -- あり --> G[ログイン（セッション発行）]
  F -- なし --> H[新規ユーザー作成（password_hashはNULL）]
  H --> G
  G --> I[200 OK / リダイレクト]
```

*   **メール確認**は不要（Googleにより確認済メール前提）。ただし組織運用で「特定ドメインのみ許可」も可能。

***

## 4. ログアウト


```Mermaid
flowchart TD
  A[POST /auth/logout] --> B[セッションクッキー無効化 / サーバーセッション破棄]
  B --> C[204 No Content or 302 redirect]
```

***

## 5. 「パスワードを忘れた場合」：リセット要求

```Mermaid
flowchart TD
    A[ユーザー: メール入力<br/>POST /auth/password-reset-request] --> B[入力検証 / RateLimit / CAPTCHA]
    B --> C{ユーザー検索}

    C -- "該当なし" --> D["常に 200 OK を返却<br/>(ユーザーの存在を秘匿)"]
    
    C -- "該当あり" --> E[過去の未使用トークンを失効]
    E --> F["リセットトークン生成 & 保存<br/>(hash, expires_at=30-60分)"]
    F --> G["Resendでリセットメール送信<br/>リンク: /auth/password-reset?token=..."]
    G --> H["常に 200 OK を返却<br/>(成功時と同じレスポンス)"]

    D --> END([終了])
    H --> END```

```

*   **存在確認を返さない**（アカウント列挙対策）
*   **レート制限**（IP/Email 単位）
*   **CAPTCHA** 必須（ボット対策）

***

## 6. パスワード再設定（トークン検証→新パスワードセット）

```Mermaid
flowchart TD
    A["GET /auth/password-reset?token=..."] --> B{"トークン検証1<br/>(hash/未使用/期限内)"}
    
    B -- "不正 / 期限切れ" --> C["400/410: 無効なトークン<br/>再要求画面へ誘導"]
    
    B -- OK --> D[新パスワード入力画面を表示]
    D --> E["POST /auth/password-reset-confirm<br/>(token, new_password)"]
    
    E --> F{"トークン再検証<br/>(TOCTOU対策)"}
    
    F -- 不正 --> G["400/410: 無効なトークン"]
    
    F -- OK --> H["users.password_hash を更新"]
    H --> I["email_verify_tokens.used_at = NOW()"]
    I --> J[既存の全セッションを失効]
    J --> K["200 OK: 再設定完了<br/>ログイン画面へ誘導"]

    C --> FIN([終了])
    G --> FIN
    K --> FIN
```

*   **TOCTOU 対策**：表示時と送信時で 2回検証
*   **再利用禁止**：used\_at 設定で 1回限り
*   **全セッション無効化**（オプションだが推奨）

***

## 7. ログイン中のパスワード変更（マイページ）


```Mermaid
flowchart TD
  A[ユーザー: 現在PW + 新PW 入力<br/>POST /user/change-password] --> B[認証済みチェック]
  B -- 未ログイン --> C[401 Unauthorized]
  B -- ログイン中 --> D[現在PW検証]
  D -- 不一致 --> E[400: 現在PW不一致]
  D -- 一致 --> F[新PWポリシー検証]
  F -- NG --> G[400: ポリシー違反]
  F -- OK --> H[users.password_hash を更新]
  H --> I[他デバイスのセッション無効化（任意だが推奨）]
  I --> J[200 OK]

```

***

## 8. セッション/デバイス管理（任意だが推奨）

*   「ログイン履歴・デバイス一覧」を表示し、**特定デバイスをリモートログアウト**可能に
*   **サーバーセッション方式**にする場合は `sessions` テーブルで管理\
    （CookieのセッションID→サーバー側レコード参照方式）

***

## 9. エンドポイント一覧（例）

```text
POST   /auth/signup                     # メール+PW登録
GET    /auth/verify?token=...           # メール確認
POST   /auth/login                      # メール+PWログイン
GET    /auth/google/start               # Google OAuth開始
GET    /auth/google/callback            # Google OAuthコールバック
POST   /auth/logout                     # ログアウト
POST   /auth/password-reset-request     # パスワードリセット要求
GET    /auth/password-reset             # トークン付でフォーム表示
POST   /auth/password-reset-confirm     # 新PW反映
POST   /user/change-password            # 現在PW→新PW
GET    /user/sessions                   # デバイス/セッション一覧（任意）
DELETE /user/sessions/:sessionId        # セッション失効（任意）
```

***

## 10. サーバーサイド擬似コード（共通ヘルパ）

```ts
// 生成
function generateToken(): string { /* crypto.randomBytes(32) → base64url */ }
function hashToken(token: string): string { /* SHA-256 */ }

// 保存（例：パスワードリセット）
async function issuePasswordResetToken(userId: string) {
  const token = generateToken();
  const tokenHash = hashToken(token);
  const expiresAt = addMinutes(new Date(), 60);
  await db.insert('password_reset_tokens', { user_id: userId, token_hash: tokenHash, expires_at: expiresAt });
  return token; // メールに埋め込む
}

// 検証
async function verifyPasswordResetToken(token: string) {
  const hash = hashToken(token);
  const row = await db.one('SELECT * FROM password_reset_tokens WHERE token_hash=?', [hash]);
  if (!row) return { ok: false, reason: 'not_found' };
  if (row.used_at) return { ok: false, reason: 'used' };
  if (new Date(row.expires_at) < new Date()) return { ok: false, reason: 'expired' };
  return { ok: true, tokenRow: row };
}
```

***

## 11. UX の細かい推奨

*   **メール送信の結果は常に同じ文言**（存在有無を漏らさない）
*   **入力エラーは一般化したメッセージ**（「メールまたはパスワードが正しくありません」）
*   **多要素（任意）**：メールワンタイムコードや TOTP を段階的に導入できる構成に
*   **メール文面**：
    *   有効期限の明記（例：「このリンクは60分で期限切れになります」）
    *   万一心当たりがない場合の説明と無視の案内
    *   サポート連絡先

***

# まとめ

*   **メール＋PW／Google** の **サインアップ／ログイン** と、**パスワード忘れ（リセット）** の **完全な認可フロー**を提示しました。
*   実装の鍵は **トークンの安全管理（ハッシュ＋短期＋1回限り）**、**レート制限／CAPTCHA**、**メール確認の必須化（推奨）**、**セッション無効化（リセット後）** です。

必要であれば、このフローを **draw\.io（.drawio）** や **PNG** に変換したもの、あるいは **Next.js App Router のルート実装雛形（route.ts）** も用意します。\
次は **どのフローからコード化**しますか？（例：`/auth/password-reset-request` と `/auth/password-reset-confirm` から）


Tailwind CSSを使用して、以下の配色・スタイルガイドに沿ったUIデザインを作成してください。

1. カラーパレットの定義:

ベースカラー（Primary）: 昔のWindows（95/98/2000等）のタイトルバーに使用されていた、クラシックなネイビー（HEX: #000080）をメインに使用してください。

背景色: メインのコンテンツエリアは清潔感のある白（white）または非常に薄いグレー（slate-50）にしてください。

テキスト色: 基本のテキストは slate-800（濃いグレー）とし、ベースカラー（ネイビー）の背景上では必ず white を使用して高いコントラストを確保してください。

2. デザインの方向性:

ヘッダー/サイドバー: 上記のネイビー（#000080）を背景色として適用し、どっしりとした信頼感のある印象を与えてください。

アクセント: 重要なアクションボタンもこのネイビー（#000080）を使い、ホバー時には少し明るくするか、透明度を調整してください。

モダンな調整: 色合いはレトロですが、コンポーネントの配置や余白（p-4など）、角丸（rounded-md）は現代的な基準で作成し、「クラシックとモダンの融合」を目指してください。

3. 実装の要望:

Tailwind CSSのJITモード（bg-[#000080] などの任意値指定）を使用してコーディングしてください。
