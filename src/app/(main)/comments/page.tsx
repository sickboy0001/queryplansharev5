import { query } from "@/lib/db";
import { getRelativeTime } from "@/lib/utils/date";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import Link from "next/link";

async function getAllComments() {
  const res = await query(
    `SELECT c.*, p.title as post_title, u.display_name as owner_name
     FROM qps_comments c
     JOIN qps_posts p ON c.post_id = p.id
     LEFT JOIN users u ON c.owner_id = u.id
     WHERE p.is_active = 1 AND p.is_public = 1
     ORDER BY c.created_at DESC`,
  );
  return res.rows;
}

export default async function CommentsPage() {
  const comments = await getAllComments();

  return (
    <div className="container py-8 px-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-8 border-b-4 border-[#4d4db2] pb-4">
        <h1 className="text-3xl font-black text-[#4d4db2]">コメント一覧</h1>
      </div>

      <div className="grid gap-6">
        {comments.map((comment: any) => (
          <Link
            key={comment.id}
            href={`/qpposts/${comment.post_id}`}
            className="block group"
          >
            <Card className="border-2 border-[#4d4db2]/30 hover:border-[#4d4db2] transition-all bg-white shadow-sm hover:shadow-md overflow-hidden">
              <CardHeader className="bg-blue-50/50 py-3 px-6 border-b border-[#4d4db2]/10">
                <div className="text-xs font-black text-[#4d4db2] uppercase tracking-widest">
                  対象プラン: {comment.post_title}
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <p className="text-slate-700 mb-4 leading-relaxed font-medium">
                  "{comment.comment_markdown}"
                </p>
                <div className="flex items-center justify-between text-sm">
                  <span className="font-bold text-[#4d4db2]">
                    投稿者: {comment.owner_name || "ゲスト"}
                  </span>
                  <span className="text-slate-400 font-medium">
                    {getRelativeTime(comment.created_at)}
                  </span>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}

        {comments.length === 0 && (
          <div className="py-24 text-center text-slate-400 border-2 border-dashed border-[#4d4db2]/20 rounded-xl bg-white">
            コメントはまだありません。
          </div>
        )}
      </div>
    </div>
  );
}
