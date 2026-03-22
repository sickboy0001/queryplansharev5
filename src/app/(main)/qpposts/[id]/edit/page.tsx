import { getPostById, getUnlistedLinkByPostId } from "@/service/qppost-service";
import { auth } from "@/auth";
import { notFound, redirect } from "next/navigation";
import EditPost from "@/components/pages/qppost/EditPost";
import { isAdminEmail } from "@/service/user-service";
import bcrypt from "bcryptjs";

export default async function EditPostPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ pwd?: string }>;
}) {
  const { id } = await params;
  const { pwd } = await searchParams;
  const session = await auth();
  const post = await getPostById(id);

  if (!post) {
    notFound();
  }

  // Check if authorized
  const isAdmin = isAdminEmail(session?.user?.email);
  const isOwner = session?.user?.id && post.owner_id === session.user.id;
  const isGuestWithValidPwd =
    pwd && post.edit_token && (await bcrypt.compare(pwd, post.edit_token));

  if (!isAdmin && !isOwner && !isGuestWithValidPwd) {
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
