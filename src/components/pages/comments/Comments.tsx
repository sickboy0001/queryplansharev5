"use client";

import Link from "next/link";
import {
  CommentCard,
  CommentCardData,
} from "@/components/organisms/CommentCard";

interface Props {
  comments: CommentCardData[];
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
          <CommentCard
            key={comment.id}
            comment={comment}
            showPostTitle={true}
          />
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
