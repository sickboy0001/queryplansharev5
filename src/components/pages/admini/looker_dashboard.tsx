"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function LookerDashboard() {
  const lookerUrl = process.env.NEXT_PUBLIC_LOOKER_STUDIO_URL || "";

  if (!lookerUrl) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Looker Studio 連携</CardTitle>
          <CardDescription>
            環境変数 <code>NEXT_PUBLIC_LOOKER_STUDIO_URL</code>{" "}
            が設定されていません。
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Looker Studio 分析ダッシュボード</CardTitle>
        <CardDescription>
          サービスの利用統計や分析結果を確認できます。
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="aspect-video w-full">
          <iframe
            src={lookerUrl}
            className="w-full h-full border-0"
            allowFullScreen
            sandbox="allow-storage-access-by-user-activation allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox"
          ></iframe>
        </div>
      </CardContent>
    </Card>
  );
}
