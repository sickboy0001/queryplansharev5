import { query } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { v4 as uuidv4 } from "uuid";
import { sendPasswordResetEmail } from "@/lib/mail";

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json(
        { error: "メールアドレスは必須です。" },
        { status: 400 },
      );
    }

    // ユーザーが存在するか確認
    const res = await query("SELECT id FROM users WHERE email = ?", [email]);
    if (res.rows.length === 0) {
      return NextResponse.json(
        { error: "このメールアドレスは登録されていません。" },
        { status: 404 },
      );
    }

    const userId = res.rows[0].id as string;

    // リセットトークン生成
    const token = crypto.randomBytes(32).toString("hex");
    const tokenHash = crypto.createHash("sha256").update(token).digest("hex");
    const expiresAt = new Date(Date.now() + 1 * 60 * 60 * 1000).toISOString(); // 1時間後
    const now = new Date().toISOString();

    await query(
      "INSERT INTO password_reset_tokens (id, user_id, token_hash, expires_at, created_at) VALUES (?, ?, ?, ?, ?)",
      [uuidv4(), userId, tokenHash, expiresAt, now],
    );

    // リセットURL
    const baseUrl =
      process.env.NEXTAUTH_URL || `http://${req.headers.get("host")}`;
    const resetUrl = `${baseUrl}/auth/password-reset/new?token=${token}&email=${email}`;

    // メールの送信
    try {
      await sendPasswordResetEmail(email, resetUrl);
    } catch (mailError) {
      console.error("Password Reset Email Error:", mailError);

      console.log(
        "\n=== Password Reset Email Sent (Fallback for Test/Error) ===",
      );
      console.log(`To: ${email}`);
      console.log(`URL: ${resetUrl}`);
      console.log(
        "==========================================================\n",
      );

      return NextResponse.json(
        {
          error:
            "再設定メールの送信に失敗しました。詳細はサーバーログを確認してください。",
          resetUrl:
            process.env.NODE_ENV === "development" ? resetUrl : undefined,
        },
        { status: 500 },
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "処理中にエラーが発生しました。" },
      { status: 500 },
    );
  }
}
