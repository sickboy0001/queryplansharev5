"use client";

import Link from "next/link";
import { getRelativeTime } from "@/lib/utils/date";
import { Card, CardHeader, CardContent } from "@/components/ui/card";

type Comment = {
  id: string;
  post_id: string;
  post_title: string;
  comment_markdown: string;
  owner_name?: string;
  created_at: string;
};

interface Props {
  comments: Comment[];
}

export default function Comments({ comments }: Props) {
  return (
    <div className="container py-8 px-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-8 border-b-4 border-[#000080] pb-4">
        <h1 className="text-3xl font-black text-[#000080] uppercase tracking-tighter">
          Community Feedback
        </h1>
      </div>

      <div className="grid gap-6">
        {comments.map((comment) => (
          <Link
            key={comment.id}
            href={`/qpposts/${comment.post_id}`}
            className="block group"
          >
            <Card className="border-2 border-[#000080]/20 hover:border-[#000080]/50 transition-all bg-white shadow-sm hover:shadow-xl overflow-hidden">
              <CardHeader className="bg-slate-50 py-4 px-6 border-b border-[#000080]/10 group-hover:bg-[#000080]/5 transition-colors">
                <div className="text-[10px] font-bold text-[#000080]/60 uppercase tracking-[0.2em]">
                  Target Plan: {comment.post_title}
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <p className="text-slate-700 mb-6 leading-relaxed font-medium italic text-lg">
                  "{comment.comment_markdown}"
                </p>
                <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-widest border-t border-slate-50 pt-4">
                  <span className="text-[#000080]">
                    By {comment.owner_name || "GUEST"}
                  </span>
                  <span className="text-slate-400">
                    {getRelativeTime(comment.created_at)}
                  </span>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}

        {comments.length === 0 && (
          <div className="py-32 text-center text-slate-300 border-4 border-dashed border-slate-100 rounded-2xl bg-white/50">
            <p className="text-xl font-bold uppercase tracking-widest">
              No comments found.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
