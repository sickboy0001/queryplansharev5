import { query } from "@/lib/db";
import { notFound } from "next/navigation";
import crypto from "crypto";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function VerifyPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string; email?: string }>;
}) {
  const { token, email } = await searchParams;

  if (!token || !email) {
    return (
      <div className="container py-24 text-center">
        <h1 className="text-2xl font-bold text-red-600">
          無効なリクエストです
        </h1>
        <p className="mt-4">
          承認トークンまたはメールアドレスが不足しています。
        </p>
      </div>
    );
  }

  // トークンのハッシュ化
  const tokenHash = crypto.createHash("sha256").update(token).digest("hex");

  // トークンの有効性確認
  const res = await query(
    `SELECT t.*, u.id as user_id 
     FROM email_verify_tokens t
     JOIN users u ON t.user_id = u.id
     WHERE u.email = ? AND t.token_hash = ? AND t.used_at IS NULL AND t.expires_at > ?`,
    [email, tokenHash, new Date().toISOString()],
  );

  if (res.rows.length === 0) {
    return (
      <div className="container py-24 text-center">
        <div className="max-w-md mx-auto bg-white p-12 rounded-2xl shadow-xl border-4 border-red-200">
          <div className="text-6xl mb-6">⚠️</div>
          <h1 className="text-2xl font-black text-red-600 mb-4">
            承認に失敗しました
          </h1>
          <p className="text-slate-600 mb-8 font-medium">
            リンクが期限切れか、すでに使用されています。再度新規登録を行ってください。
          </p>
          <Link href="/auth/signup">
            <Button className="bg-[#4d4db2] text-white font-bold px-8 py-4">
              新規登録へ
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const verifyToken = res.rows[0];
  const now = new Date().toISOString();

  // 承認処理（ユーザーのメール確認日時を更新し、トークンを使用済みにする）
  await query("UPDATE users SET email_verified_at = ? WHERE id = ?", [
    now,
    verifyToken.user_id,
  ]);
  await query("UPDATE email_verify_tokens SET used_at = ? WHERE id = ?", [
    now,
    verifyToken.id,
  ]);

  return (
    <div className="container py-24 text-center px-4">
      <div className="max-w-md mx-auto bg-white p-12 rounded-2xl shadow-xl border-4 border-[#4d4db2]">
        <div className="text-6xl mb-6">🎉</div>
        <h1 className="text-3xl font-black text-[#4d4db2] mb-4">
          登録が完了しました！
        </h1>
        <p className="text-slate-600 mb-8 font-medium">
          アカウントの承認が成功しました。ログインしてサービスをご利用いただけます。
        </p>
        <Link href="/auth/login">
          <Button className="w-full bg-[#4d4db2] hover:bg-[#6666cc] text-white font-black py-8 text-xl rounded-xl shadow-lg transition-all hover:scale-105">
            ログイン画面へ
          </Button>
        </Link>
      </div>
    </div>
  );
}
