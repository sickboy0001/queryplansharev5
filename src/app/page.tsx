import Link from "next/link";
import { auth } from "@/auth";
import { Button } from "@/components/ui/button";
import { redirect } from "next/navigation";

export default async function StartPage() {
  const session = await auth();

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
      <div className="max-w-3xl w-full text-center space-y-8 bg-white p-12 rounded-2xl shadow-xl border-4 border-[#4d4db2]">
        <div className="space-y-4">
          <div className="inline-block bg-[#4d4db2] text-white px-4 py-1 rounded italic font-black text-3xl mb-4">
            QPS
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-[#4d4db2] tracking-tighter">
            SQL Server Query Plan Share
          </h1>
          <p className="text-xl text-slate-600 font-medium">
            実行プランを共有し、ブラウザで可視化・分析。
            <br />
            クエリパフォーマンスの最適化をサポートします。
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
          <Link href="/dashboard" className="w-full sm:w-auto">
            <Button
              size="lg"
              className="w-full sm:w-80 bg-[#4d4db2] text-white hover:bg-[#6666cc] font-black py-8 text-xl rounded-xl shadow-lg transition-all hover:scale-105"
            >
              ダッシュボードへ
            </Button>
          </Link>
          {!session && (
            <Link href="/auth/login" className="w-full sm:w-auto">
              <Button
                size="lg"
                variant="outline"
                className="w-full sm:w-64 border-4 border-[#4d4db2] text-[#4d4db2] hover:bg-blue-50 font-black py-8 text-xl rounded-xl shadow-lg transition-all hover:scale-105"
              >
                ログイン
              </Button>
            </Link>
          )}
        </div>

        <div className="pt-12 border-t-2 border-slate-100">
          <p className="text-slate-400 text-sm font-bold">
            &copy; {new Date().getFullYear()} qps5 - SQL Server Query Plan Share
          </p>
        </div>
      </div>
    </div>
  );
}
