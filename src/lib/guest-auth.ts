import { SignJWT, jwtVerify, JWTPayload } from "jose";
import { cookies } from "next/headers";

const JWT_SECRET = new TextEncoder().encode(
  process.env.AUTH_SECRET || "fallback-secret-change-in-production",
);

const COOKIE_NAME = "guest_edit_token";
const TOKEN_EXPIRY_HOURS = 1; // JWT の有効期限

export interface GuestEditPayload {
  postId: string;
  verifiedAt: number;
}

/**
 * JWT を生成し、HTTP-only Cookie に設定する
 */
export async function createGuestEditCookie(postId: string): Promise<void> {
  const payload: JWTPayload & GuestEditPayload = {
    postId,
    verifiedAt: Date.now(),
  };

  const token = await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${TOKEN_EXPIRY_HOURS}h`)
    .sign(JWT_SECRET);

  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: TOKEN_EXPIRY_HOURS * 60 * 60, // 1 時間
  });
}

/**
 * Cookie 内の JWT を検証し、ペイロードを返す
 * 検証失敗またはトークン不存在の場合は null を返す
 */
export async function verifyGuestEditCookie(
  postId: string,
): Promise<GuestEditPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;

  if (!token) {
    return null;
  }

  try {
    const { payload } = await jwtVerify(token, JWT_SECRET, {
      algorithms: ["HS256"],
    });

    // unknown 経由で型チェックを回避
    const typedPayload = payload as unknown as GuestEditPayload;

    // 投稿 ID が一致するか確認
    if (typedPayload.postId !== postId) {
      return null;
    }

    return typedPayload;
  } catch (error) {
    console.error("JWT verification failed:", error);
    return null;
  }
}

/**
 * ゲスト編集用 Cookie を削除する
 */
export async function clearGuestEditCookie(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}
