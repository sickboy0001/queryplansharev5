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
import { useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";

function ResetForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");
  const email = searchParams.get("email");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  if (!token || !email) {
    return (
      <div className="text-center p-8 bg-red-50 text-red-600 rounded-xl border-2 border-red-200">
        <p className="font-bold">無効なリンクです。</p>
        <Link href="/auth/password-reset">
          <Button variant="link" className="text-red-600 underline">
            再設定をやり直す
          </Button>
        </Link>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setMessage({ type: "error", text: "パスワードが一致しません。" });
      return;
    }

    setIsLoading(true);
    setMessage(null);

    try {
      const res = await fetch("/api/auth/password-reset/confirm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage({
          type: "success",
          text: "パスワードを更新しました。新しいパスワードでログインしてください。",
        });
        setTimeout(() => router.push("/auth/login"), 3000);
      } else {
        setMessage({
          type: "error",
          text: data.error || "更新に失敗しました。",
        });
      }
    } catch (error) {
      setMessage({ type: "error", text: "予期せぬエラーが発生しました。" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {message && (
        <div
          className={`px-4 py-3 rounded-md text-sm font-bold ${message.type === "success" ? "bg-green-50 text-green-700 border border-green-200" : "bg-red-50 text-red-600 border border-red-200"}`}
        >
          {message.text}
        </div>
      )}
      <div className="space-y-2">
        <Label htmlFor="password">新しいパスワード</Label>
        <Input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="border-2 focus:border-[#4d4db2]"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="confirm_password">パスワード（確認）</Label>
        <Input
          id="confirm_password"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
          className="border-2 focus:border-[#4d4db2]"
        />
      </div>
      <Button
        type="submit"
        className="w-full bg-[#4d4db2] text-white font-black py-6"
        disabled={isLoading}
      >
        {isLoading ? "更新中..." : "パスワードを更新する"}
      </Button>
    </form>
  );
}

export default function NewPasswordPage() {
  return (
    <div className="container flex items-center justify-center min-h-screen py-12 px-4 mx-auto">
      <Card className="w-full max-w-md border-2 border-[#4d4db2] shadow-xl">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-black text-[#4d4db2]">
            パスワード再設定
          </CardTitle>
          <p className="text-sm text-slate-500">
            新しいパスワードを入力してください
          </p>
        </CardHeader>
        <CardContent>
          <Suspense fallback={<div>読み込み中...</div>}>
            <ResetForm />
          </Suspense>
        </CardContent>
      </Card>
    </div>
  );
}
