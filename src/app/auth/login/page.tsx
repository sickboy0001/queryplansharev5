"use client";

import { signIn } from "next-auth/react";
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

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    try {
      const result = await signIn("credentials", {
        email,
        password,
        callbackUrl: "/dashboard",
        redirect: false,
      });
      if (result?.error) {
        setError(
          "ログインに失敗しました。メールアドレスまたはパスワードが正しくありません。",
        );
      } else if (result?.url) {
        window.location.href = result.url;
      }
    } catch (error) {
      setError("予期せぬエラーが発生しました。");
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
            ログイン
          </CardTitle>
          <p className="text-sm text-slate-500 font-medium">QPSへようこそ</p>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md text-sm font-bold">
                {error}
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
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="font-bold text-slate-700">
                  パスワード
                </Label>
                <Link
                  href="/auth/password-reset"
                  className="text-[10px] text-[#4d4db2] hover:underline font-bold"
                >
                  パスワードを忘れた場合
                </Link>
              </div>
              <Input
                id="password"
                type="password"
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
              {isLoading ? "ログイン中..." : "ログイン"}
            </Button>
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t-2 border-slate-100" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-4 text-slate-400 font-bold">
                  または
                </span>
              </div>
            </div>
            <Button
              type="button"
              variant="outline"
              className="w-full border-2 border-slate-200 hover:bg-slate-50 font-bold py-6"
              onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
            >
              <svg
                className="mr-2 h-4 w-4"
                aria-hidden="true"
                focusable="false"
                data-prefix="fab"
                data-icon="google"
                role="img"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 488 512"
              >
                <path
                  fill="currentColor"
                  d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"
                ></path>
              </svg>
              Google でログイン
            </Button>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4 text-center">
            <div className="text-sm text-slate-500 font-medium">
              アカウントをお持ちではありませんか？{" "}
              <Link
                href="/auth/signup"
                className="text-[#4d4db2] hover:underline font-bold"
              >
                サインアップ
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
      </Card>
    </div>
  );
}
