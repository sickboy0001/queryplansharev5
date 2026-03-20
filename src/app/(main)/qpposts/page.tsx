import { getPosts, getMyAllPosts } from "@/service/qppost-service";
import QpPostList from "@/components/pages/qppost/QpPostList";
import { auth } from "@/auth";
import { isAdminEmail } from "@/service/user-service";

export default async function PostsPage({
  searchParams,
}: {
  searchParams: Promise<{ ownerId?: string }>;
}) {
  const session = await auth();
  const { ownerId } = await searchParams;

  const posts = await getPosts({ ownerId });
  const isAdmin = isAdminEmail(session?.user?.email);

  let myPosts: any[] = [];
  if (session?.user?.id) {
    const myAllPosts = await getMyAllPosts(session.user.id);
    myPosts = JSON.parse(JSON.stringify(myAllPosts));
  }

  // Ensure plain objects for client component
  const plainPosts = JSON.parse(JSON.stringify(posts));

  return (
    <QpPostList
      posts={plainPosts}
      myPosts={myPosts}
      ownerId={ownerId}
      currentUserId={session?.user?.id}
      isAdmin={isAdmin}
    />
  );
}
