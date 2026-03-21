"use client";

import Link from "next/link";
import { getRelativeTime } from "@/lib/utils/date";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { UserTooltip } from "@/components/organisms/UserTooltip";

export type CommentCardData = {
  id: string;
  post_id: string;
  post_title: string;
  comment_markdown: string;
  owner_id?: string | null;
  owner_name?: string | null;
  created_at: string;
};

interface CommentCardProps {
  comment: CommentCardData;
  showPostTitle?: boolean;
}

export function CommentCard({
  comment,
  showPostTitle = true,
}: CommentCardProps) {
  return (
    <Link href={`/qpposts/${comment.post_id}`} className="block group">
      <Card className="border-2 border-[#000080]/10 hover:border-[#000080]/40 transition-all bg-white shadow-sm hover:shadow-lg overflow-hidden group">
        {showPostTitle && (
          <CardHeader className="p-4 pb-2 bg-slate-50 border-b border-slate-100 group-hover:bg-[#000080]/5 transition-colors">
            <div className="text-[10px] font-bold text-[#000080]/60 uppercase tracking-widest truncate">
              RE: {comment.post_title}
            </div>
          </CardHeader>
        )}
        <CardContent className="p-4 pt-3">
          <p className="text-sm text-slate-700 line-clamp-2 italic leading-relaxed mb-3">
            "{comment.comment_markdown}"
          </p>
          <div className="flex items-center justify-between text-[10px] text-slate-400 font-bold uppercase tracking-widest">
            <span className="text-[#000080] flex items-center gap-1">
              {comment.owner_id ? (
                <UserTooltip
                  userId={comment.owner_id}
                  name={comment.owner_name || "不明"}
                />
              ) : (
                comment.owner_name || "GUEST"
              )}
            </span>
            <span>{getRelativeTime(comment.created_at)}</span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
