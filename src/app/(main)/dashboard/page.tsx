import { getPosts } from "@/service/qppost-service";
import { query } from "@/lib/db";
import Link from "next/link";
import { getRelativeTime } from "@/lib/utils/date";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

async function getRecentComments() {
  const res = await query(
    `SELECT c.*, p.title as post_title, u.display_name as owner_name
     FROM qps_comments c
     JOIN qps_posts p ON c.post_id = p.id
     LEFT JOIN users u ON c.owner_id = u.id
     WHERE p.is_active = 1 AND p.is_public = 1
     ORDER BY c.created_at DESC LIMIT 5`,
  );
  return res.rows;
}

export default async function Home() {
  const posts = await getPosts({ limit: 6 });
  const recentComments = await getRecentComments();

  return (
    <div className="container py-8 space-y-12 px-4 max-w-7xl mx-auto">
      <section className="text-center py-16 border-2 border-[#4d4db2] bg-white rounded-xl shadow-lg mb-12">
        <h1 className="text-4xl font-extrabold tracking-tight lg:text-6xl mb-6 text-[#4d4db2]">
          SQL Server Query Plan Share
        </h1>
        <p className="text-xl text-slate-600 mb-10 max-w-2xl mx-auto font-medium">
          実行プランを共有し、ブラウザで可視化・分析。
          クエリパフォーマンスの最適化をサポートします。
        </p>
        <div className="flex justify-center gap-6">
          <Link href="/qpposts/new">
            <Button
              size="lg"
              className="bg-[#4d4db2] text-white hover:bg-[#6666cc] font-bold px-8 py-6 text-lg rounded-md shadow-lg"
            >
              プランを投稿する
            </Button>
          </Link>
          <Link href="/qpposts">
            <Button
              size="lg"
              variant="outline"
              className="bg-transparent border-2 border-[#4d4db2] text-[#4d4db2] hover:bg-blue-50 font-bold px-8 py-6 text-lg rounded-md shadow-lg"
            >
              プランを探す
            </Button>
          </Link>
        </div>
      </section>

      <div className="grid gap-12 lg:grid-cols-3">
        <section className="lg:col-span-2">
          <div className="flex items-center justify-between mb-8 border-b-2 border-[#4d4db2] pb-2">
            <h2 className="text-2xl font-bold text-[#4d4db2]">最新のプラン</h2>
            <Link
              href="/qpposts"
              className="text-sm font-semibold text-[#4d4db2] hover:underline"
            >
              すべて見る &rarr;
            </Link>
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            {posts.map((post) => (
              <Card
                key={post.id}
                className="flex flex-col border-2 border-[#4d4db2] shadow-md hover:shadow-lg transition-shadow bg-white rounded-lg overflow-hidden group"
              >
                <CardHeader className="bg-blue-50/50 border-b border-[#4d4db2]">
                  <CardTitle className="line-clamp-1 text-[#4d4db2] transition-colors">
                    {post.title}
                  </CardTitle>
                  <div className="text-xs text-slate-500 font-medium">
                    投稿者: {post.owner_name || "ゲスト"} •{" "}
                    {getRelativeTime(post.updated_at)}
                  </div>
                </CardHeader>
                <CardContent className="flex-1 p-5 bg-slate-50/30">
                  <p className="text-sm text-slate-600 line-clamp-3 leading-relaxed">
                    {post.comment_markdown || "説明はありません。"}
                  </p>
                </CardContent>
                <CardFooter className="p-5 pt-0 bg-slate-50/30">
                  <Link href={`/qpposts/${post.id}`} className="w-full">
                    <Button
                      variant="outline"
                      className="w-full border-2 border-[#4d4db2] text-[#4d4db2] hover:bg-[#4d4db2] hover:text-white font-bold transition-all"
                    >
                      プランを表示
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            ))}
            {posts.length === 0 && (
              <div className="col-span-full py-24 text-center text-slate-400 border-2 border-dashed border-[#4d4db2]/30 rounded-xl bg-white">
                まだ投稿がありません。
              </div>
            )}
          </div>
        </section>

        <section>
          <div className="flex items-center mb-8 border-b-2 border-[#4d4db2] pb-2">
            <h2 className="text-2xl font-bold text-[#4d4db2]">新着コメント</h2>
          </div>
          <div className="space-y-4">
            {recentComments.map((comment: any) => (
              <Link key={comment.id} href={`/qpposts/${comment.post_id}`}>
                <Card className="border-2 border-[#4d4db2]/50 hover:border-[#4d4db2] transition-all bg-white shadow-sm hover:shadow-md">
                  <CardHeader className="p-4 pb-2 bg-blue-50/30">
                    <div className="text-xs font-bold text-[#4d4db2] truncate">
                      {comment.post_title}
                    </div>
                  </CardHeader>
                  <CardContent className="p-4 pt-1">
                    <p className="text-sm text-slate-700 line-clamp-2 italic leading-relaxed">
                      "{comment.comment_markdown}"
                    </p>
                    <div className="mt-3 flex items-center justify-between text-[11px] text-slate-500 font-medium">
                      <span className="text-[#4d4db2]">
                        {comment.owner_name || "ゲスト"}
                      </span>
                      <span>{getRelativeTime(comment.created_at)}</span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
            {recentComments.length === 0 && (
              <div className="py-16 text-center text-slate-400 border-2 border-dashed border-[#4d4db2]/30 rounded-xl bg-white">
                コメントはありません。
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
