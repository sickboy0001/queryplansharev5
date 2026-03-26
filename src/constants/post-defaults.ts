/**
 * 投稿フォームのデフォルト値設定
 *
 * 環境変数からデフォルト値を設定できます:
 * - NEXT_PUBLIC_DEFAULT_POST_TITLE: タイトルのデフォルト値
 * - NEXT_PUBLIC_DEFAULT_POST_COMMENT: プランの説明のデフォルト値
 */
export const DEFAULT_POST_TITLE =
  typeof window !== "undefined" && process.env.NEXT_PUBLIC_DEFAULT_POST_TITLE
    ? process.env.NEXT_PUBLIC_DEFAULT_POST_TITLE
    : "デフォルトのタイトルです。";

export const DEFAULT_POST_COMMENT =
  typeof window !== "undefined" && process.env.NEXT_PUBLIC_DEFAULT_POST_COMMENT
    ? process.env.NEXT_PUBLIC_DEFAULT_POST_COMMENT
    : [
        "[デフォルトの説明]",
        "",
        "- 実行プランの説明をここに記入してください。Markdown 形式で記述できます。",
        "",
        "- 例:",
        "  - クエリの目的",
        "  - クエリの内容",
        "  - パフォーマンスの問題点",
        "",
        "- 共有することで、他のユーザーからフィードバックを得ることができます。",
        "- マークダウンの記載方法についてはフッターヘルプで確認できます。",
        "- **[Query Plan Share](https://queryplanshare.com)**で実行プランを共有しましょう！",
      ].join("\n");
