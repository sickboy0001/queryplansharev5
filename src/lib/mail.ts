import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendVerificationEmail(to: string, url: string) {
  try {
    const { data, error } = await resend.emails.send({
      from: "QPS <onboarding@resend.dev>",
      to: [to],
      subject: "【QPS】アカウント登録の確認",
      html: `
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
        </div>
      `,
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

export async function sendPasswordResetEmail(to: string, url: string) {
  try {
    const { data, error } = await resend.emails.send({
      from: "QPS <onboarding@resend.dev>",
      to: [to],
      subject: "【QPS】パスワード再設定のご案内",
      html: `
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
        </div>
      `,
    });

    if (error) throw error;
    return data;
  } catch (err) {
    console.error("Password reset email failed:", err);
    throw err;
  }
}
