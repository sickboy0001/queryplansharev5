"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { displayDate, getRelativeTime } from "@/lib/utils/date";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Edit2, Trash2, X, Check } from "lucide-react";
import { UserTooltip } from "@/components/organisms/UserTooltip";

type Comment = {
  id: string;
  comment_markdown: string;
  owner_id: string | null;
  owner_name: string | null;
  created_at: string;
  updated_at: string;
};

interface Props {
  postId: string;
}

export default function CommentList({ postId }: Props) {
  const { data: session } = useSession();
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");

  const fetchComments = async () => {
    try {
      const res = await fetch(`/api/posts/${postId}/comments`);
      if (res.ok) {
        const data = await res.json();
        setComments(data);
      }
    } catch (err) {
      console.error("Failed to fetch comments", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [postId]);

  const handleDelete = async (id: string) => {
    if (!confirm("コメントを削除しますか？")) return;
    try {
      const res = await fetch(`/api/comments/${id}`, { method: "DELETE" });
      if (res.ok) {
        setComments(comments.filter((c) => c.id !== id));
      }
    } catch (err) {
      console.error("Failed to delete comment", err);
    }
  };

  const handleEdit = (comment: Comment) => {
    setEditingId(comment.id);
    setEditValue(comment.comment_markdown);
  };

  const handleUpdate = async (id: string) => {
    try {
      const res = await fetch(`/api/comments/${id}`, {
        method: "PUT",
        body: JSON.stringify({ commentMarkdown: editValue }),
      });
      if (res.ok) {
        setComments(
          comments.map((c) =>
            c.id === id ? { ...c, comment_markdown: editValue } : c,
          ),
        );
        setEditingId(null);
      }
    } catch (err) {
      console.error("Failed to update comment", err);
    }
  };

  if (isLoading) {
    return <div className="text-center py-4 text-slate-400">読み込み中...</div>;
  }

  return (
    <div className="space-y-4">
      {comments.map((c) => {
        const isOwner = session?.user?.id === c.owner_id;
        const isEditing = editingId === c.id;

        return (
          <div
            key={c.id}
            className="border-2 border-[#000080]/10 rounded-lg p-4 bg-white shadow-sm hover:border-[#000080]/30 transition-colors"
          >
            <div className="flex justify-between items-center mb-2">
              <div className="flex items-center gap-2">
                {c.owner_id ? (
                  <UserTooltip
                    userId={c.owner_id}
                    name={c.owner_name || "不明"}
                  />
                ) : (
                  <span className="font-bold text-[#000080] text-sm">
                    {c.owner_name || "ゲスト"}
                  </span>
                )}
                {isOwner && (
                  <span className="text-[10px] bg-[#000080] text-white px-1.5 py-0.5 rounded uppercase font-bold">
                    You
                  </span>
                )}
              </div>
              <div className="flex items-center gap-3">
                <span className="text-[10px] font-medium text-slate-400 uppercase tracking-wider">
                  {getRelativeTime(c.created_at)}
                  {c.updated_at &&
                    c.updated_at !== c.created_at &&
                    ` (update: ${displayDate(c.updated_at)})`}
                </span>
                {isOwner && !isEditing && (
                  <div className="flex gap-1">
                    <button
                      onClick={() => handleEdit(c)}
                      className="p-1 hover:bg-slate-100 rounded text-slate-400 hover:text-[#000080] transition-colors"
                    >
                      <Edit2 size={14} />
                    </button>
                    <button
                      onClick={() => handleDelete(c.id)}
                      className="p-1 hover:bg-red-50 rounded text-slate-400 hover:text-red-600 transition-colors"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                )}
              </div>
            </div>

            {isEditing ? (
              <div className="space-y-2">
                <Textarea
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                  className="text-sm border-2 border-[#000080] focus:ring-0"
                  rows={3}
                />
                <div className="flex justify-end gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setEditingId(null)}
                    className="h-8 px-3 border-2"
                  >
                    <X size={14} className="mr-1" /> キャンセル
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => handleUpdate(c.id)}
                    className="h-8 px-3 bg-[#000080] hover:bg-[#0000a0] text-white"
                  >
                    <Check size={14} className="mr-1" /> 保存
                  </Button>
                </div>
              </div>
            ) : (
              <div className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">
                {c.comment_markdown}
              </div>
            )}
          </div>
        );
      })}

      {comments.length === 0 && (
        <div className="text-center py-12 text-slate-400 border-2 border-dashed border-[#000080]/10 rounded-lg bg-slate-50/50 italic">
          まだコメントはありません。
        </div>
      )}
    </div>
  );
}
