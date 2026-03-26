import { getPostById, getUnlistedLinkByPostId } from "@/service/qppost-service";
import { auth } from "@/auth";
import { notFound, redirect } from "next/navigation";
import EditPost from "@/components/pages/qppost/EditPost";
import { isAdminEmail } from "@/service/user-service";
import { verifyGuestEditCookie } from "@/lib/guest-auth";

export default async function EditPostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await auth();
  const post = await getPostById(id);

  if (!post) {
    notFound();
  }

  // Check if authorized
  const isAdmin = isAdminEmail(session?.user?.email);
  const isOwner = session?.user?.id && post.owner_id === session.user.id;

  // JWT でゲスト認証
  const isGuestWithValidToken = await verifyGuestEditCookie(id);

  if (!isAdmin && !isOwner && !isGuestWithValidToken) {
    redirect("/dashboard?error=unauthorized");
  }

  const unlistedLink = await getUnlistedLinkByPostId(id);

  // Ensure plain objects for client component
  const plainPost = JSON.parse(JSON.stringify(post));
  const plainUnlistedLink = unlistedLink
    ? JSON.parse(JSON.stringify(unlistedLink))
    : null;

  return <EditPost post={plainPost} unlistedLink={plainUnlistedLink} />;
}
