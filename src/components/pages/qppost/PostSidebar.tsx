"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { getRelativeTime, displayDate } from "@/lib/utils/date";
import { UserTooltip } from "@/components/organisms/UserTooltip";

type Post = {
  id: string;
  is_active: number | boolean;
  is_public: number;
  created_at: string;
  updated_at: string;
  owner_id: string | null;
  owner_name?: string | null;
};

interface Props {
  post: Post;
}

export default function PostSidebar({ post }: Props) {
  const getPublicStatusLabel = (status: number | boolean) => {
    const s = Number(status);
    if (s === 2) return "公開";
    if (s === 1) return "限定公開";
    return "非公開";
  };

  return (
    <div className="space-y-6">
      <Card className="border-2 border-[#000080]/30 shadow-md overflow-hidden">
        <CardHeader className="bg-[#000080] text-white py-4">
          <CardTitle className="text-sm font-bold uppercase tracking-wider text-center">
            プラン情報
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-4 bg-white text-slate-800">
          {post.owner_id && (
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <span className="text-xs font-bold text-slate-400 uppercase">
                投稿者
              </span>
              <UserTooltip
                userId={post.owner_id}
                name={post.owner_name || "不明なユーザー"}
              />
            </div>
          )}
          <div className="flex justify-between items-center border-b border-slate-100 pb-3">
            <span className="text-xs font-bold text-slate-400 uppercase">
              ステータス
            </span>
            <span
              className={`text-xs font-bold px-2 py-1 rounded border ${post.is_active ? "bg-green-50 text-green-700 border-green-200" : "bg-slate-50 text-slate-700 border-slate-200"}`}
            >
              {post.is_active ? "アクティブ" : "アーカイブ"}
            </span>
          </div>
          <div className="flex justify-between items-center border-b border-slate-100 pb-3">
            <span className="text-xs font-bold text-slate-400 uppercase">
              公開設定
            </span>
            <span className="text-xs font-bold text-[#000080]">
              {getPublicStatusLabel(post.is_public)}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-xs font-bold text-slate-400 uppercase">
              登録日
            </span>
            <div className="text-right">
              <div className="text-xs font-bold text-slate-700">
                {getRelativeTime(post.created_at)}
              </div>
              {post.updated_at && post.updated_at !== post.created_at && (
                <div className="text-[10px] text-slate-400 mt-1">
                  (update: {displayDate(post.updated_at)})
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
