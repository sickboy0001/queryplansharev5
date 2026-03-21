"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { AlertCircle, X } from "lucide-react";
import { PostCard, PostCardData } from "@/components/organisms/PostCard";
import {
  CommentCard,
  CommentCardData,
} from "@/components/organisms/CommentCard";
import { UnlistedGuideDrawer } from "@/components/organisms/UnlistedGuideDrawer";

interface Props {
  posts: PostCardData[];
  recentComments: CommentCardData[];
}

export default function Dashboard({ posts, recentComments }: Props) {
  const searchParams = useSearchParams();
  const errorParam = searchParams.get("error");
  const [showError, setShowError] = useState(false);

  useEffect(() => {
    if (errorParam) {
      setShowError(true);
      const url = new URL(window.location.href);
      url.searchParams.delete("error");
      window.history.replaceState({}, "", url.pathname);
    }
  }, [errorParam]);

  return (
    <div className="container py-8 space-y-12 px-4 max-w-7xl mx-auto">
      {showError && (
        <div className="bg-red-50 border-2 border-red-200 text-red-700 px-6 py-4 rounded-xl flex items-center justify-between gap-4 animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="flex items-center gap-4">
            <AlertCircle className="shrink-0" size={24} />
            <div className="font-bold">
              アクセス権限がありません。管理者または作成者のみがアクセス可能です。
            </div>
          </div>
          <button
            onClick={() => setShowError(false)}
            className="hover:bg-red-100 p-1 rounded-full transition-colors"
            title="閉じる"
          >
            <X size={20} />
          </button>
        </div>
      )}

      {/* Hero Section */}
      <section className="text-center py-20 border-4 border-[#000080]/20 bg-white rounded-2xl shadow-xl mb-12 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-2 bg-[#000080]"></div>
        <h1 className="text-5xl font-black tracking-tighter lg:text-7xl mb-6 text-[#000080] uppercase">
          Query Plan Share
        </h1>
        <p className="text-xl text-slate-500 mb-10 max-w-2xl mx-auto font-bold leading-relaxed">
          実行プランを共有、可視化して、クエリのチューニングを加速させましょう。
        </p>
        <div className="flex justify-center gap-6">
          <Link href="/qpposts/new">
            <button className="bg-[#000080] text-white hover:bg-[#0000a0] font-black px-10 py-5 text-lg rounded-md shadow-xl transition-transform hover:scale-105">
              POST A PLAN
            </button>
          </Link>
          <Link href="/qpposts">
            <button className="bg-transparent border-4 border-[#000080] text-[#000080] hover:bg-[#000080]/5 font-black px-10 py-5 text-lg rounded-md shadow-xl transition-transform hover:scale-105">
              BROWSE GALLERY
            </button>
          </Link>
        </div>
        <div className="mt-8 flex justify-center">
          <UnlistedGuideDrawer />
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
              <PostCard key={post.id} post={post} />
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
              <CommentCard key={comment.id} comment={comment} />
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
