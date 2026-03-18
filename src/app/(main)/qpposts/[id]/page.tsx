import { getPostById, getComments } from "@/service/qppost-service";
import { notFound } from "next/navigation";
import PlanVisualizer from "@/components/PlanVisualizer";
import { getRelativeTime } from "@/lib/utils/date";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import PostClient from "@/components/pages/qppost/qpost";

export default async function PostDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const post = await getPostById(id);
  const commentsRaw = await getComments(id);
  const comments = JSON.parse(JSON.stringify(commentsRaw));

  if (!post) {
    notFound();
  }

  return (
    <div className="container py-10 px-4 max-w-7xl mx-auto">
      <div className="flex flex-col gap-8">
        <div className="bg-white p-6 rounded-xl shadow-sm border-2 border-[#4d4db2]">
          <h1 className="text-3xl font-extrabold text-[#4d4db2] mb-3">
            {post.title}
          </h1>
          <div className="flex items-center gap-4 text-sm text-slate-500 font-medium">
            <span className="bg-blue-50 text-[#4d4db2] px-3 py-1 rounded-full border border-[#4d4db2]/30">
              投稿者: {post.owner_name || "ゲスト"}
            </span>
            <span>•</span>
            <span className="text-[#4d4db2]/70">
              更新日: {getRelativeTime(post.updated_at)}
            </span>
          </div>
        </div>

        <div className="bg-white p-2 rounded-xl shadow-md border-2 border-[#4d4db2]">
          <PlanVisualizer xmlData={post.query_plan_xml} />
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-8">
            <section className="bg-white p-8 rounded-xl shadow-sm border-2 border-[#4d4db2]">
              <h2 className="text-xl font-bold text-[#4d4db2] mb-6 flex items-center gap-2">
                <span className="w-1.5 h-6 bg-[#4d4db2] rounded-full"></span>
                プランの説明
              </h2>
              <div className="prose prose-slate max-w-none text-slate-700 leading-relaxed bg-slate-50/50 p-4 rounded-lg border border-slate-100">
                {post.comment_markdown || "説明はありません。"}
              </div>
            </section>

            <section className="bg-white p-8 rounded-xl shadow-sm border-2 border-[#4d4db2]">
              <h2 className="text-xl font-bold text-[#4d4db2] mb-6 flex items-center gap-2">
                <span className="w-1.5 h-6 bg-[#4d4db2] rounded-full"></span>
                コミュニティ・コメント ({comments.length})
              </h2>
              <PostClient postId={id} initialComments={comments} />
            </section>
          </div>

          <div className="space-y-6">
            <Card className="border-2 border-[#4d4db2] shadow-md overflow-hidden">
              <CardHeader className="bg-[#4d4db2] text-white py-4">
                <CardTitle className="text-sm font-bold uppercase tracking-wider text-center">
                  プラン情報
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-4 bg-white text-slate-800">
                <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                  <span className="text-xs font-bold text-slate-400 uppercase">
                    ステータス
                  </span>
                  <span
                    className={`text-xs font-bold px-2 py-1 rounded border ${post.is_active ? "bg-green-50 text-green-700 border-green-200" : "bg-slate-50 text-slate-700 border-slate-200"}`}
                  >
                    {post.is_active ? "アクティブ" : "アーカイブ"}
                  </span>
                </div>
                <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                  <span className="text-xs font-bold text-slate-400 uppercase">
                    公開設定
                  </span>
                  <span className="text-xs font-bold text-[#4d4db2]">
                    {post.is_public ? "公開" : "非公開"}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-slate-400 uppercase">
                    登録日
                  </span>
                  <span className="text-xs font-bold text-slate-700">
                    {getRelativeTime(post.created_at)}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
