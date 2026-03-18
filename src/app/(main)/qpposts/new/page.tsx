"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

export default function NewPostPage() {
  const [title, setTitle] = useState("");
  const [xml, setXml] = useState("");
  const [comment, setComment] = useState("");
  const [isPublic, setIsPublic] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!xml || !title) return;

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/posts", {
        method: "POST",
        body: JSON.stringify({
          title,
          query_plan_xml: xml,
          comment_markdown: comment,
          is_public: isPublic,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        router.push(`/qpposts/${data.id}`);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container py-8 px-4 max-w-4xl mx-auto">
      <Card className="border-2 border-[#4d4db2] shadow-lg overflow-hidden">
        <CardHeader className="bg-[#4d4db2] text-white">
          <CardTitle>クエリプランの投稿</CardTitle>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6 pt-8">
            <div className="space-y-2">
              <Label htmlFor="title" className="font-bold text-[#4d4db2]">
                タイトル
              </Label>
              <Input
                id="title"
                placeholder="例: 集計クエリの最適化"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="border-2 focus:border-[#4d4db2] transition-all"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="xml" className="font-bold text-[#4d4db2]">
                Query Plan XML (.sqlplan)
              </Label>
              <Textarea
                id="xml"
                placeholder="<ShowPlanXML ...>...</ShowPlanXML>"
                className="font-mono text-xs border-2 focus:border-[#4d4db2] transition-all"
                rows={10}
                value={xml}
                onChange={(e) => setXml(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="comment" className="font-bold text-[#4d4db2]">
                プランの説明 (Markdown対応)
              </Label>
              <Textarea
                id="comment"
                placeholder="このプランについての説明を記載してください..."
                className="border-2 focus:border-[#4d4db2] transition-all"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={5}
              />
            </div>

            <div className="flex items-center space-x-3 bg-slate-50 p-4 rounded-lg border-2 border-slate-100">
              <Switch
                id="is-public"
                checked={isPublic}
                onCheckedChange={setIsPublic}
              />
              <Label
                htmlFor="is-public"
                className="font-bold text-slate-700 cursor-pointer"
              >
                全体に公開する
              </Label>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between bg-slate-50 border-t border-slate-100 p-6">
            <Button
              variant="ghost"
              type="button"
              onClick={() => router.back()}
              className="font-bold text-slate-500"
            >
              キャンセル
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-[#4d4db2] hover:bg-[#6666cc] font-bold px-8 shadow-md"
            >
              {isSubmitting ? "投稿中..." : "プランを投稿する"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
