import { getPosts } from "@/service/qppost-service";
import { getRecentComments } from "@/service/comments-service";
import Dashboard from "@/components/pages/dashboard/Dashboard";
import { Metadata } from "next";
import { auth } from "@/auth";
import { isAdministrator } from "@/lib/user";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "qps5 - Dashboard",
  };
}

export default async function Home() {
  const posts = await getPosts({ limit: 6 });
  const recentComments = await getRecentComments(5);
  const session = await auth();
  const isAdmin = isAdministrator(session?.user?.email);

  // Ensure plain objects for client component
  const plainPosts = JSON.parse(JSON.stringify(posts));
  const plainComments = JSON.parse(JSON.stringify(recentComments));

  return (
    <Dashboard
      posts={plainPosts}
      recentComments={plainComments}
      isAdmin={isAdmin}
    />
  );
}
