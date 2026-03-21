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
import { Badge } from "@/components/ui/badge";
import { UserTooltip } from "@/components/organisms/UserTooltip";

export type PostCardData = {
  id: string;
  title: string;
  comment_markdown: string;
  owner_id?: string;
  owner_name?: string;
  updated_at: string;
  is_active?: number;
  is_public?: number;
};

interface PostCardProps {
  post: PostCardData;
  currentUserId?: string;
  isAdmin?: boolean;
}

export function PostCard({ post, currentUserId, isAdmin }: PostCardProps) {
  const stripMarkdown = (text: string) => {
    return text
      .replace(/[#*`~_]/g, "")
      .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
      .replace(/\n/g, " ")
      .trim();
  };

  const isOwner = currentUserId === post.owner_id;
  const canEdit = isOwner || isAdmin;

  return (
    <Card
      className={`flex flex-col border-2 transition-all bg-white shadow-sm hover:shadow-xl group overflow-hidden ${post.is_active === 0 ? "opacity-75 border-dashed border-slate-300" : "border-[#000080]/20 hover:border-[#000080]/50"}`}
    >
      <CardHeader className="bg-slate-50 border-b border-[#000080]/10 group-hover:bg-[#000080]/5 transition-colors">
        <div className="flex justify-between items-start gap-2">
          <CardTitle className="line-clamp-1 text-[#000080] text-lg font-bold">
            {post.title}
          </CardTitle>
          <div className="flex flex-col gap-1 items-end">
            {post.is_active === 0 && (
              <Badge variant="destructive" className="text-[8px] h-4 px-1">
                INACTIVE
              </Badge>
            )}
            {post.is_public === 0 && (
              <Badge
                variant="outline"
                className="text-[8px] h-4 px-1 border-slate-400 text-slate-500"
              >
                PRIVATE
              </Badge>
            )}
            {post.is_public === 1 && (
              <Badge
                variant="outline"
                className="text-[8px] h-4 px-1 border-amber-400 text-amber-600"
              >
                UNLISTED
              </Badge>
            )}
          </div>
        </div>
        <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest flex items-center gap-2">
          <span className="text-[#000080]/60 flex items-center gap-1">
            BY{" "}
            {post.owner_id ? (
              <UserTooltip
                userId={post.owner_id}
                name={post.owner_name || "GUEST"}
              />
            ) : (
              post.owner_name || "GUEST"
            )}
          </span>
          <span>•</span>
          <span>{getRelativeTime(post.updated_at)}</span>
        </div>
      </CardHeader>
      <CardContent className="flex-1 p-6">
        <p className="text-sm text-slate-600 line-clamp-3 leading-relaxed italic">
          {post.comment_markdown
            ? stripMarkdown(post.comment_markdown)
            : "No description provided."}
        </p>
      </CardContent>
      <CardFooter className="p-6 pt-0 flex gap-2">
        <Link
          href={`/qpposts/${post.id}`}
          className={canEdit ? "flex-1" : "w-full"}
        >
          <Button
            variant="outline"
            className="w-full border-2 border-[#000080] text-[#000080] hover:bg-[#000080] hover:text-white font-bold transition-all h-10 shadow-sm"
          >
            VIEW PLAN
          </Button>
        </Link>
        {canEdit && (
          <Link href={`/qpposts/${post.id}/edit`} className="flex-1">
            <Button className="w-full bg-[#000080] hover:bg-[#0000a0] text-white font-bold transition-all h-10 shadow-sm border-2 border-[#000080]">
              EDIT PLAN
            </Button>
          </Link>
        )}
      </CardFooter>
    </Card>
  );
}
