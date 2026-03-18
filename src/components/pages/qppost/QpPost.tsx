"use client";

import PlanVisualizer from "@/components/PlanVisualizer";
import { getRelativeTime, displayDate } from "@/lib/utils/date";
import CommentSection from "./CommentSection";
import PostSidebar from "./PostSidebar";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { Edit } from "lucide-react";
import { Button } from "@/components/ui/button";

type Post = {
  id: string;
  query_plan_xml: string;
  title: string;
  comment_markdown: string;
  owner_id: string | null;
  owner_name?: string;
  is_active: number | boolean;
  is_public: number | boolean;
  created_at: string;
  updated_at: string;
};

interface Props {
  post: Post;
}

export default function QpPost({ post }: Props) {
  const { data: session } = useSession();
  const isOwner = session?.user?.id === post.owner_id;

  return (
    <div className="container py-10 px-4 max-w-7xl mx-auto">
      <div className="flex flex-col gap-8">
        {/* Header Section */}
        <div className="bg-white p-6 rounded-xl shadow-sm border-2 border-[#000080]/30 relative overflow-hidden">
          <div className="flex justify-between items-start mb-3">
            <h1 className="text-3xl font-extrabold text-[#000080]">
              {post.title}
            </h1>
            {isOwner && (
              <Link href={`/qpposts/${post.id}/edit`}>
                <Button
                  variant="outline"
                  size="sm"
                  className="border-2 border-[#000080] text-[#000080] hover:bg-[#000080] hover:text-white font-bold gap-2 shadow-sm transition-all"
                >
                  <Edit size={16} />
                  編集する
                </Button>
              </Link>
            )}
          </div>
          <div className="flex items-center gap-4 text-sm text-slate-500 font-medium">
            <span className="bg-blue-50 text-[#000080] px-3 py-1 rounded-full border border-[#000080]/20">
              投稿者: {post.owner_name || "ゲスト"}
            </span>
            <span>•</span>
            <span className="text-[#000080]/70">
              登録日: {getRelativeTime(post.created_at)}
              {post.updated_at &&
                post.updated_at !== post.created_at &&
                ` (update: ${displayDate(post.updated_at)})`}
            </span>
          </div>
        </div>

        {/* Visualizer Section */}
        <div className="bg-white p-2 rounded-xl shadow-md border-2 border-[#000080]/30">
          <PlanVisualizer xmlData={post.query_plan_xml} />
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-8">
            {/* Description Section */}
            <section className="bg-white p-8 rounded-xl shadow-sm border-2 border-[#000080]/30">
              <h2 className="text-xl font-bold text-[#000080] mb-6 flex items-center gap-2">
                <span className="w-1.5 h-6 bg-[#000080] rounded-full"></span>
                プランの説明
              </h2>
              <div className="prose prose-slate max-w-none text-slate-700 leading-relaxed bg-slate-50/50 p-4 rounded-lg border border-slate-100">
                {post.comment_markdown || "説明はありません。"}
              </div>
            </section>

            {/* Comments Section */}
            <section className="bg-white p-8 rounded-xl shadow-sm border-2 border-[#000080]/30">
              <h2 className="text-xl font-bold text-[#000080] mb-6 flex items-center gap-2">
                <span className="w-1.5 h-6 bg-[#000080] rounded-full"></span>
                コメント
              </h2>

              <CommentSection postId={post.id} />
            </section>
          </div>

          {/* Sidebar Section */}
          <PostSidebar post={post} />
        </div>
      </div>
    </div>
  );
}
