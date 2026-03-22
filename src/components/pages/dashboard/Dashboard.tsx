"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import {
  AlertCircle,
  X,
  LayoutGrid,
  PlusCircle,
  HelpCircle,
  Settings,
} from "lucide-react";
import { PostCard, PostCardData } from "@/components/organisms/PostCard";
import {
  CommentCard,
  CommentCardData,
} from "@/components/organisms/CommentCard";
import { UnlistedGuideDrawer } from "@/components/organisms/UnlistedGuideDrawer";
import { HelpModal } from "@/components/organisms/HelpModal";
import { DASHBOARD_MENU_ITEMS } from "@/constants/menu_dashboard";

interface Props {
  posts: PostCardData[];
  recentComments: CommentCardData[];
}

const iconMap: Record<string, any> = {
  LayoutGrid,
  PlusCircle,
  HelpCircle,
  Settings,
};

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
      <section className="flex flex-col lg:flex-row items-center justify-between gap-8 py-10 px-10 border-4 border-[#000080]/20 bg-white rounded-2xl shadow-xl mb-12 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-2 bg-[#000080]"></div>
        <div className="text-left flex-1 min-w-0">
          <h1 className="text-4xl font-black tracking-tighter lg:text-5xl mb-3 text-[#000080] uppercase">
            Query Plan Share
          </h1>
          <p className="text-base text-slate-500 max-w-2xl font-bold leading-relaxed">
            実行プランを共有、可視化して、クエリのチューニングを加速させましょう。
          </p>
        </div>
        <div className="flex flex-col gap-3 shrink-0 w-full lg:w-64">
          <Link href="/qpposts/new" className="w-full">
            <button className="bg-[#000080] text-white hover:bg-[#0000a0] font-black px-8 py-4 text-base rounded-md shadow-lg transition-transform hover:scale-105 w-full">
              POST A PLAN
            </button>
          </Link>
          <Link href="/qpposts" className="w-full">
            <button className="bg-transparent border-2 border-[#000080] text-[#000080] hover:bg-[#000080]/5 font-black px-8 py-4 text-base rounded-md shadow-lg transition-transform hover:scale-105 w-full">
              BROWSE GALLERY
            </button>
          </Link>
          <div className="pt-2 flex justify-center lg:justify-end">
            <UnlistedGuideDrawer />
          </div>
        </div>
      </section>

      {/* Quick Access Menu Bar */}
      <section className="bg-white border-2 border-[#000080]/10 rounded-xl shadow-sm overflow-hidden flex divide-x-2 divide-slate-100">
        {DASHBOARD_MENU_ITEMS.map((item, index) => {
          const Icon = iconMap[item.iconName];
          const content = (
            <div className="flex-1 flex items-center gap-3 p-4 hover:bg-[#000080]/5 transition-all group min-w-0 cursor-pointer">
              <div
                className={`shrink-0 w-8 h-8 ${item.color} text-white rounded flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform`}
              >
                {Icon && <Icon size={16} />}
              </div>
              <div className="min-w-0 overflow-hidden">
                <h3 className="font-black text-[#000080] text-sm uppercase tracking-tight truncate">
                  {item.title}
                </h3>
                <p className="text-[10px] text-slate-500 font-bold leading-none truncate">
                  {item.description}
                </p>
              </div>
            </div>
          );

          if (item.isModal && item.title === "ヘルプセンター") {
            return <HelpModal key={index}>{content}</HelpModal>;
          }
          return (
            <Link key={index} href={item.href || "#"} className="flex-1 flex">
              {content}
            </Link>
          );
        })}
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
