import { query } from "@/lib/db";
import { hash } from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

export async function POST(req: NextRequest) {
  try {
    const { token, email, password } = await req.json();

    if (!token || !email || !password) {
      return NextResponse.json(
        { error: "必要な情報が不足しています。" },
        { status: 400 },
      );
    }

    // トークンの検証
    const tokenHash = crypto.createHash("sha256").update(token).digest("hex");
    const res = await query(
      `SELECT t.*, u.id as user_id 
       FROM password_reset_tokens t
       JOIN users u ON t.user_id = u.id
       WHERE u.email = ? AND t.token_hash = ? AND t.used_at IS NULL AND t.expires_at > ?`,
      [email, tokenHash, new Date().toISOString()],
    );

    if (res.rows.length === 0) {
      return NextResponse.json(
        { error: "無効なトークンか、期限が切れています。" },
        { status: 400 },
      );
    }

    const resetToken = res.rows[0];
    const passwordHash = await hash(password, 12);
    const now = new Date().toISOString();

    // パスワード更新
    await query(
      "UPDATE users SET password_hash = ?, updated_at = ? WHERE id = ?",
      [passwordHash, now, resetToken.user_id],
    );

    // トークンを使用済みにする
    await query("UPDATE password_reset_tokens SET used_at = ? WHERE id = ?", [
      now,
      resetToken.id,
    ]);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "パスワードの更新中にエラーが発生しました。" },
      { status: 500 },
    );
  }
}
