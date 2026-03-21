export type UnlistedFeature = {
  icon: "Clock" | "RefreshCw" | "Copy" | "ShieldCheck";
  title: string;
  description: string;
};

export const UNLISTED_GUIDE_CONTENT = {
  title: "限定公開（Unlisted）機能ガイド",
  description: "特定の相手にだけ期間限定で共有できる安全な公開方法です。",
  sections: [
    {
      id: 1,
      heading: "限定公開機能とは？",
      body: "「全体公開」とは異なり、プラン一覧ページや検索結果には表示されません。発行された専用のURL（トークン付きURL）を知っている人だけが、そのプランを閲覧することができます。",
    },
  ],
  features: [
    {
      icon: "Clock",
      title: "時限公開",
      description:
        "URLには有効期限があります（初期設定30日）。期限が切れると自動的にアクセスが遮断されます。",
    },
    {
      icon: "RefreshCw",
      title: "URLの再採番",
      description:
        "既存のURLを即座に無効化し、新しいURLを発行できます。不特定多数にURLが漏れた際も安心です。",
    },
  ] as UnlistedFeature[],
  steps: [
    {
      label: "STEP.01",
      text: "編集画面の「公開設定」で「限定公開」を選択します。",
    },
    {
      label: "STEP.02",
      text: "「限定公開URLを発行する」ボタンでURLを生成します。",
    },
    {
      label: "STEP.03",
      text: "必要に応じて「+10日」などで期限を調整し、コピーして共有します。",
    },
  ],
  notice:
    "作成者本人と管理者は、URLの状態に関わらず常に閲覧可能です。設定を「非公開」に戻すと、発行済みのURL経由でも他の人は閲覧できなくなります。",
};
