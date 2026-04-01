import { getUnlistedLinkByToken } from "@/service/qppost-service";
import { Metadata } from "next";
import { notFound, redirect } from "next/navigation";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "限定公開プラン | Query Plan Share",
  };
}

export default async function UnlistedPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  const link = await getUnlistedLinkByToken(token);

  if (!link) {
    notFound();
  }

  // Check expiry
  const expiresAt = new Date(link.expires_at);
  const now = new Date();

  if (now > expiresAt) {
    // 期限切れ
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <h1 className="text-2xl font-bold text-red-600 mb-4">
          このURLの有効期限は切れています
        </h1>
        <p className="text-gray-600">
          この限定公開URLは有効期限が切れているため、アクセスできません。
          作成者に新しいURLの発行を依頼してください。
        </p>
      </div>
    );
  }

  // Redirect to original post page
  // The original post page should handle the logic to allow viewing if it came from here or if is_public is handled correctly.
  // Actually, the requirement says "is_public: 1 で限定公開用のプラン参照ページから呼ばれた時"
  // We can pass a session or a cookie or a query param to signify this,
  // but for simplicity and security, we can just redirect to /qpposts/[id]?token=[token]
  redirect(`/qpposts/${link.post_id}?utoken=${token}`);
}
