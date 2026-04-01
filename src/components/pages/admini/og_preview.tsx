"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export default function OgPreview() {
  const [title, setTitle] = useState("サンプルクエリプラン");
  const [author, setAuthor] = useState("管理者");
  const [previewUrl, setPreviewUrl] = useState("");

  const handlePreview = () => {
    const params = new URLSearchParams({
      title,
      author,
    });
    setPreviewUrl(`/api/og?${params.toString()}`);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>OGP パラメータ設定 実装中</CardTitle>
          <CardDescription>
            Vercel OG (/api/og) の生成パラメータを入力してください。
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">タイトル</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="タイトルを入力"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="author">作成者</Label>
            <Input
              id="author"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              placeholder="作成者を入力"
            />
          </div>
          <Button onClick={handlePreview} className="w-full">
            プレビューを更新
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>プレビュー結果</CardTitle>
          <CardDescription>
            生成された OGP 画像のプレビューです。
          </CardDescription>
        </CardHeader>
        <CardContent>
          {previewUrl ? (
            <div className="border rounded-lg overflow-hidden bg-muted aspect-[1200/630] flex items-center justify-center">
              <img
                src={previewUrl}
                alt="OGP Preview"
                className="max-w-full h-auto"
              />
            </div>
          ) : (
            <div className="border border-dashed rounded-lg aspect-[1200/630] flex items-center justify-center text-muted-foreground">
              パラメータを入力して更新ボタンを押してください
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
