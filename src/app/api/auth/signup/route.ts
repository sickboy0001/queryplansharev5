import { query } from "@/lib/db";
import { hash } from "bcryptjs";
import { v4 as uuidv4 } from "uuid";
import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { sendVerificationEmail } from "@/lib/mail";

export async function POST(req: NextRequest) {
  try {
    const { email, password, displayName } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "メールアドレスとパスワードは必須です。" },
        { status: 400 },
      );
    }

    // すでにユーザーが存在するか確認
    const existing = await query("SELECT id FROM users WHERE email = ?", [
      email,
    ]);
    if (existing.rows.length > 0) {
      return NextResponse.json(
        { error: "このメールアドレスは既に登録されています。" },
        { status: 409 },
      );
    }

    const userId = uuidv4();
    const passwordHash = await hash(password, 12);
    const now = new Date().toISOString();

    // ユーザー作成
    await query(
      "INSERT INTO users (id, email, password_hash, display_name, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?)",
      [
        userId,
        email,
        passwordHash,
        displayName || email.split("@")[0],
        now,
        now,
      ],
    );

    // 承認トークン生成
    const verifyToken = crypto.randomBytes(32).toString("hex");
    const verifyTokenHash = crypto
      .createHash("sha256")
      .update(verifyToken)
      .digest("hex");
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(); // 24時間後

    await query(
      "INSERT INTO email_verify_tokens (id, user_id, token_hash, expires_at, created_at) VALUES (?, ?, ?, ?, ?)",
      [uuidv4(), userId, verifyTokenHash, expiresAt, now],
    );

    // 承認URL
    const baseUrl =
      process.env.NEXTAUTH_URL || `http://${req.headers.get("host")}`;
    const verifyUrl = `${baseUrl}/auth/verify?token=${verifyToken}&email=${email}`;

    // Resendを使用してメール送信（開発環境やドメイン未認証時は自身のメールアドレスのみ送信可能）
    try {
      await sendVerificationEmail(email, verifyUrl);
    } catch (mailError) {
      console.error("Verification Email Error:", mailError);

      // テスト環境制限などのエラー時にも、コンソールに情報を出力する
      console.log(
        "\n=== Verification Email Sent (Fallback for Test/Error) ===",
      );
      console.log(`To: ${email}`);
      console.log(`URL: ${verifyUrl}`);
      console.log("========================================================\n");

      // メールの送信に失敗しても、ユーザー作成自体は完了しているため
      // 開発時はコンソールに出力されたURLで継続できるように、成功レスポンスを返すか、
      // あるいはエラーをユーザーに通知するか判断が必要です。
      // ここでは、指示通り「メールの送信」を重要視しつつ、Resendの制限を考慮したエラーメッセージを返します。
      return NextResponse.json(
        {
          error:
            "確認メールの送信に失敗しました。Resendのテスト環境制限（許可されたアドレスのみ送信可）に抵触している可能性があります。詳細はサーバーログを確認してください。",
          verifyUrl:
            process.env.NODE_ENV === "development" ? verifyUrl : undefined,
        },
        { status: 500 },
      );
    }

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (error) {
    console.error("Signup Error:", error);
    return NextResponse.json(
      { error: "サインアップ処理中にエラーが発生しました。" },
      { status: 500 },
    );
  }
}
