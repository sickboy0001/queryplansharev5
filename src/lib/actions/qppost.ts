"use server";

import {
  createUnlistedLink,
  deleteUnlistedLinkByPostId,
  getUnlistedLinkByPostId,
  updateUnlistedLinkExpiry,
  resetUnlistedLinkExpiry,
  getPostById,
  getAllPostsForAdmin,
  getPosts,
  getMyAllPosts,
} from "@/service/qppost-service";
import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { isAdminEmail } from "@/service/user-service";
import bcrypt from "bcryptjs";
import { verifyGuestEditCookie } from "@/lib/guest-auth";
import { cookies } from "next/headers";

export async function getPostsAction(options: { ownerId?: string } = {}) {
  const posts = await getPosts(options);
  return JSON.parse(JSON.stringify(posts));
}

export async function getMyAllPostsAction() {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");
  const posts = await getMyAllPosts(session.user.id);
  return JSON.parse(JSON.stringify(posts));
}

export async function getAllPostsForAdminAction() {
  const session = await auth();
  const isAdmin = isAdminEmail(session?.user?.email);
  if (!isAdmin) throw new Error("Unauthorized");

  const posts = await getAllPostsForAdmin();
  return JSON.parse(JSON.stringify(posts));
}

async function checkAuth(postId: string, editToken?: string) {
  const session = await auth();
  const post = await getPostById(postId);
  if (!post) throw new Error("Post not found");

  const isAdmin = isAdminEmail(session?.user?.email);
  const isOwner = !!(
    session?.user?.id &&
    post.owner_id &&
    String(post.owner_id) === String(session.user.id)
  );

  // 古い editToken 方式（下位互換）
  const isGuestWithValidPwd = !!(
    editToken &&
    post.edit_token &&
    (await bcrypt.compare(editToken, post.edit_token))
  );

  // 新しい JWT 方式
  const guestPayload = await verifyGuestEditCookie(postId);
  const isGuestWithJwt = !!(guestPayload && guestPayload.postId === postId);

  if (!isAdmin && !isOwner && !isGuestWithValidPwd && !isGuestWithJwt) {
    throw new Error("Unauthorized");
  }
}

export async function verifyPostPasswordAction(
  postId: string,
  password: string,
) {
  const post = await getPostById(postId);
  if (!post || !post.edit_token) return false;

  const isMatch = await bcrypt.compare(password, post.edit_token);
  return isMatch;
}

export async function getOrCreateUnlistedLinkAction(
  postId: string,
  editToken?: string,
) {
  await checkAuth(postId, editToken);

  let link = await getUnlistedLinkByPostId(postId);
  if (!link) {
    // Default 30 days (720 hours)
    link = (await createUnlistedLink(postId, 720)) as any;
  }

  revalidatePath(`/qpposts/${postId}/edit`);
  return link;
}

export async function addExpiryDaysAction(
  postId: string,
  token: string,
  days: number,
  editToken?: string,
) {
  await checkAuth(postId, editToken);
  await updateUnlistedLinkExpiry(token, days);
  revalidatePath(`/qpposts/${postId}/edit`);
}

export async function regenerateUnlistedLinkAction(
  postId: string,
  editToken?: string,
) {
  await checkAuth(postId, editToken);

  await deleteUnlistedLinkByPostId(postId);
  const link = await createUnlistedLink(postId, 720);

  revalidatePath(`/qpposts/${postId}/edit`);
  return link;
}

export async function resetExpiryAction(
  postId: string,
  token: string,
  hours: number = 720,
  editToken?: string,
) {
  await checkAuth(postId, editToken);
  await resetUnlistedLinkExpiry(token, hours);
  revalidatePath(`/qpposts/${postId}/edit`);
}

export async function deleteUnlistedLinkAction(
  postId: string,
  editToken?: string,
) {
  await checkAuth(postId, editToken);
  await deleteUnlistedLinkByPostId(postId);
  revalidatePath(`/qpposts/${postId}/edit`);
}
