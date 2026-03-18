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
import { ArrowLeft, Save } from "lucide-react";

type Post = {
  id: string;
  query_plan_xml: string;
  title: string;
  comment_markdown: string;
  is_active: number | boolean;
  is_public: number | boolean;
};

interface Props {
  post: Post;
}

export default function EditPost({ post }: Props) {
  const [title, setTitle] = useState(post.title);
  const [xml, setXml] = useState(post.query_plan_xml);
  const [comment, setComment] = useState(post.comment_markdown);
  const [isPublic, setIsPublic] = useState(!!post.is_public);
  const [isActive, setIsActive] = useState(!!post.is_active);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!xml || !title) return;

    setIsSubmitting(true);
    try {
      const res = await fetch(`/api/posts/${post.id}`, {
        method: "PUT",
        body: JSON.stringify({
          title,
          query_plan_xml: xml,
          comment_markdown: comment,
          is_public: isPublic,
          is_active: isActive,
        }),
      });

      if (res.ok) {
        router.push(`/qpposts/${post.id}`);
        router.refresh();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container py-8 px-4 max-w-4xl mx-auto">
      <Card className="border-2 border-[#000080]/30 shadow-lg overflow-hidden">
        <CardHeader className="bg-[#000080] text-white py-6">
          <CardTitle className="text-xl font-bold tracking-tight flex items-center gap-2">
            <Save size={20} />
            プランの編集
          </CardTitle>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6 pt-8">
            <div className="space-y-2">
              <Label
                htmlFor="title"
                className="font-bold text-[#000080] text-sm uppercase tracking-wider"
              >
                タイトル
              </Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="border-2 focus:border-[#000080] focus:ring-0 transition-all rounded-lg"
                required
              />
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="xml"
                className="font-bold text-[#000080] text-sm uppercase tracking-wider"
              >
                Query Plan XML (.sqlplan)
              </Label>
              <Textarea
                id="xml"
                className="font-mono text-xs border-2 focus:border-[#000080] focus:ring-0 transition-all rounded-lg bg-slate-50"
                rows={12}
                value={xml}
                onChange={(e) => setXml(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="comment"
                className="font-bold text-[#000080] text-sm uppercase tracking-wider"
              >
                プランの説明 (Markdown対応)
              </Label>
              <Textarea
                id="comment"
                className="border-2 focus:border-[#000080] focus:ring-0 transition-all rounded-lg"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={5}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center space-x-4 bg-slate-50 p-4 rounded-lg border-2 border-[#000080]/10">
                <Switch
                  id="is-public"
                  checked={isPublic}
                  onCheckedChange={setIsPublic}
                />
                <Label
                  htmlFor="is-public"
                  className="font-bold text-slate-700 cursor-pointer text-sm select-none"
                >
                  全体に公開する
                </Label>
              </div>

              <div className="flex items-center space-x-4 bg-slate-50 p-4 rounded-lg border-2 border-[#000080]/10">
                <Switch
                  id="is-active"
                  checked={isActive}
                  onCheckedChange={setIsActive}
                />
                <Label
                  htmlFor="is-active"
                  className="font-bold text-slate-700 cursor-pointer text-sm select-none"
                >
                  アクティブ状態（非表示にしない）
                </Label>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between bg-slate-50 border-t border-slate-100 p-6">
            <Button
              variant="ghost"
              type="button"
              onClick={() => router.back()}
              className="font-bold text-slate-500 hover:text-[#000080] hover:bg-[#000080]/5"
            >
              <ArrowLeft size={16} className="mr-2" />
              戻る
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-[#000080] hover:bg-[#0000a0] text-white font-bold px-10 shadow-md h-11"
            >
              {isSubmitting ? "更新中..." : "変更を保存する"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
