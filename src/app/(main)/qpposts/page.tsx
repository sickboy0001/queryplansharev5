import { getPosts } from "@/service/qppost-service";
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

export default async function PostsPage({
  searchParams,
}: {
  searchParams: Promise<{ ownerId?: string }>;
}) {
  const { ownerId } = await searchParams;
  const posts = await getPosts({ ownerId });

  return (
    <div className="container py-8 px-4 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8 border-b-2 border-[#4d4db2] pb-4">
        <h1 className="text-3xl font-black text-[#4d4db2]">
          {ownerId ? "ユーザーのプラン一覧" : "プラン一覧"}
        </h1>
        <Link href="/qpposts/new">
          <Button className="bg-[#4d4db2] hover:bg-[#6666cc] text-white font-bold shadow-md">
            新規投稿
          </Button>
        </Link>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <Card
            key={post.id}
            className="flex flex-col border-2 border-[#4d4db2]/30 hover:border-[#4d4db2] transition-all bg-white shadow-sm hover:shadow-md overflow-hidden"
          >
            <CardHeader className="bg-blue-50/30 border-b border-[#4d4db2]/10">
              <CardTitle className="line-clamp-1 text-[#4d4db2]">
                {post.title}
              </CardTitle>
              <div className="text-xs text-slate-500 font-medium">
                投稿者: {post.owner_name || "ゲスト"} •{" "}
                {getRelativeTime(post.updated_at)}
              </div>
            </CardHeader>
            <CardContent className="flex-1 p-5">
              <p className="text-sm text-slate-600 line-clamp-3 leading-relaxed">
                {post.comment_markdown || "説明はありません。"}
              </p>
            </CardContent>
            <CardFooter className="p-5 pt-0">
              <Link href={`/qpposts/${post.id}`} className="w-full">
                <Button
                  variant="outline"
                  className="w-full border-2 border-[#4d4db2] text-[#4d4db2] hover:bg-[#4d4db2] hover:text-white font-bold transition-all"
                >
                  表示する
                </Button>
              </Link>
            </CardFooter>
          </Card>
        ))}
        {posts.length === 0 && (
          <div className="col-span-full py-24 text-center text-slate-400 border-2 border-dashed border-[#4d4db2]/20 rounded-xl bg-white">
            プランが見つかりませんでした。
          </div>
        )}
      </div>
    </div>
  );
}
