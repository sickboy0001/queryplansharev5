"use client";

import { useState } from "react";
import { getRelativeTime } from "@/lib/utils/date";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useRouter } from "next/navigation";

type Comment = {
  id: string;
  comment_markdown: string;
  owner_id: string | null;
  owner_name: string | null;
  created_at: string;
};

interface Props {
  postId: string;
  initialComments: Comment[];
}

export default function PostClient({ postId, initialComments }: Props) {
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) return;

    setIsSubmitting(true);
    try {
      const res = await fetch(`/api/posts/${postId}/comments`, {
        method: "POST",
        body: JSON.stringify({ commentMarkdown: comment }),
      });

      if (res.ok) {
        setComment("");
        router.refresh();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        {initialComments.map((c) => (
          <div
            key={c.id}
            className="border-2 border-[#4d4db2]/20 rounded-lg p-4 bg-white shadow-sm hover:border-[#4d4db2]/50 transition-colors"
          >
            <div className="flex justify-between items-center mb-2">
              <span className="font-bold text-[#4d4db2] text-sm">
                {c.owner_name || "ゲスト"}
              </span>
              <span className="text-[10px] font-medium text-slate-400 uppercase tracking-wider">
                {getRelativeTime(c.created_at)}
              </span>
            </div>
            <div className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">
              {c.comment_markdown}
            </div>
          </div>
        ))}
        {initialComments.length === 0 && (
          <div className="text-center py-12 text-slate-400 border-2 border-dashed border-[#4d4db2]/20 rounded-lg bg-slate-50/50">
            まだコメントはありません。
          </div>
        )}
      </div>

      <form
        onSubmit={handleSubmit}
        className="space-y-4 pt-6 border-t border-slate-100"
      >
        <Textarea
          placeholder="コメントを入力してください..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          rows={3}
          className="border-2 focus:border-[#4d4db2] focus:ring-0 transition-all rounded-lg"
        />
        <div className="flex justify-end">
          <Button
            type="submit"
            disabled={isSubmitting || !comment.trim()}
            className="bg-[#4d4db2] hover:bg-[#6666cc] text-white font-bold px-8 shadow-md"
          >
            {isSubmitting ? "送信中..." : "コメントを投稿"}
          </Button>
        </div>
      </form>
    </div>
  );
}
