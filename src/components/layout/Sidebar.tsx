"use client";

import Link from "next/link";
import {
  LayoutDashboard,
  List,
  MessageSquare,
  PlusCircle,
  Settings,
} from "lucide-react";
import { useSidebar } from "./SidebarProvider";

export default function Sidebar() {
  const { isOpen, close } = useSidebar();

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={close}
        />
      )}
      <aside
        className={`
          fixed inset-y-0 left-0 z-50 w-64 border-r-4 border-[#4d4db2] bg-white flex flex-col h-full transition-transform duration-300 transform
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0 lg:sticky lg:top-16 lg:h-[calc(100vh-4rem)] lg:z-30 lg:inset-y-auto
        `}
      >
        <nav className="flex-1 py-6 px-4 space-y-2">
          <Link
            href="/dashboard"
            className="flex items-center gap-3 px-4 py-3 text-[#4d4db2] font-bold rounded-lg hover:bg-blue-50 border-2 border-transparent hover:border-[#4d4db2]/30 transition-all"
            onClick={close}
          >
            <LayoutDashboard size={20} />
            <span>ダッシュボード</span>
          </Link>
          <Link
            href="/qpposts"
            className="flex items-center gap-3 px-4 py-3 text-[#4d4db2] font-bold rounded-lg hover:bg-blue-50 border-2 border-transparent hover:border-[#4d4db2]/30 transition-all"
            onClick={close}
          >
            <List size={20} />
            <span>プラン一覧</span>
          </Link>
          <Link
            href="/comments"
            className="flex items-center gap-3 px-4 py-3 text-[#4d4db2] font-bold rounded-lg hover:bg-blue-50 border-2 border-transparent hover:border-[#4d4db2]/30 transition-all"
            onClick={close}
          >
            <MessageSquare size={20} />
            <span>コメント一覧</span>
          </Link>
          <div className="pt-6 border-t border-slate-100 my-4">
            <Link
              href="/qpposts/new"
              className="flex items-center gap-3 px-4 py-3 bg-[#4d4db2] text-white font-bold rounded-lg hover:bg-[#6666cc] shadow-md transition-all"
              onClick={close}
            >
              <PlusCircle size={20} />
              <span>新規投稿</span>
            </Link>
          </div>
        </nav>
        <div className="p-4 border-t-2 border-[#4d4db2]/10">
          <Link
            href="/setting"
            className="flex items-center gap-3 px-4 py-3 text-slate-500 font-bold rounded-lg hover:bg-slate-50 transition-all"
            onClick={close}
          >
            <Settings size={20} />
            <span>設定</span>
          </Link>
        </div>
      </aside>
    </>
  );
}
