"use client";

import React from "react";
import {
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerClose,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Clock, ShieldCheck, RefreshCw, Copy, LucideIcon } from "lucide-react";
import {
  UNLISTED_GUIDE_CONTENT,
  UnlistedFeature,
} from "@/constants/unlisted-guide";

const ICON_MAP: Record<UnlistedFeature["icon"], LucideIcon> = {
  Clock: Clock,
  ShieldCheck: ShieldCheck,
  RefreshCw: RefreshCw,
  Copy: Copy,
};

export function UnlistedGuideContent() {
  const content = UNLISTED_GUIDE_CONTENT;

  return (
    <div className="mx-auto w-full max-w-2xl overflow-y-auto">
      <DrawerHeader className="border-b border-slate-100 pb-4">
        <DrawerTitle className="text-2xl font-black text-[#000080] uppercase tracking-tight flex items-center gap-2">
          <ShieldCheck className="text-[#000080]" />
          {content.title}
        </DrawerTitle>
        <DrawerDescription className="text-slate-500 font-bold">
          {content.description}
        </DrawerDescription>
      </DrawerHeader>

      <div className="p-6 space-y-8">
        {content.sections.map((section) => (
          <section key={section.id} className="space-y-3">
            <h3 className="font-black text-slate-800 flex items-center gap-2">
              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-[#000080] text-white text-xs">
                {section.id}
              </span>
              {section.heading}
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed pl-8">
              {section.body}
            </p>
          </section>
        ))}

        <section className="grid gap-4 md:grid-cols-2">
          {content.features.map((feature, i) => {
            const Icon = ICON_MAP[feature.icon];
            return (
              <div
                key={i}
                className="bg-slate-50 p-4 rounded-xl border border-slate-100"
              >
                <h4 className="font-bold text-[#000080] text-sm flex items-center gap-2 mb-2">
                  <Icon size={16} />
                  {feature.title}
                </h4>
                <p className="text-xs text-slate-500 leading-normal">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </section>

        <section className="space-y-3 bg-[#000080]/5 p-6 rounded-2xl border border-[#000080]/10">
          <h3 className="font-black text-[#000080] flex items-center gap-2 italic">
            HOW TO USE
          </h3>
          <ul className="space-y-4 text-sm">
            {content.steps.map((step, i) => (
              <li key={i} className="flex gap-4">
                <div className="font-mono font-bold text-[#000080]">
                  {step.label}
                </div>
                <div className="text-slate-700">{step.text}</div>
              </li>
            ))}
          </ul>
        </section>

        <div className="bg-amber-50 border border-amber-200 p-4 rounded-xl">
          <h4 className="text-amber-800 font-bold text-xs uppercase mb-1">
            注意点
          </h4>
          <p className="text-[11px] text-amber-700 leading-relaxed font-medium">
            {content.notice}
          </p>
        </div>
      </div>

      <DrawerFooter className="border-t border-slate-100 pt-4 flex flex-row justify-end gap-3">
        <DrawerClose asChild>
          <Button variant="ghost" className="font-bold text-slate-500">
            閉じる
          </Button>
        </DrawerClose>
      </DrawerFooter>
    </div>
  );
}
