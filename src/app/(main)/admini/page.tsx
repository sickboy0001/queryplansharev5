import { auth } from "@/auth";
import { isAdministrator } from "@/lib/user";
import { notFound } from "next/navigation";
import AdminiPageContent from "@/components/pages/admini/admini";
import { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "管理者ダッシュボード | Query Plan Share",
  };
}

export default async function AdminiPage() {
  const session = await auth();

  if (!isAdministrator(session?.user?.email)) {
    return notFound();
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">管理者ダッシュボード</h1>
      <AdminiPageContent />
    </div>
  );
}
