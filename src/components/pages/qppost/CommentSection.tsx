"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import CommentList from "./CommentList";

interface Props {
  postId: string;
}

export default function CommentSection({ postId }: Props) {
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

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
        // Trigger CommentList to refresh by changing the key
        setRefreshKey((prev) => prev + 1);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <CommentList key={refreshKey} postId={postId} />

      <form
        onSubmit={handleSubmit}
        className="space-y-4 pt-6 border-t border-slate-100"
      >
        <Textarea
          placeholder="コメントを入力してください..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          rows={3}
          className="border-2 focus:border-[#000080] focus:ring-0 transition-all rounded-lg"
        />
        <div className="flex justify-end">
          <Button
            type="submit"
            disabled={isSubmitting || !comment.trim()}
            className="bg-[#000080] hover:bg-[#0000a0] text-white font-bold px-8 shadow-md"
          >
            {isSubmitting ? "送信中..." : "コメントを投稿"}
          </Button>
        </div>
      </form>
    </div>
  );
}
