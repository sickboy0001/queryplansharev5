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

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [password, setPassword] = useState("");
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
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, displayName, password }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage({
          type: "success",
          text: "確認メールを送信しました。メール内のリンクをクリックして登録を完了してください。",
        });
      } else {
        setMessage({
          type: "error",
          text: data.error || "サインアップに失敗しました。",
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
            新規登録
          </CardTitle>
          <p className="text-sm text-slate-500 font-medium">
            QPSへようこそ！アカウントを作成しましょう
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
                <Label
                  htmlFor="display_name"
                  className="font-bold text-slate-700"
                >
                  表示名
                </Label>
                <Input
                  id="display_name"
                  placeholder="ユーザー名"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  required
                  className="border-2 focus:border-[#4d4db2] focus:ring-0"
                />
              </div>
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
              <div className="space-y-2">
                <Label htmlFor="password" className="font-bold text-slate-700">
                  パスワード
                </Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="border-2 focus:border-[#4d4db2] focus:ring-0"
                />
              </div>
              <Button
                type="submit"
                className="w-full bg-[#4d4db2] hover:bg-[#6666cc] text-white font-black py-6 text-lg rounded-lg shadow-md transition-all"
                disabled={isLoading}
              >
                {isLoading ? "送信中..." : "登録する"}
              </Button>
            </CardContent>
            <CardFooter className="flex flex-col space-y-4 text-center">
              <div className="text-sm text-slate-500 font-medium">
                すでにアカウントをお持ちですか？{" "}
                <Link
                  href="/auth/login"
                  className="text-[#4d4db2] hover:underline font-bold"
                >
                  ログイン
                </Link>
              </div>
              <Link
                href="/"
                className="text-xs text-slate-400 hover:text-[#4d4db2] transition-colors font-bold"
              >
                トップページに戻る
              </Link>
            </CardFooter>
          </form>
        )}
      </Card>
    </div>
  );
}
