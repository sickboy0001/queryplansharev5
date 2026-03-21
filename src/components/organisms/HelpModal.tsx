"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { HelpCircle, BookOpen, Loader2 } from "lucide-react";
import ReactMarkdown from "react-markdown";

// 表示名とファイル名のマッピング
const HELP_FILES = [
  { slug: "00_index", label: "トップ" },
  { slug: "01_quickstart", label: "クイックスタート" },
  { slug: "02_privacy", label: "公開制限" },
  { slug: "03_guest_limits", label: "ゲストの制限" },
  { slug: "04_security", label: "セキュリティ" },
  { slug: "05_markdown", label: "Markdown" },
];

export function HelpModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [currentSlug, setCurrentSlug] = useState<string>("00_index");
  const [cache, setCache] = useState<Record<string, string>>({});
  const [isPreloading, setIsPreloading] = useState(false);

  const preloadAllContent = useCallback(async () => {
    if (Object.keys(cache).length === HELP_FILES.length) return;

    setIsPreloading(true);
    try {
      const results = await Promise.all(
        HELP_FILES.map(async (file) => {
          const res = await fetch(`/api/help/${encodeURIComponent(file.slug)}`);
          if (res.ok) {
            const data = await res.json();
            return { slug: file.slug, content: data.content };
          }
          return null;
        }),
      );

      const newCache: Record<string, string> = {};
      results.forEach((item) => {
        if (item) newCache[item.slug] = item.content;
      });

      setCache(newCache);
    } catch (error) {
      console.error("Failed to preload help content", error);
    } finally {
      setIsPreloading(false);
    }
  }, [cache]);

  useEffect(() => {
    if (isOpen) {
      preloadAllContent();
    }
  }, [isOpen, preloadAllContent]);

  const currentContent = cache[currentSlug] || "";

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="gap-2 text-slate-400 hover:text-[#000080]"
        >
          <HelpCircle size={16} />
          ヘルプ
        </Button>
      </DialogTrigger>

      <DialogContent
        className="max-w-[1000px] w-[95vw] max-h-[85vh] h-full flex flex-col p-0 overflow-hidden border-none shadow-2xl bg-white fixed"
        onPointerDownOutside={(e) => e.preventDefault()}
      >
        <DialogHeader className="p-6 border-b border-slate-100 shrink-0 bg-white">
          <DialogTitle className="text-xl font-black text-[#000080] uppercase flex items-center gap-2">
            <BookOpen className="text-[#000080]" />
            Help & Documentation
          </DialogTitle>
          <nav className="flex flex-wrap gap-2 overflow-x-auto mt-4 pb-1 scrollbar-hide">
            {HELP_FILES.map((file) => (
              <button
                key={file.slug}
                onClick={() => setCurrentSlug(file.slug)}
                className={`px-3 py-1.5 rounded-full text-xs font-bold transition-colors whitespace-nowrap border ${
                  file.slug === currentSlug
                    ? "bg-[#000080] border-[#000080] text-white shadow-md scale-105"
                    : "bg-slate-50 border-slate-200 text-slate-500 hover:border-[#000080]/30 hover:text-[#000080]"
                }`}
              >
                {file.label}
              </button>
            ))}
          </nav>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto bg-slate-50 min-h-0">
          <div className="p-6 md:p-10 bg-white mx-auto max-w-4xl min-h-full">
            {!currentContent && isPreloading ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="w-8 h-8 text-[#000080] animate-spin" />
              </div>
            ) : (
              <article className="prose prose-slate prose-blue max-w-none prose-headings:text-[#000080] prose-headings:font-black">
                <ReactMarkdown>{currentContent}</ReactMarkdown>
              </article>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
