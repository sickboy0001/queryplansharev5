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

type RecentComment = {
  id: string;
  post_id: string;
  post_title: string;
  comment_markdown: string;
  owner_name?: string;
  created_at: string;
};

interface Props {
  posts: Post[];
  recentComments: RecentComment[];
}

export default function Dashboard({ posts, recentComments }: Props) {
  return (
    <div className="container py-8 space-y-12 px-4 max-w-7xl mx-auto">
      {/* Hero Section */}
      <section className="text-center py-20 border-4 border-[#000080]/20 bg-white rounded-2xl shadow-xl mb-12 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-2 bg-[#000080]"></div>
        <h1 className="text-5xl font-black tracking-tighter lg:text-7xl mb-6 text-[#000080] uppercase">
          Query Plan Share
        </h1>
        <p className="text-xl text-slate-500 mb-10 max-w-2xl mx-auto font-bold leading-relaxed">
          Share, visualize, and analyze SQL Server execution plans. Empower your
          query performance tuning today.
        </p>
        <div className="flex justify-center gap-6">
          <Link href="/qpposts/new">
            <Button
              size="lg"
              className="bg-[#000080] text-white hover:bg-[#0000a0] font-black px-10 py-7 text-lg rounded-md shadow-xl transition-transform hover:scale-105"
            >
              POST A PLAN
            </Button>
          </Link>
          <Link href="/qpposts">
            <Button
              size="lg"
              variant="outline"
              className="bg-transparent border-4 border-[#000080] text-[#000080] hover:bg-[#000080]/5 font-black px-10 py-7 text-lg rounded-md shadow-xl transition-transform hover:scale-105"
            >
              BROWSE GALLERY
            </Button>
          </Link>
        </div>
      </section>

      <div className="grid gap-12 lg:grid-cols-3">
        {/* Recent Plans Section */}
        <section className="lg:col-span-2">
          <div className="flex items-center justify-between mb-8 border-b-4 border-[#000080] pb-2">
            <h2 className="text-2xl font-black text-[#000080] uppercase tracking-tight">
              Latest Plans
            </h2>
            <Link
              href="/qpposts"
              className="text-xs font-bold text-[#000080] hover:underline uppercase tracking-widest"
            >
              View All &rarr;
            </Link>
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            {posts.map((post) => (
              <Card
                key={post.id}
                className="flex flex-col border-2 border-[#000080]/20 shadow-md hover:shadow-xl transition-all bg-white rounded-lg overflow-hidden group"
              >
                <CardHeader className="bg-slate-50 border-b border-[#000080]/10 group-hover:bg-[#000080]/5 transition-colors">
                  <CardTitle className="line-clamp-1 text-[#000080] font-bold">
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
                <CardContent className="flex-1 p-5">
                  <p className="text-sm text-slate-600 line-clamp-3 leading-relaxed italic">
                    {post.comment_markdown || "No description provided."}
                  </p>
                </CardContent>
                <CardFooter className="p-5 pt-0">
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
              <div className="col-span-full py-24 text-center text-slate-300 border-4 border-dashed border-slate-100 rounded-xl bg-white/50">
                <p className="font-bold uppercase tracking-widest">
                  No plans posted yet.
                </p>
              </div>
            )}
          </div>
        </section>

        {/* Recent Comments Section */}
        <section>
          <div className="flex items-center mb-8 border-b-4 border-[#000080] pb-2">
            <h2 className="text-2xl font-black text-[#000080] uppercase tracking-tight">
              Recent Activity
            </h2>
          </div>
          <div className="space-y-4">
            {recentComments.map((comment) => (
              <Link key={comment.id} href={`/qpposts/${comment.post_id}`}>
                <Card className="border-2 border-[#000080]/10 hover:border-[#000080]/40 transition-all bg-white shadow-sm hover:shadow-lg overflow-hidden group">
                  <CardHeader className="p-4 pb-2 bg-slate-50 border-b border-slate-100 group-hover:bg-[#000080]/5 transition-colors">
                    <div className="text-[10px] font-bold text-[#000080]/60 uppercase tracking-widest truncate">
                      RE: {comment.post_title}
                    </div>
                  </CardHeader>
                  <CardContent className="p-4 pt-3">
                    <p className="text-sm text-slate-700 line-clamp-2 italic leading-relaxed mb-3">
                      "{comment.comment_markdown}"
                    </p>
                    <div className="flex items-center justify-between text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                      <span className="text-[#000080]">
                        {comment.owner_name || "GUEST"}
                      </span>
                      <span>{getRelativeTime(comment.created_at)}</span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
            {recentComments.length === 0 && (
              <div className="py-16 text-center text-slate-300 border-4 border-dashed border-slate-100 rounded-xl bg-white/50">
                <p className="font-bold uppercase tracking-widest">
                  No comments yet.
                </p>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
