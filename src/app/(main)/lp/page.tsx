"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  ShieldCheck,
  Share2,
  Eye,
  MessageSquare,
  Zap,
  BarChart3,
  Globe,
  Lock,
  Clock,
} from "lucide-react";
import { UnlistedGuideDrawer } from "@/components/organisms/UnlistedGuideDrawer";

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-white text-slate-900">
      {/* Hero Section */}
      <section className="relative pt-20 pb-32 overflow-hidden border-b-8 border-[#000080]">
        <div className="container px-4 mx-auto relative z-10 text-center">
          <h1 className="text-6xl md:text-8xl font-black tracking-tighter text-[#000080] uppercase mb-6 animate-in fade-in slide-in-from-top-8 duration-700">
            Query Plan Share
          </h1>
          <p className="text-xl md:text-2xl text-slate-500 max-w-3xl mx-auto font-bold leading-relaxed mb-12 animate-in fade-in slide-in-from-top-12 duration-1000">
            実行プランを共有、可視化して、
            <br className="md:hidden" />
            クエリのチューニングを加速させましょう。
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-6 mb-12">
            <Link href="/qpposts/new">
              <Button
                size="lg"
                className="bg-[#000080] text-white hover:bg-[#0000a0] font-black px-12 py-8 text-xl rounded-md shadow-2xl transition-all hover:scale-105"
              >
                POST A PLAN
              </Button>
            </Link>
            <Link href="/qpposts">
              <Button
                size="lg"
                variant="outline"
                className="bg-transparent border-4 border-[#000080] text-[#000080] hover:bg-[#000080]/5 font-black px-12 py-8 text-xl rounded-md shadow-2xl transition-all hover:scale-105"
              >
                BROWSE GALLERY
              </Button>
            </Link>
          </div>

          <div className="animate-in fade-in zoom-in duration-1000 delay-500">
            <UnlistedGuideDrawer />
          </div>
        </div>

        {/* Background Decoration */}
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-5 overflow-hidden">
          <div className="absolute top-[-10%] left-[-5%] w-[40%] h-[60%] border-[40px] border-[#000080] rounded-full" />
          <div className="absolute bottom-[-10%] right-[-5%] w-[30%] h-[50%] border-[20px] border-[#000080] rounded-full" />
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-slate-50">
        <div className="container px-4 mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl font-black text-[#000080] uppercase tracking-tight mb-4">
              Powerful Tools for Database Pros
            </h2>
            <div className="w-24 h-2 bg-[#000080] mx-auto" />
          </div>

          <div className="grid md:grid-cols-3 gap-12">
            {/* Feature 1: Visualize */}
            <div className="bg-white p-10 rounded-3xl shadow-xl border-2 border-[#000080]/5 hover:border-[#000080]/20 transition-all group">
              <div className="w-16 h-16 bg-[#000080]/10 rounded-2xl flex items-center justify-center text-[#000080] mb-8 group-hover:bg-[#000080] group-hover:text-white transition-all">
                <BarChart3 size={32} />
              </div>
              <h3 className="text-2xl font-black text-slate-900 mb-4 uppercase">
                可視化
              </h3>
              <p className="text-slate-500 font-bold leading-relaxed">
                複雑なSQL実行プランを直感的なツリー形式で表示。ボトルネックが一目で分かります。
              </p>
            </div>

            {/* Feature 2: Sharing */}
            <div className="bg-white p-10 rounded-3xl shadow-xl border-2 border-[#000080]/5 hover:border-[#000080]/20 transition-all group">
              <div className="w-16 h-16 bg-[#000080]/10 rounded-2xl flex items-center justify-center text-[#000080] mb-8 group-hover:bg-[#000080] group-hover:text-white transition-all">
                <Share2 size={32} />
              </div>
              <h3 className="text-2xl font-black text-slate-900 mb-4 uppercase">
                共有
              </h3>
              <p className="text-slate-500 font-bold leading-relaxed">
                URL一つでプランをチームやコミュニティに共有。デバッグ作業を劇的に効率化します。
              </p>
            </div>

            {/* Feature 3: Unlisted */}
            <div className="bg-white p-10 rounded-3xl shadow-xl border-2 border-[#000080]/5 hover:border-[#000080]/20 transition-all group">
              <div className="w-16 h-16 bg-[#000080]/10 rounded-2xl flex items-center justify-center text-[#000080] mb-8 group-hover:bg-[#000080] group-hover:text-white transition-all">
                <ShieldCheck size={32} />
              </div>
              <h3 className="text-2xl font-black text-slate-900 mb-4 uppercase">
                限定公開
              </h3>
              <p className="text-slate-500 font-bold leading-relaxed">
                時限式のURL発行機能。特定の相手にだけ期間限定で安全にプランを見せることができます。
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Control Section */}
      <section className="py-24 bg-white">
        <div className="container px-4 mx-auto">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <div className="lg:w-1/2">
              <h2 className="text-4xl md:text-5xl font-black text-[#000080] uppercase leading-tight mb-8">
                Granular Privacy Control
              </h2>
              <div className="space-y-6">
                <div className="flex gap-6 items-start">
                  <div className="shrink-0 w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center text-[#000080]">
                    <Globe size={24} />
                  </div>
                  <div>
                    <h4 className="text-xl font-black text-slate-900 mb-1">
                      全体公開
                    </h4>
                    <p className="text-slate-500 font-medium">
                      ギャラリーに掲載され、誰でも検索して学習リソースとして活用できます。
                    </p>
                  </div>
                </div>
                <div className="flex gap-6 items-start">
                  <div className="shrink-0 w-12 h-12 bg-amber-50 rounded-full flex items-center justify-center text-amber-600">
                    <Zap size={24} />
                  </div>
                  <div>
                    <h4 className="text-xl font-black text-slate-900 mb-1">
                      限定公開（Unlisted）
                    </h4>
                    <p className="text-slate-500 font-medium">
                      発行された専用URLを持つ人のみ閲覧可能。有効期限による自動アクセス停止機能付き。
                    </p>
                  </div>
                </div>
                <div className="flex gap-6 items-start">
                  <div className="shrink-0 w-12 h-12 bg-red-50 rounded-full flex items-center justify-center text-red-600">
                    <Lock size={24} />
                  </div>
                  <div>
                    <h4 className="text-xl font-black text-slate-900 mb-1">
                      完全非公開
                    </h4>
                    <p className="text-slate-500 font-medium">
                      自分専用のプライベート・アーカイブ。管理者以外は一切アクセスできません。
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="lg:w-1/2 w-full">
              <div className="relative p-4 md:p-8 bg-slate-900 rounded-[2rem] shadow-2xl">
                <div className="absolute -top-4 -left-4 w-24 h-24 bg-[#000080] rounded-full z-0 opacity-20" />
                <div className="relative z-10 space-y-4">
                  <div className="flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500" />
                    <div className="w-3 h-3 rounded-full bg-amber-500" />
                    <div className="w-3 h-3 rounded-full bg-green-500" />
                  </div>
                  <div className="p-4 bg-slate-800 rounded-xl border border-slate-700">
                    <div className="h-4 w-3/4 bg-slate-700 rounded mb-4" />
                    <div className="h-20 w-full bg-slate-700/50 rounded mb-4" />
                    <div className="flex justify-between">
                      <div className="h-8 w-24 bg-[#000080] rounded" />
                      <div className="h-8 w-16 bg-slate-600 rounded" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-[#000080] text-white">
        <div className="container px-4 mx-auto text-center">
          <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter mb-8">
            Start Optimizing Today
          </h2>
          <p className="text-xl text-white/80 max-w-2xl mx-auto font-bold leading-relaxed mb-12">
            すべての機能が無料で利用可能です。SQL Server
            実行プランの共有と分析をもっと身近に。
          </p>
          <div className="flex flex-wrap justify-center gap-6">
            <Link href="/auth/signup">
              <Button
                size="lg"
                className="bg-white text-[#000080] hover:bg-slate-100 font-black px-12 py-8 text-xl rounded-md shadow-2xl"
              >
                SIGN UP NOW
              </Button>
            </Link>
            <Link href="/qpposts">
              <Button
                size="lg"
                variant="ghost"
                className="text-white hover:bg-white/10 font-black px-12 py-8 text-xl rounded-md"
              >
                BROWSE PLANS
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-slate-900 text-white/40 text-center font-bold text-sm uppercase tracking-widest border-t border-white/5">
        <div className="container mx-auto px-4">
          <p>&copy; 2026 Query Plan Share. Empowering database communities.</p>
        </div>
      </footer>
    </div>
  );
}
