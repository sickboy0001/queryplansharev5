import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  ShieldCheck,
  Share2,
  BarChart3,
  Globe,
  Lock,
  Zap,
  Database,
  Code2,
  ArrowRight,
  Sparkles,
  EyeOff,
} from "lucide-react";
import { UnlistedGuideDrawer } from "@/components/organisms/UnlistedGuideDrawer";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Query Plan Share | SQL Server 実行プラン共有・可視化サービス",
  description:
    "SQL Server の実行プランを美しく可視化し、チームで共有。ボトルネックの特定を加速させます。",
};

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-[#fafafa] text-slate-900 selection:bg-[#000080] selection:text-white overflow-x-hidden">
      {/* Hero Section */}
      <section className="relative pt-32 pb-40 overflow-hidden bg-[#000080]">
        <div className="container px-4 mx-auto relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-5 py-2 mb-8 text-xs font-black tracking-[0.3em] text-white uppercase bg-white/20 backdrop-blur-md rounded-full border border-white/30 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <Sparkles size={14} className="text-blue-200" />
            Empowering SQL Server Professionals
          </div>

          <h1 className="text-6xl md:text-[10rem] font-[950] tracking-[-0.04em] text-white uppercase leading-[0.85] mb-12 animate-in fade-in slide-in-from-top-8 duration-1000">
            Query Plan <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-100 via-white to-blue-100">
              Share
            </span>
          </h1>

          <p className="text-xl md:text-3xl text-white max-w-3xl mx-auto font-black leading-tight mb-16 animate-in fade-in slide-in-from-top-12 duration-1000 delay-200 drop-shadow-lg">
            実行プランの可視化と共有を、
            <br className="hidden md:block" />
            かつてないほどシンプルに、美しく。
          </p>

          <div className="flex flex-col sm:flex-row justify-center items-center gap-6 mb-32 group relative z-20">
            <Link href="/qpposts/new" className="w-full sm:w-auto">
              <Button
                size="lg"
                className="bg-white text-[#000080] hover:bg-blue-50 font-black px-10 py-10 text-2xl rounded-2xl shadow-[0_20px_40px_rgba(0,0,0,0.3)] transition-all hover:scale-105 active:scale-95 w-full border-b-[8px] border-slate-200"
              >
                POST A PLAN <ArrowRight className="ml-3 w-8 h-8" />
              </Button>
            </Link>
            <Link href="/qpposts" className="w-full sm:w-auto">
              <Button
                size="lg"
                variant="outline"
                className="bg-[#000080] border-4 border-white text-white hover:bg-white  font-black px-10 py-10 text-2xl rounded-2xl shadow-xl transition-all hover:scale-105 active:scale-95 w-full"
              >
                BROWSE GALLERY
              </Button>
            </Link>
          </div>

          <div className="animate-in fade-in zoom-in duration-1000 delay-500 max-w-xs mx-auto">
            <UnlistedGuideDrawer />
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section className="py-32">
        <div className="container px-4 mx-auto">
          <div className="text-center mb-24">
            <h2 className="text-sm font-black text-[#000080] uppercase tracking-[0.4em] mb-4">
              Workflow
            </h2>
            <h3 className="text-4xl md:text-5xl font-black text-slate-900 uppercase tracking-tighter">
              わずか3ステップで解決
            </h3>
          </div>

          <div className="grid md:grid-cols-3 gap-16 relative">
            {/* Connecting Line (Desktop) */}
            <div className="hidden md:block absolute top-1/2 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#000080]/10 to-transparent -translate-y-1/2 pointer-events-none" />

            {[
              {
                step: "1",
                icon: <Database size={48} />,
                title: "Export",
                desc: "SQL Serverから.sqlplanファイルを保存",
              },
              {
                step: "2",
                icon: <Code2 size={48} />,
                title: "Upload",
                desc: "ドラッグ&ドロップで瞬時にアップロード",
              },
              {
                step: "3",
                icon: <Share2 size={48} />,
                title: "Share",
                desc: "生成されたURLをチームへ即座に共有",
              },
            ].map((item, i) => (
              <div
                key={i}
                className="relative flex flex-col items-center text-center group"
              >
                <div className="w-24 h-24 bg-white rounded-[2rem] shadow-2xl flex items-center justify-center mb-8 border-2 border-[#000080]/5 group-hover:border-[#000080]/20 transition-all duration-500 group-hover:translate-y-[-10px]">
                  <div className="text-[#000080] transform group-hover:scale-110 transition-transform duration-500">
                    {item.icon}
                  </div>
                  <div className="absolute -top-4 -right-4 w-10 h-10 bg-[#000080] text-white rounded-full flex items-center justify-center font-black text-lg shadow-lg">
                    {item.step}
                  </div>
                </div>
                <h4 className="text-2xl font-black uppercase mb-4 tracking-tight text-slate-900">
                  {item.title}
                </h4>
                <p className="text-slate-500 font-bold max-w-[200px] leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-32 bg-white relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-[0.4] pointer-events-none">
          <div className="grid grid-cols-6 h-full">
            {[...Array(24)].map((_, i) => (
              <div key={i} className="border border-slate-100" />
            ))}
          </div>
        </div>

        <div className="container px-4 mx-auto relative z-10">
          <div className="flex flex-col md:flex-row items-end justify-between mb-20 gap-8">
            <div className="max-w-2xl">
              <h2 className="text-sm font-black text-blue-600 uppercase tracking-[0.4em] mb-4">
                Core Features
              </h2>
              <h3 className="text-4xl md:text-6xl font-[950] text-black uppercase tracking-tighter leading-none">
                {Array.from("強力な分析ツールを、").map((char, i) => (
                  <span key={i}>{char}</span>
                ))}
                <br />
                {Array.from("すべてのエンジニアに。").map((char, i) => (
                  <span key={i}>{char}</span>
                ))}
              </h3>
            </div>
            <div className="w-32 h-2 bg-blue-500 mb-2" />
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <BarChart3 size={32} />,
                title: "高度な可視化",
                desc: "複雑怪奇な実行プランを、直感的かつ美しいツリー形式で再構築。ボトルネックはもう逃しません。",
              },
              {
                icon: <Share2 size={32} />,
                title: "シームレスな共有",
                desc: "アカウント不要ですぐに発行。SlackやGitHubへ貼り付けるだけで、最高のデバッグ体験が始まります。",
              },
              {
                icon: <ShieldCheck size={32} />,
                title: "インテリジェント・プライバシー",
                desc: "機密プランも安心。時限式URLやアクセス制限により、必要な時に必要な人だけが閲覧可能です。",
              },
            ].map((feature, i) => (
              <div
                key={i}
                className="bg-slate-50 backdrop-blur-xl p-12 rounded-[2.5rem] border border-slate-200 hover:bg-slate-100 transition-all duration-500 group"
              >
                <div className="w-20 h-20 bg-blue-500/10 rounded-2xl flex items-center justify-center text-blue-600 mb-10 group-hover:bg-blue-600 group-hover:text-white transition-all duration-500 transform group-hover:rotate-[10deg]">
                  {feature.icon}
                </div>
                <h3 className="text-2xl font-black text-slate-900 mb-6 uppercase tracking-tight">
                  {feature.title}
                </h3>
                <p className="text-slate-600 font-bold leading-relaxed">
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Control Section */}
      <section>
        <div className="pb-32">
          <div className="container px-4 mx-auto relative z-20">
            <div className="flex flex-col md:flex-row items-start justify-between mb-16 border-b border-slate-200 pb-8 gap-8">
              <h3 className="text-2xl font-black text-[#000080] tracking-tight shrink-0">
                公開設定
              </h3>
              <p className="text-slate-500 font-bold max-w-xl text-sm leading-relaxed text-right">
                共有するプランの範囲は自由自在。全体に公開してコミュニティに貢献することも、特定のURLを知っているメンバーだけに限定して共有することも可能です。
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6 mb-24">
              {[
                {
                  icon: <Globe size={24} className="text-slate-400" />,
                  title: "全体公開",
                  text: "プラン一覧に表示され、誰でも検索・閲覧が可能です。",
                  active: false,
                },
                {
                  icon: <EyeOff size={24} className="text-[#000080]" />,
                  title: "限定公開",
                  text: "一覧には表示されません。URLを知っている人のみ閲覧可能です。",
                  active: true,
                },
                {
                  icon: <Lock size={24} className="text-slate-400" />,
                  title: "非公開",
                  text: "作成者本人と管理者のみが閲覧・編集可能です。",
                  active: false,
                },
              ].map((item, i) => (
                <div
                  key={i}
                  className={`p-10 rounded-[1.5rem] border-2 transition-all duration-300 flex flex-col gap-6 shadow-xl ${
                    item.active
                      ? "border-[#000080] bg-[#eff3ff]"
                      : "border-transparent bg-white shadow-sm"
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={
                        item.active ? "text-[#000080]" : "text-slate-400"
                      }
                    >
                      {item.icon}
                    </div>
                    <h4 className="text-xl font-black text-slate-900 tracking-tight">
                      {item.title}
                    </h4>
                  </div>
                  <p className="text-slate-500 font-medium leading-relaxed text-sm">
                    {item.text}
                  </p>
                </div>
              ))}
            </div>

            {/* プランの可視化 Area */}
            <div className="flex flex-col md:flex-row items-start justify-between mb-16 border-b border-slate-200 pb-8 gap-8 mt-24">
              <h3 className="text-2xl font-black text-[#000080] tracking-tight shrink-0">
                プランの可視化
              </h3>
              <p className="text-slate-500 font-bold max-w-xl text-sm leading-relaxed text-right">
                アップロードされたプランは即座に解析され、グラフィカルな実行フローと詳細な統計情報に分解されます。ボトルネックを特定するための全ての情報がここに集約されます。
              </p>
            </div>
            <div className="relative bg-white rounded-[2.5rem] shadow-2xl border border-slate-200 overflow-hidden">
              {/* Visualization (Image) */}
              <div className="flex justify-center bg-[#fafafa] rounded-3xl p-8 border border-slate-100">
                <img
                  src="/plan-sample-full.png"
                  alt="Execution Plan Full Visualization"
                  className="max-w-full h-auto object-contain filter drop-shadow-2xl rounded-xl"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* CTA Section */}
      <section className="mt-48 pt-80 pb-40 bg-[#000080] text-white relative overflow-hidden z-10">
        <div className="container px-4 mx-auto text-center relative z-10">
          <h2 className="text-5xl md:text-[8rem] font-[950] uppercase tracking-[-0.05em] leading-none mb-12">
            Start <br className="md:hidden" /> Tuning Now
          </h2>
          <p className="text-xl md:text-2xl text-white/60 max-w-2xl mx-auto font-black leading-relaxed mb-16">
            すべての機能を、すべてのエンジニアに。 <br />
            SQL Server 実行プランの共有は、ここから。
          </p>
          <div className="flex flex-wrap justify-center gap-8">
            <Link href="/auth/signup">
              <Button
                size="lg"
                className="bg-white text-[#000080] hover:bg-slate-100 font-black px-16 py-12 text-3xl rounded-2xl shadow-2xl transition-all hover:scale-105 active:scale-95 border-b-8 border-slate-200"
              >
                SIGN UP FREE
              </Button>
            </Link>
          </div>
        </div>

        {/* Modern pattern background */}
        <div className="absolute inset-0 opacity-[0.1] pointer-events-none">
          <svg width="100%" height="100%">
            <pattern
              id="pattern-circles"
              x="0"
              y="0"
              width="40"
              height="40"
              patternUnits="userSpaceOnUse"
            >
              <circle cx="20" cy="20" r="1" fill="#fff" />
            </pattern>
            <rect width="100%" height="100%" fill="url(#pattern-circles)" />
          </svg>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-20 bg-slate-950 text-white/20 text-center font-black text-xs uppercase tracking-[0.5em]">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center gap-8">
            <div className="w-12 h-1 bg-white/10" />
            <p>&copy; 2026 Query Plan Share. For the database community.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
