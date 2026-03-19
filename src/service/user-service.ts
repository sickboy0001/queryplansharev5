import { query } from "@/lib/db";
import { auth } from "@/auth";

export async function getCurrentUser() {
  const session = await auth();
  if (!session?.user?.id) return null;

  const res = await query(
    "SELECT id, email, display_name, self_intro_markdown, is_admin, updated_at FROM users WHERE id = ?",
    [session.user.id],
  );

  return res.rows[0] || null;
}

export function isAdminEmail(email?: string | null) {
  if (!email) return false;
  const adminMails = process.env.ADMINISTRATOR_MAIL?.split(",") || [];
  return adminMails.includes(email);
}

export async function getUserById(id: string) {
  const res = await query(
    "SELECT id, display_name, self_intro_markdown, updated_at FROM users WHERE id = ?",
    [id],
  );
  return res.rows[0] || null;
}

export async function updateUserProfile(data: {
  display_name: string;
  self_intro_markdown: string;
}) {
  const user = await getCurrentUser();
  if (!user) throw new Error("Unauthorized");

  const now = new Date().toISOString();
  await query(
    "UPDATE users SET display_name = ?, self_intro_markdown = ?, updated_at = ? WHERE id = ?",
    [data.display_name, data.self_intro_markdown, now, user.id],
  );
}
