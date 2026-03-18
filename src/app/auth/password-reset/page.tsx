"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { useState } from "react";
import Link from "next/link";

export default function PasswordResetPage() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(null);

    try {
      const res = await fetch("/api/auth/password-reset", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage({
          type: "success",
          text: "パスワード再設定用のメールを送信しました。メール内のリンクをクリックして手続きを完了してください。",
        });
      } else {
        setMessage({
          type: "error",
          text: data.error || "リクエストに失敗しました。",
        });
      }
    } catch (error) {
      setMessage({ type: "error", text: "予期せぬエラーが発生しました。" });
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container flex items-center justify-center min-h-screen py-12 px-4 mx-auto">
      <Card className="w-full max-w-md border-2 border-[#4d4db2] shadow-xl">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-black text-[#4d4db2]">
            パスワード再設定
          </CardTitle>
          <p className="text-sm text-slate-500 font-medium">
            ご登録のメールアドレスを入力してください
          </p>
        </CardHeader>
        {message?.type === "success" ? (
          <CardContent className="space-y-6 text-center py-8">
            <div className="bg-green-50 border border-green-200 text-green-700 px-6 py-8 rounded-xl">
              <div className="text-4xl mb-4">📧</div>
              <h3 className="text-xl font-bold mb-2">メールを送信しました</h3>
              <p className="text-sm leading-relaxed">{message.text}</p>
            </div>
            <Link href="/auth/login">
              <Button
                variant="outline"
                className="w-full mt-4 font-bold border-2 border-[#4d4db2] text-[#4d4db2]"
              >
                ログイン画面へ戻る
              </Button>
            </Link>
          </CardContent>
        ) : (
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-6">
              {message?.type === "error" && (
                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md text-sm font-bold">
                  {message.text}
                </div>
              )}
              <div className="space-y-2">
                <Label htmlFor="email" className="font-bold text-slate-700">
                  メールアドレス
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="border-2 focus:border-[#4d4db2] focus:ring-0"
                />
              </div>
              <Button
                type="submit"
                className="w-full bg-[#4d4db2] hover:bg-[#6666cc] text-white font-black py-6 text-lg rounded-lg shadow-md transition-all"
                disabled={isLoading}
              >
                {isLoading ? "送信中..." : "再設定メールを送信"}
              </Button>
            </CardContent>
            <CardFooter className="flex flex-col space-y-4 text-center">
              <Link
                href="/auth/login"
                className="text-sm text-[#4d4db2] hover:underline font-bold"
              >
                ログイン画面に戻る
              </Link>
            </CardFooter>
          </form>
        )}
      </Card>
    </div>
  );
}
