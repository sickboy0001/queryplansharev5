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
import { ArrowLeft, Save, Trash2 } from "lucide-react";

type Post = {
  id: string;
  query_plan_xml: string;
  title: string;
  comment_markdown: string;
  is_active: number | boolean;
  is_public: number | boolean;
  edit_token?: string | null;
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
  const [isDeleting, setIsDeleting] = useState(false);
  const [xmlFocused, setXmlFocused] = useState(false);
  const [commentFocused, setCommentFocused] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
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

  const handleDelete = async () => {
    if (
      !confirm(
        "このプランを削除してもよろしいですか？物理削除です。この操作は取り消せません。",
      )
    ) {
      return;
    }

    setIsDeleting(true);
    try {
      const url = new URL(`/api/posts/${post.id}`, window.location.origin);
      if (post.edit_token) {
        url.searchParams.append("editToken", post.edit_token);
      }

      const res = await fetch(url.toString(), {
        method: "DELETE",
      });

      if (res.ok) {
        router.push("/qpposts");
        router.refresh();
      } else {
        const errorData = await res.json();
        alert(`削除に失敗しました: ${errorData.error || "Unknown error"}`);
      }
    } catch (err) {
      console.error(err);
      alert("削除中にエラーが発生しました。");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="container py-8 px-4 max-w-7xl mx-auto relative flex flex-col lg:flex-row gap-8">
      {/* Main Content */}
      <div className="flex-1 min-w-0 order-2 lg:order-1">
        <Card className="border-2 border-[#000080]/30 shadow-lg overflow-hidden">
          <CardHeader className="bg-[#000080] text-white py-6">
            <CardTitle className="text-xl font-bold tracking-tight flex items-center gap-2">
              <Save size={20} />
              プランの編集
            </CardTitle>
          </CardHeader>
          <form onSubmit={handleSubmit} id="edit-post-form">
            <CardContent className="space-y-6 pt-8">
              <div className="space-y-2">
                <Label
                  htmlFor="title"
                  id="section-title"
                  className="font-bold text-[#000080] text-sm uppercase tracking-wider scroll-mt-24"
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
                  id="section-xml"
                  className="font-bold text-[#000080] text-sm uppercase tracking-wider scroll-mt-24"
                >
                  Query Plan XML (.sqlplan)
                </Label>
                <Textarea
                  id="xml"
                  className="font-mono text-xs border-2 focus:border-[#000080] focus:ring-0 transition-all rounded-lg bg-slate-50 !field-sizing-fixed"
                  style={{
                    height: xmlFocused ? "500px" : "120px",
                    transition: "height 0.2s ease-in-out",
                  }}
                  value={xml}
                  onChange={(e) => setXml(e.target.value)}
                  onFocus={() => setXmlFocused(true)}
                  onBlur={() => setXmlFocused(false)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="comment"
                  id="section-comment"
                  className="font-bold text-[#000080] text-sm uppercase tracking-wider scroll-mt-24"
                >
                  プランの説明 (Markdown対応)
                </Label>
                <Textarea
                  id="comment"
                  className="border-2 focus:border-[#000080] focus:ring-0 transition-all rounded-lg !field-sizing-fixed"
                  style={{
                    height: commentFocused ? "300px" : "120px",
                    transition: "height 0.2s ease-in-out",
                  }}
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  onFocus={() => setCommentFocused(true)}
                  onBlur={() => setCommentFocused(false)}
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
            <CardFooter
              className="flex justify-between bg-slate-50 border-t border-slate-100 p-6"
              id="section-save"
            >
              <Button
                variant="ghost"
                type="button"
                onClick={() => router.back()}
                className="font-bold text-slate-500 hover:text-[#000080] hover:bg-[#000080]/5"
              >
                <ArrowLeft size={16} className="mr-2" />
                戻る
              </Button>
              <div className="flex gap-2">
                <Button
                  variant="destructive"
                  type="button"
                  disabled={isSubmitting || isDeleting}
                  onClick={handleDelete}
                  className="font-bold shadow-md h-11 px-6"
                >
                  <Trash2 size={16} className="mr-2" />
                  {isDeleting ? "削除中..." : "削除する"}
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting || isDeleting}
                  className="bg-[#000080] hover:bg-[#0000a0] text-white font-bold px-10 shadow-md h-11"
                >
                  {isSubmitting ? "更新中..." : "変更を保存する"}
                </Button>
              </div>
            </CardFooter>
          </form>
        </Card>
      </div>

      {/* Sticky Quick Nav - Sidebar style */}
      <aside className="lg:w-64 order-1 lg:order-2">
        <div className="sticky top-0 z-40 bg-white p-6 rounded-xl border-2 border-[#000080]/20 shadow-lg space-y-6">
          <h3 className="text-sm font-black text-[#000080] uppercase tracking-widest border-b-2 border-[#000080]/10 pb-2">
            クイックメニュー
          </h3>
          <nav className="flex flex-col gap-2">
            <button
              onClick={() =>
                document
                  .getElementById("section-title")
                  ?.scrollIntoView({ behavior: "smooth", block: "center" })
              }
              className="text-left text-xs font-bold text-slate-600 hover:text-[#000080] hover:bg-[#000080]/5 px-3 py-2.5 rounded-lg transition-all flex items-center gap-2 group"
            >
              <span className="w-1.5 h-1.5 bg-[#000080]/20 group-hover:bg-[#000080] rounded-full"></span>
              タイトル
            </button>
            <button
              onClick={() =>
                document
                  .getElementById("section-xml")
                  ?.scrollIntoView({ behavior: "smooth", block: "center" })
              }
              className="text-left text-xs font-bold text-slate-600 hover:text-[#000080] hover:bg-[#000080]/5 px-3 py-2.5 rounded-lg transition-all flex items-center gap-2 group"
            >
              <span className="w-1.5 h-1.5 bg-[#000080]/20 group-hover:bg-[#000080] rounded-full"></span>
              QueryPlanXml
            </button>
            <button
              onClick={() =>
                document
                  .getElementById("section-comment")
                  ?.scrollIntoView({ behavior: "smooth", block: "center" })
              }
              className="text-left text-xs font-bold text-slate-600 hover:text-[#000080] hover:bg-[#000080]/5 px-3 py-2.5 rounded-lg transition-all flex items-center gap-2 group"
            >
              <span className="w-1.5 h-1.5 bg-[#000080]/20 group-hover:bg-[#000080] rounded-full"></span>
              プランの説明
            </button>
            <button
              onClick={() =>
                document
                  .getElementById("section-save")
                  ?.scrollIntoView({ behavior: "smooth", block: "center" })
              }
              className="text-left text-xs font-bold text-slate-600 hover:text-[#000080] hover:bg-[#000080]/5 px-3 py-2.5 rounded-lg transition-all flex items-center gap-2 group"
            >
              <span className="w-1.5 h-1.5 bg-[#000080]/20 group-hover:bg-[#000080] rounded-full"></span>
              保存ボタンへ
            </button>
          </nav>
        </div>
      </aside>
    </div>
  );
}
