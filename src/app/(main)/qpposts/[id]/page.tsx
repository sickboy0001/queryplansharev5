import {
  getPostById,
  getPostTitleById,
  getUnlistedLinkByToken,
} from "@/service/qppost-service";
import { notFound, redirect } from "next/navigation";
import QpPost from "@/components/pages/qppost/QpPost";
import { auth } from "@/auth";
import { isAdminEmail } from "@/service/user-service";
import { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const post = await getPostTitleById(id);

  if (!post) {
    return {
      title: "エラー: プランが見つかりません | Query Plan Share",
    };
  }

  return {
    title: `${post.title} | Query Plan Share`,
  };
}

export default async function PostDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ utoken?: string }>;
}) {
  const { id } = await params;
  const { utoken } = await searchParams;
  const post = await getPostById(id);
  const session = await auth();

  if (!post) {
    notFound();
  }

  const isAdmin = isAdminEmail(session?.user?.email);
  const isOwner = session?.user?.id && post.owner_id === session.user.id;

  // Access Control logic
  // 1. is_public = 2 (Public): Anyone can see
  // 2. is_public = 1 (Unlisted): Owner/Admin OR Valid utoken within expiry
  // 3. is_public = 0 (Private): Owner/Admin only
  // 4. is_active = 0: Owner/Admin only

  let hasAccess = false;

  if (isAdmin || isOwner) {
    hasAccess = true;
  } else if (post.is_active === 1) {
    if (post.is_public === 2) {
      hasAccess = true;
    } else if (post.is_public === 1 && utoken) {
      // Check utoken validity
      const link = await getUnlistedLinkByToken(utoken);
      if (link && link.post_id === id) {
        const expiresAt = new Date(link.expires_at);
        if (new Date() <= expiresAt) {
          hasAccess = true;
        }
      }
    }
  }

  if (!hasAccess) {
    redirect("/dashboard?error=unauthorized");
  }

  // Ensure plain object for client component
  const plainPost = JSON.parse(JSON.stringify(post));
  // Security: Remove edit_token but keep flag
  plainPost.hasPassword = !!post.edit_token;
  plainPost.isAdmin = isAdmin;
  delete plainPost.edit_token;

  return <QpPost post={plainPost} isAdmin={isAdmin} />;
}
