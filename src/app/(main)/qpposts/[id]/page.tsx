import { getPostById } from "@/service/qppost-service";
import { notFound, redirect } from "next/navigation";
import QpPost from "@/components/pages/qppost/QpPost";
import { auth } from "@/auth";
import { isAdminEmail } from "@/service/user-service";

export default async function PostDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const post = await getPostById(id);
  const session = await auth();

  if (!post) {
    notFound();
  }

  // Deactive check
  if (post.is_active === 0) {
    const isAdmin = isAdminEmail(session?.user?.email);
    const isOwner = session?.user?.id && post.owner_id === session.user.id;

    if (!isAdmin && !isOwner) {
      redirect("/dashboard?error=unauthorized");
    }
  }

  // Ensure plain object for client component
  const plainPost = JSON.parse(JSON.stringify(post));

  return <QpPost post={plainPost} />;
}
