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

type Post = {
  id: string;
  title: string;
  comment_markdown: string;
  owner_name?: string;
  updated_at: string;
};

interface Props {
  posts: Post[];
  ownerId?: string;
}

export default function PostList({ posts, ownerId }: Props) {
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

      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <Card
            key={post.id}
            className="flex flex-col border-2 border-[#000080]/20 hover:border-[#000080]/50 transition-all bg-white shadow-sm hover:shadow-xl group overflow-hidden"
          >
            <CardHeader className="bg-slate-50 border-b border-[#000080]/10 group-hover:bg-[#000080]/5 transition-colors">
              <CardTitle className="line-clamp-1 text-[#000080] text-lg font-bold">
                {post.title}
              </CardTitle>
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
                {post.comment_markdown || "No description provided."}
              </p>
            </CardContent>
            <CardFooter className="p-6 pt-0">
              <Link href={`/qpposts/${post.id}`} className="w-full">
                <Button
                  variant="outline"
                  className="w-full border-2 border-[#000080] text-[#000080] hover:bg-[#000080] hover:text-white font-bold transition-all h-10 shadow-sm"
                >
                  VIEW PLAN
                </Button>
              </Link>
            </CardFooter>
          </Card>
        ))}
        {posts.length === 0 && (
          <div className="col-span-full py-32 text-center text-slate-300 border-4 border-dashed border-slate-100 rounded-2xl bg-white/50">
            <p className="text-xl font-bold uppercase tracking-widest">
              No plans found.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
