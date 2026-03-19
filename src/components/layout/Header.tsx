import Link from "next/link";
import { auth } from "@/auth";
import { Button } from "@/components/ui/button";
import MobileMenuButton from "./MobileMenuButton";
import { handleSignOut } from "@/lib/actions/auth";
import { isAdminEmail } from "@/service/user-service";

export default async function Header() {
  const session = await auth();

  const isAdmin = isAdminEmail(session?.user?.email);

  return (
    <header className="bg-white text-[#4d4db2] border-b-4 border-[#4d4db2] shadow-sm sticky top-0 z-50">
      <div className="container flex h-16 items-center justify-between px-6 max-w-[100%] mx-auto">
        <div className="flex items-center gap-4">
          <MobileMenuButton />
          <Link
            href="/dashboard"
            className="font-black text-2xl tracking-tighter hover:opacity-70 transition-opacity flex items-center gap-2"
          >
            <span className="bg-[#4d4db2] text-white px-2 py-0.5 rounded italic">
              QPS
            </span>
            <span className="hidden sm:inline">qps5</span>
          </Link>
        </div>
        <div className="flex items-center gap-6">
          {session?.user ? (
            <div className="flex items-center gap-6">
              <Link
                href="/setting"
                className="text-sm font-bold hover:opacity-70 transition-opacity border-b-2 border-transparent hover:border-[#4d4db2] flex items-center gap-2"
              >
                {session.user.name || session.user.email}
                {isAdmin && (
                  <span className="bg-red-100 text-red-600 text-[10px] px-1.5 py-0.5 rounded-full border border-red-200 uppercase tracking-wider font-black">
                    Admin
                  </span>
                )}
              </Link>
              <form action={handleSignOut}>
                <Button
                  variant="outline"
                  size="sm"
                  type="submit"
                  className="border-2 border-[#4d4db2] text-[#4d4db2] hover:bg-[#4d4db2] hover:text-white font-black px-4 transition-all"
                >
                  ログアウト
                </Button>
              </form>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link href="/auth/login">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-[#4d4db2] hover:bg-blue-50 font-bold px-4"
                >
                  ログイン
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
