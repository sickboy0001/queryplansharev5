import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

/**
 * Resend APIを使用してメールを送信する共通関数
 */
async function sendResendEmail({
  to,
  subject,
  html,
  from = "QPS <onboarding@resend.dev>",
}: {
  to: string | string[];
  subject: string;
  html: string;
  from?: string;
}) {
  try {
    const { data, error } = await resend.emails.send({
      from,
      to: Array.isArray(to) ? to : [to],
      subject,
      html,
    });

    if (error) {
      console.error("Resend Error:", error);
      throw new Error("メールの送信に失敗しました。");
    }

    return data;
  } catch (err) {
    console.error("Email sending failed:", err);
    throw err;
  }
}

export async function sendVerificationEmail(to: string, url: string) {
  const html = `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
      <h2 style="color: #4d4db2; text-align: center;">QPSへようこそ！</h2>
      <p>QPS（Query Plan Share）へのご登録ありがとうございます。</p>
      <p>以下のボタンをクリックして、アカウントの登録を完了させてください。</p>
      <div style="text-align: center; margin: 30px 0;">
        <a href="${url}" style="background-color: #4d4db2; color: white; padding: 12px 24px; text-decoration: none; font-weight: bold; border-radius: 6px; display: inline-block;">
          アカウントを承認する
        </a>
      </div>
      <p style="font-size: 12px; color: #64748b;">
        このメールに心当たりがない場合は、お手数ですが破棄してください。<br>
        ボタンが正しく動作しない場合は、以下のURLをブラウザに貼り付けてください：<br>
        ${url}
      </p>
      <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 20px 0;">
      <p style="text-align: center; font-size: 12px; color: #94a3b8;">
        &copy; ${new Date().getFullYear()} QPS - SQL Server Query Plan Share
      </p>
      <div style="margin-top: 20px; padding: 10px; background-color: #fef2f2; border: 1px solid #fee2e2; border-radius: 4px; font-size: 11px; color: #991b1b;">
        ※制限事項：Resendの無料枠（ドメイン未認証）を使用しているため、管理者（syunjyu0001@gmail.com）以外への送信は現在制限されています。
      </div>
    </div>
  `;

  return sendResendEmail({
    to,
    subject: "【QPS】アカウント登録の確認",
    html,
  });
}

export async function sendPasswordResetEmail(to: string, url: string) {
  const html = `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
      <h2 style="color: #4d4db2; text-align: center;">パスワード再設定</h2>
      <p>QPSをご利用いただきありがとうございます。</p>
      <p>パスワードの再設定リクエストを受け付けました。以下のボタンをクリックして新しいパスワードを設定してください。</p>
      <div style="text-align: center; margin: 30px 0;">
        <a href="${url}" style="background-color: #4d4db2; color: white; padding: 12px 24px; text-decoration: none; font-weight: bold; border-radius: 6px; display: inline-block;">
          パスワードを再設定する
        </a>
      </div>
      <p style="font-size: 12px; color: #64748b;">
        このメールに心当たりがない場合は、お手数ですが破棄してください。パスワードが変更されることはありません。<br>
        ボタンが正しく動作しない場合は、以下のURLをブラウザに貼り付けてください：<br>
        ${url}
      </p>
      <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 20px 0;">
      <p style="text-align: center; font-size: 12px; color: #94a3b8;">
        &copy; ${new Date().getFullYear()} QPS - SQL Server Query Plan Share
      </p>
      <div style="margin-top: 20px; padding: 10px; background-color: #fef2f2; border: 1px solid #fee2e2; border-radius: 4px; font-size: 11px; color: #991b1b;">
        ※制限事項：Resendの無料枠（ドメイン未認証）を使用しているため、管理者（syunjyu0001@gmail.com）以外への送信は現在制限されています。
      </div>
    </div>
  `;

  return sendResendEmail({
    to,
    subject: "【QPS】パスワード再設定のご案内",
    html,
  });
}
