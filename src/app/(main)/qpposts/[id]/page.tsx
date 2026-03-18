import { getPostById } from "@/service/qppost-service";
import { notFound } from "next/navigation";
import QpPost from "@/components/pages/qppost/QpPost";

export default async function PostDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const post = await getPostById(id);

  if (!post) {
    notFound();
  }

  // Ensure plain object for client component
  const plainPost = JSON.parse(JSON.stringify(post));

  return <QpPost post={plainPost} />;
}
