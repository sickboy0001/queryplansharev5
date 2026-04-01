export function isAdministrator(email: string | null | undefined): boolean {
  if (!email) return false;
  const adminMail = process.env.ADMINISTRATOR_MAIL;
  if (!adminMail) return false;

  // カンマ区切りで複数指定されている場合も考慮
  const adminMails = adminMail.split(",").map((m) => m.trim().toLowerCase());
  return adminMails.includes(email.toLowerCase());
}
