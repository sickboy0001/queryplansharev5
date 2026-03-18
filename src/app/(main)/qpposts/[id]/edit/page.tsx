import { getPostById } from "@/service/qppost-service";
import { auth } from "@/auth";
import { notFound, redirect } from "next/navigation";
import EditPost from "@/components/pages/qppost/EditPost";

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
  const isOwner = session?.user?.id && post.owner_id === session.user.id;
  if (!isOwner) {
    redirect(`/qpposts/${id}`);
  }

  // Ensure plain object for client component
  const plainPost = JSON.parse(JSON.stringify(post));

  return <EditPost post={plainPost} />;
}
