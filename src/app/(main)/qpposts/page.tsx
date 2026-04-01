import QpPostList from "@/components/pages/qppost/QpPostList";
import { auth } from "@/auth";
import { isAdminEmail } from "@/service/user-service";
import { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "プランギャラリー | Query Plan Share",
  };
}

export default async function PostsPage({
  searchParams,
}: {
  searchParams: Promise<{ ownerId?: string }>;
}) {
  const session = await auth();
  const { ownerId } = await searchParams;

  const isAdmin = isAdminEmail(session?.user?.email);

  return (
    <QpPostList
      ownerId={ownerId}
      currentUserId={session?.user?.id}
      isAdmin={isAdmin}
    />
  );
}
