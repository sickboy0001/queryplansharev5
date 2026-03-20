"use client";

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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";

type Post = {
  id: string;
  title: string;
  comment_markdown: string;
  owner_id?: string;
  owner_name?: string;
  updated_at: string;
  is_active?: number;
  is_public?: number;
};

interface Props {
  posts: Post[];
  myPosts?: Post[];
  ownerId?: string;
  currentUserId?: string;
  isAdmin?: boolean;
}

export default function QpPostList({
  posts,
  myPosts = [],
  ownerId,
  currentUserId,
  isAdmin,
}: Props) {
  // マークダウン記号を取り除く簡易的な関数
  const stripMarkdown = (text: string) => {
    return text
      .replace(/[#*`~_]/g, "") // 基本的な記号 (# * ` ~ _) を削除
      .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1") // リンク [text](url) -> text
      .replace(/\n/g, " ") // 改行をスペースに
      .trim();
  };

  const PostGrid = ({ postsToDisplay }: { postsToDisplay: Post[] }) => (
    <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
      {postsToDisplay.map((post) => (
        <Card
          key={post.id}
          className={`flex flex-col border-2 transition-all bg-white shadow-sm hover:shadow-xl group overflow-hidden ${post.is_active === 0 ? "opacity-75 border-dashed border-slate-300" : "border-[#000080]/20 hover:border-[#000080]/50"}`}
        >
          <CardHeader className="bg-slate-50 border-b border-[#000080]/10 group-hover:bg-[#000080]/5 transition-colors">
            <div className="flex justify-between items-start gap-2">
              <CardTitle className="line-clamp-1 text-[#000080] text-lg font-bold">
                {post.title}
              </CardTitle>
              <div className="flex flex-col gap-1 items-end">
                {post.is_active === 0 && (
                  <Badge variant="destructive" className="text-[8px] h-4 px-1">
                    INACTIVE
                  </Badge>
                )}
                {post.is_public === 0 && (
                  <Badge
                    variant="outline"
                    className="text-[8px] h-4 px-1 border-slate-400 text-slate-500"
                  >
                    PRIVATE
                  </Badge>
                )}
              </div>
            </div>
            <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest flex items-center gap-2">
              <span className="text-[#000080]/60">
                BY {post.owner_name || "GUEST"}
              </span>
              <span>•</span>
              <span>{getRelativeTime(post.updated_at)}</span>
            </div>
          </CardHeader>
          <CardContent className="flex-1 p-6">
            <p className="text-sm text-slate-600 line-clamp-3 leading-relaxed italic">
              {post.comment_markdown
                ? stripMarkdown(post.comment_markdown)
                : "No description provided."}
            </p>
          </CardContent>
          <CardFooter className="p-6 pt-0 flex gap-2">
            <Link
              href={`/qpposts/${post.id}`}
              className={
                currentUserId === post.owner_id || isAdmin ? "flex-1" : "w-full"
              }
            >
              <Button
                variant="outline"
                className="w-full border-2 border-[#000080] text-[#000080] hover:bg-[#000080] hover:text-white font-bold transition-all h-10 shadow-sm"
              >
                VIEW PLAN
              </Button>
            </Link>
            {(currentUserId === post.owner_id || isAdmin) && (
              <Link href={`/qpposts/${post.id}/edit`} className="flex-1">
                <Button className="w-full bg-[#000080] hover:bg-[#0000a0] text-white font-bold transition-all h-10 shadow-sm border-2 border-[#000080]">
                  EDIT PLAN
                </Button>
              </Link>
            )}
          </CardFooter>
        </Card>
      ))}
      {postsToDisplay.length === 0 && (
        <div className="col-span-full py-32 text-center text-slate-300 border-4 border-dashed border-slate-100 rounded-2xl bg-white/50">
          <p className="text-xl font-bold uppercase tracking-widest">
            No plans found.
          </p>
        </div>
      )}
    </div>
  );

  return (
    <div className="container py-8 px-4 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8 border-b-4 border-[#000080] pb-4">
        <h1 className="text-3xl font-black text-[#000080] uppercase tracking-tighter">
          {ownerId ? "MY QUERY PLANS" : "QUERY PLAN GALLERY"}
        </h1>
        <Link href="/qpposts/new">
          <Button className="bg-[#000080] hover:bg-[#0000a0] text-white font-bold shadow-md h-11 px-6">
            新規投稿
          </Button>
        </Link>
      </div>

      {currentUserId ? (
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="mb-8 bg-slate-100 p-1 border-2 border-[#000080]/10">
            <TabsTrigger
              value="all"
              className="font-bold data-[state=active]:bg-[#000080] data-[state=active]:text-white"
            >
              一覧
            </TabsTrigger>
            <TabsTrigger
              value="mine"
              className="font-bold data-[state=active]:bg-[#000080] data-[state=active]:text-white"
            >
              投稿分
            </TabsTrigger>
          </TabsList>
          <TabsContent value="all">
            <PostGrid postsToDisplay={posts} />
          </TabsContent>
          <TabsContent value="mine">
            <PostGrid postsToDisplay={myPosts} />
          </TabsContent>
        </Tabs>
      ) : (
        <PostGrid postsToDisplay={posts} />
      )}
    </div>
  );
}
