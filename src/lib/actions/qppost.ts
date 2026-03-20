"use server";

import {
  createUnlistedLink,
  deleteUnlistedLinkByPostId,
  getUnlistedLinkByPostId,
  updateUnlistedLinkExpiry,
  resetUnlistedLinkExpiry,
  getPostById,
} from "@/service/qppost-service";
import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { isAdminEmail } from "@/service/user-service";

async function checkAuth(postId: string) {
  const session = await auth();
  const post = await getPostById(postId);
  if (!post) throw new Error("Post not found");

  const isAdmin = isAdminEmail(session?.user?.email);
  const isOwner = session?.user?.id && post.owner_id === session.user.id;

  if (!isAdmin && !isOwner) {
    throw new Error("Unauthorized");
  }
}

export async function getOrCreateUnlistedLinkAction(postId: string) {
  await checkAuth(postId);

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
) {
  await checkAuth(postId);
  await updateUnlistedLinkExpiry(token, days);
  revalidatePath(`/qpposts/${postId}/edit`);
}

export async function regenerateUnlistedLinkAction(postId: string) {
  await checkAuth(postId);

  await deleteUnlistedLinkByPostId(postId);
  const link = await createUnlistedLink(postId, 720);

  revalidatePath(`/qpposts/${postId}/edit`);
  return link;
}

export async function resetExpiryAction(
  postId: string,
  token: string,
  hours: number = 720,
) {
  await checkAuth(postId);
  await resetUnlistedLinkExpiry(token, hours);
  revalidatePath(`/qpposts/${postId}/edit`);
}
