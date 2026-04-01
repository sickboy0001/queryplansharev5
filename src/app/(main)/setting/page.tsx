import { getCurrentUser } from "@/service/user-service";
import { redirect } from "next/navigation";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { revalidatePath } from "next/cache";
import { query } from "@/lib/db";

import { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "qps5 - Settings",
  };
}

export default async function SettingPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/auth/login");
  }

  async function updateProfile(formData: FormData) {
    "use server";
    const display_name = formData.get("display_name") as string;
    const self_intro_markdown = formData.get("self_intro_markdown") as string;

    const currentUser = await getCurrentUser();
    if (!currentUser) return;

    const now = new Date().toISOString();
    await query(
      "UPDATE users SET display_name = ?, self_intro_markdown = ?, updated_at = ? WHERE id = ?",
      [display_name, self_intro_markdown, now, currentUser.id],
    );

    revalidatePath("/setting");
  }

  return (
    <div className="container py-8 px-4 max-w-2xl mx-auto">
      <h1 className="text-3xl font-black mb-8 text-[#4d4db2] border-b-4 border-[#4d4db2] pb-4">
        ユーザー設定
      </h1>

      <Card className="border-2 border-[#4d4db2] shadow-lg overflow-hidden">
        <CardHeader className="bg-[#4d4db2] text-white">
          <CardTitle>プロフィール設定</CardTitle>
        </CardHeader>
        <CardContent className="pt-8">
          <form action={updateProfile} className="space-y-6">
            <div className="space-y-2">
              <Label
                htmlFor="email"
                className="font-bold text-slate-500 uppercase tracking-wider text-xs"
              >
                メールアドレス
              </Label>
              <Input
                id="email"
                value={user.email as string}
                disabled
                className="bg-slate-50 border-2 border-slate-100"
              />
              <p className="text-[10px] text-slate-400 font-medium">
                ※ メールアドレスは変更できません。
              </p>
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="display_name"
                className="font-bold text-[#4d4db2]"
              >
                表示名
              </Label>
              <Input
                id="display_name"
                name="display_name"
                defaultValue={(user.display_name as string) || ""}
                className="border-2 focus:border-[#4d4db2] transition-all"
                required
              />
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="self_intro_markdown"
                className="font-bold text-[#4d4db2]"
              >
                自己紹介 (Markdown対応)
              </Label>
              <Textarea
                id="self_intro_markdown"
                name="self_intro_markdown"
                defaultValue={(user.self_intro_markdown as string) || ""}
                className="border-2 focus:border-[#4d4db2] transition-all"
                rows={5}
              />
            </div>

            <div className="pt-4 border-t border-slate-100 flex justify-end">
              <Button
                type="submit"
                className="bg-[#4d4db2] hover:bg-[#6666cc] text-white font-bold px-10 shadow-md"
              >
                設定を保存する
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
