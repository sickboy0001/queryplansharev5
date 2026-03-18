import { getPosts } from "@/service/qppost-service";
import PostList from "@/components/pages/qppost/PostList";

export default async function PostsPage({
  searchParams,
}: {
  searchParams: Promise<{ ownerId?: string }>;
}) {
  const { ownerId } = await searchParams;
  const posts = await getPosts({ ownerId });

  // Ensure plain objects for client component
  const plainPosts = JSON.parse(JSON.stringify(posts));

  return <PostList posts={plainPosts} ownerId={ownerId} />;
}
