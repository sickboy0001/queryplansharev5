"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  ArrowLeft,
  Save,
  Trash2,
  Link as LinkIcon,
  Copy,
  RefreshCw,
  PlusCircle,
  AlertCircle,
  Clock,
  Globe,
  EyeOff,
} from "lucide-react";
import {
  getOrCreateUnlistedLinkAction,
  addExpiryDaysAction,
  regenerateUnlistedLinkAction,
  resetExpiryAction,
  deleteUnlistedLinkAction,
} from "@/lib/actions/qppost";

type Post = {
  id: string;
  query_plan_xml: string;
  title: string;
  comment_markdown: string;
  is_active: number | boolean;
  is_public: number;
  owner_id?: string | null;
  edit_token?: string | null;
};

type UnlistedLink = {
  id: string;
  post_id: string;
  expires_at: string;
};

interface Props {
  post: Post;
  unlistedLink?: UnlistedLink | null;
}

export default function EditPost({
  post,
  unlistedLink: initialUnlistedLink,
}: Props) {
  const [title, setTitle] = useState(post.title);
  const [xml, setXml] = useState(post.query_plan_xml);
  const [comment, setComment] = useState(post.comment_markdown);
  const [isPublic, setIsPublic] = useState<number>(Number(post.is_public));
  const [isActive, setIsActive] = useState(!!post.is_active);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [xmlFocused, setXmlFocused] = useState(false);
  const [commentFocused, setCommentFocused] = useState(false);
  const [unlistedLink, setUnlistedLink] = useState<UnlistedLink | null>(
    initialUnlistedLink || null,
  );
  const [isUpdatingLink, setIsUpdatingLink] = useState(false);
  const [origin, setOrigin] = useState("");
  const router = useRouter();

  // Dialog state
  const [isRegenerateDialogOpen, setIsRegenerateDialogOpen] = useState(false);
  const [isDeleteLinkDialogOpen, setIsDeleteLinkDialogOpen] = useState(false);
  const [isDeletePostDialogOpen, setIsDeletePostDialogOpen] = useState(false);

  useEffect(() => {
    setOrigin(window.location.origin);
  }, []);

  const isLinkExpired = unlistedLink
    ? new Date(unlistedLink.expires_at) < new Date()
    : false;

  const handleGetUnlistedLink = async () => {
    setIsUpdatingLink(true);
    try {
      const link = await getOrCreateUnlistedLinkAction(post.id);
      setUnlistedLink(link as any);
      // 自動的に限定公開に切り替える（ユーザーの意図に合わせる）
      if (isPublic === 0) {
        setIsPublic(1);
      }
      toast.success("限定公開 URL を取得しました。");
    } catch (err) {
      console.error(err);
      toast.error("限定公開 URL の取得に失敗しました。");
    } finally {
      setIsUpdatingLink(false);
    }
  };

  const handleCopyLink = () => {
    if (!unlistedLink) return;
    const url = `${origin}/qpposts/unlisted/${unlistedLink.id}`;
    navigator.clipboard.writeText(url);
    toast.success("クリップボードにコピーしました");
  };

  const handleAddExpiry = async (days: number) => {
    if (!unlistedLink) return;
    setIsUpdatingLink(true);
    try {
      await addExpiryDaysAction(post.id, unlistedLink.id, days);
      const newExpiry = new Date(
        new Date(unlistedLink.expires_at).getTime() +
          days * 24 * 60 * 60 * 1000,
      ).toISOString();
      setUnlistedLink({ ...unlistedLink, expires_at: newExpiry });
      toast.success(`${days}日分延長しました。`);
    } catch (err) {
      console.error(err);
      toast.error("期限の更新に失敗しました。");
    } finally {
      setIsUpdatingLink(false);
    }
  };

  const handleResetExpiry = async () => {
    if (!unlistedLink) return;
    setIsUpdatingLink(true);
    try {
      await resetExpiryAction(post.id, unlistedLink.id, 720); // Reset to 30 days
      const newExpiry = new Date(
        new Date().getTime() + 720 * 60 * 60 * 1000,
      ).toISOString();
      setUnlistedLink({ ...unlistedLink, expires_at: newExpiry });
      toast.success("本日より 30 日間に設定されました。");
    } catch (err) {
      console.error(err);
      toast.error("期限の更新に失敗しました。");
    } finally {
      setIsUpdatingLink(false);
    }
  };

  const handleRegenerateLinkClick = () => {
    setIsRegenerateDialogOpen(true);
  };

  const handleRegenerateLink = async () => {
    setIsUpdatingLink(true);
    try {
      const link = await regenerateUnlistedLinkAction(post.id);
      setUnlistedLink(link as any);
      toast.success(
        "新しい限定公開（アンリステッドリンク）URL を発行しました。",
      );
    } catch (err) {
      console.error(err);
      toast.error("URL の再生成に失敗しました。");
    } finally {
      setIsUpdatingLink(false);
    }
  };

  const handleDeleteLinkClick = () => {
    setIsDeleteLinkDialogOpen(true);
  };

  const handleDeleteUnlistedLink = async () => {
    setIsUpdatingLink(true);
    try {
      await deleteUnlistedLinkAction(post.id);
      setUnlistedLink(null);
      // 非公開に切り替える（推奨）
      if (isPublic === 1) {
        setIsPublic(0);
      }
      toast.success("限定公開 URL を削除しました。");
    } catch (err) {
      console.error(err);
      toast.error("URL の削除に失敗しました。");
    } finally {
      setIsUpdatingLink(false);
    }
  };

  // 限定公開かつ アンリステッドリンク未取得の場合は保存を禁止
  const isUnlistedRequired = isPublic === 1 && !unlistedLink;
  const isSaveDisabled = isSubmitting || isDeleting || isUnlistedRequired;

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!xml || !title) return;

    // 限定公開だがリンク未取得の場合はエラー
    if (isPublic === 1 && !unlistedLink) {
      toast.error(
        "限定公開にするには、まず「限定公開 URL を取得」してください。",
      );
      return;
    }

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
      } else {
        const errorData = await res.json();
        toast.error(
          `保存に失敗しました：${errorData.error || "Unknown error"}`,
        );
      }
    } catch (err) {
      console.error(err);
      toast.error("保存中にエラーが発生しました。");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeletePostClick = () => {
    setIsDeletePostDialogOpen(true);
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/posts/${post.id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        router.push("/qpposts");
        router.refresh();
      } else {
        const errorData = await res.json();
        toast.error(
          `削除に失敗しました：${errorData.error || "Unknown error"}`,
        );
      }
    } catch (err) {
      console.error(err);
      toast.error("削除中にエラーが発生しました。");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
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
                    プランの説明 (Markdown 対応)
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

                <div className="space-y-4">
                  <Label className="font-bold text-[#000080] text-sm uppercase tracking-wider block border-b border-slate-100 pb-2">
                    公開設定
                  </Label>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div
                      onClick={() => setIsPublic(2)}
                      className={`flex flex-col gap-2 p-4 rounded-xl border-2 transition-all cursor-pointer select-none ${
                        isPublic === 2
                          ? "border-[#000080] bg-[#000080]/5 shadow-md"
                          : "border-slate-100 bg-slate-50 hover:border-slate-300"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <Globe
                          size={18}
                          className={
                            isPublic === 2 ? "text-[#000080]" : "text-slate-400"
                          }
                        />
                        <span
                          className={`font-bold text-sm ${isPublic === 2 ? "text-[#000080]" : "text-slate-600"}`}
                        >
                          全体公開
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-500 leading-tight">
                        プラン一覧に表示され、誰でも検索・閲覧が可能です。
                      </p>
                    </div>

                    <div
                      onClick={() => setIsPublic(1)}
                      className={`flex flex-col gap-2 p-4 rounded-xl border-2 transition-all cursor-pointer select-none ${
                        isPublic === 1
                          ? "border-[#000080] bg-[#000080]/5 shadow-md"
                          : "border-slate-100 bg-slate-50 hover:border-slate-300"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <EyeOff
                          size={18}
                          className={
                            isPublic === 1 ? "text-[#000080]" : "text-slate-400"
                          }
                        />
                        <span
                          className={`font-bold text-sm ${isPublic === 1 ? "text-[#000080]" : "text-slate-600"}`}
                        >
                          限定公開
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-500 leading-tight">
                        一覧には表示されません。URL
                        を知っている人のみ閲覧可能です。
                      </p>
                    </div>

                    <div
                      onClick={() => setIsPublic(0)}
                      className={`flex flex-col gap-2 p-4 rounded-xl border-2 transition-all cursor-pointer select-none ${
                        isPublic === 0
                          ? "border-[#000080] bg-[#000080]/5 shadow-md"
                          : "border-slate-100 bg-slate-50 hover:border-slate-300"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <Globe
                          size={18}
                          className={
                            isPublic === 0 ? "text-[#000080]" : "text-slate-400"
                          }
                        />
                        <span
                          className={`font-bold text-sm ${isPublic === 0 ? "text-[#000080]" : "text-slate-600"}`}
                        >
                          非公開
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-500 leading-tight">
                        作成者本人と管理者のみが閲覧・編集可能です。
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4 bg-slate-50 p-4 rounded-lg border-2 border-[#000080]/10 mt-4">
                    <Switch
                      id="is-active"
                      checked={isActive}
                      onCheckedChange={setIsActive}
                    />
                    <Label
                      htmlFor="is-active"
                      className="font-bold text-slate-700 cursor-pointer text-sm select-none"
                    >
                      アクティブ状態（アーカイブしない）
                    </Label>
                  </div>
                </div>

                {/* アンリステッドリンク Section */}
                <div
                  className="space-y-4 pt-6 border-t border-slate-100"
                  id="section-unlisted"
                >
                  <div className="flex items-center justify-between">
                    <Label className="font-bold text-[#000080] text-sm uppercase tracking-wider">
                      限定公開（アンリステッドリンク）用 URL の設定
                    </Label>
                  </div>

                  {!unlistedLink ? (
                    <div className="bg-slate-50 p-6 rounded-xl border-2 border-dashed border-slate-200 text-center">
                      <LinkIcon
                        className="mx-auto mb-3 text-slate-400"
                        size={32}
                      />
                      <p className="text-sm text-slate-500 mb-4">
                        「限定公開」で使用する専用の URL を発行します。
                      </p>
                      <Button
                        type="button"
                        onClick={handleGetUnlistedLink}
                        disabled={isUpdatingLink}
                        className="bg-[#000080] hover:bg-[#0000a0] text-white"
                      >
                        {isUpdatingLink ? (
                          <RefreshCw size={16} className="mr-2 animate-spin" />
                        ) : (
                          <PlusCircle size={16} className="mr-2" />
                        )}
                        アンリステッドリンクを発行する
                      </Button>
                    </div>
                  ) : (
                    <div className="bg-slate-50 p-6 rounded-xl border-2 border-[#000080]/10 space-y-4">
                      {isPublic !== 1 && (
                        <div className="bg-amber-50 border border-amber-200 p-3 rounded-lg flex items-center gap-3 text-amber-800 text-xs font-bold">
                          <AlertCircle size={16} className="shrink-0" />
                          URL
                          を発行済みですが、公開設定が「限定公開」になっていません。
                        </div>
                      )}
                      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
                        <div className="flex-1 w-full">
                          <Label className="text-xs font-bold text-slate-500 mb-1 block">
                            アンリステッドリンク
                          </Label>
                          <div className="flex gap-2">
                            <Input
                              readOnly
                              value={`${origin}/qpposts/unlisted/${unlistedLink.id}`}
                              className="bg-white border-slate-200 font-mono text-xs"
                            />
                            <Button
                              type="button"
                              variant="outline"
                              size="icon"
                              onClick={handleCopyLink}
                              title="コピー"
                            >
                              <Copy size={16} />
                            </Button>
                          </div>
                        </div>
                        <div className="shrink-0 flex items-center gap-2">
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={handleRegenerateLinkClick}
                            disabled={isUpdatingLink}
                            className="text-slate-500 hover:text-[#000080]"
                          >
                            <RefreshCw
                              size={14}
                              className={`mr-1 ${isUpdatingLink ? "animate-spin" : ""}`}
                            />
                            再採番
                          </Button>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={handleDeleteLinkClick}
                            disabled={isUpdatingLink}
                            className="text-slate-500 hover:text-red-600"
                          >
                            <Trash2 size={14} className="mr-1" />
                            削除
                          </Button>
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-4 pt-2 border-t border-slate-200/50">
                        <div className="flex items-center gap-2 text-sm">
                          <Clock size={16} className="text-slate-400" />
                          <span className="font-bold text-slate-600">
                            有効期限:
                          </span>
                          <span
                            className={`font-mono ${isLinkExpired ? "text-red-600 font-bold" : "text-slate-700"}`}
                          >
                            {new Date(unlistedLink.expires_at).toLocaleString()}
                          </span>
                          {isLinkExpired && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-bold bg-red-100 text-red-600">
                              <AlertCircle size={12} className="mr-1" />
                              期限切れ
                            </span>
                          )}
                        </div>

                        <div className="flex flex-wrap gap-2 ml-auto">
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => handleAddExpiry(1)}
                            disabled={isUpdatingLink}
                            className="h-8 text-xs"
                          >
                            +1 日
                          </Button>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => handleAddExpiry(10)}
                            disabled={isUpdatingLink}
                            className="h-8 text-xs"
                          >
                            +10 日
                          </Button>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => handleAddExpiry(100)}
                            disabled={isUpdatingLink}
                            className="h-8 text-xs"
                          >
                            +100 日
                          </Button>
                          <Button
                            type="button"
                            variant="secondary"
                            size="sm"
                            onClick={handleResetExpiry}
                            disabled={isUpdatingLink}
                            className="h-8 text-xs"
                          >
                            期限をリセット
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}
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
                    onClick={handleDeletePostClick}
                    className="font-bold shadow-md h-11 px-6"
                  >
                    <Trash2 size={16} className="mr-2" />
                    {isDeleting ? "削除中..." : "削除する"}
                  </Button>
                  <Button
                    type="submit"
                    disabled={isSaveDisabled}
                    className="bg-[#000080] hover:bg-[#0000a0] text-white font-bold px-10 shadow-md h-11"
                  >
                    {isSubmitting
                      ? "更新中..."
                      : isUnlistedRequired
                        ? "限定公開（アンリステッドリンク）URL を取得してください"
                        : "変更を保存する"}
                  </Button>
                </div>
              </CardFooter>
            </form>
          </Card>
        </div>

        {/* Sticky Quick Nav - Sidebar style */}
        <aside className="lg:w-64 order-1 lg:order-2">
          <div className="sticky top-0 z-40 bg-white p-6 rounded-xl border-2 border-[#000080]/20 shadow-lg space-y-6">
            <h3 className="text-base font-black text-[#000080] uppercase tracking-widest border-b-2 border-[#000080]/10 pb-2">
              クイックメニュー
            </h3>
            <nav className="flex flex-col gap-2">
              <button
                onClick={() =>
                  document
                    .getElementById("section-title")
                    ?.scrollIntoView({ behavior: "smooth", block: "center" })
                }
                className="text-left text-sm font-bold text-slate-600 hover:text-[#000080] hover:bg-[#000080]/5 px-3 py-2.5 rounded-lg transition-all flex items-center gap-2 group"
              >
                <span className="w-2 h-2 bg-[#000080]/20 group-hover:bg-[#000080] rounded-full"></span>
                タイトル
              </button>
              <button
                onClick={() =>
                  document
                    .getElementById("section-xml")
                    ?.scrollIntoView({ behavior: "smooth", block: "center" })
                }
                className="text-left text-sm font-bold text-slate-600 hover:text-[#000080] hover:bg-[#000080]/5 px-3 py-2.5 rounded-lg transition-all flex items-center gap-2 group"
              >
                <span className="w-2 h-2 bg-[#000080]/20 group-hover:bg-[#000080] rounded-full"></span>
                QueryPlanXml
              </button>
              <button
                onClick={() =>
                  document
                    .getElementById("section-comment")
                    ?.scrollIntoView({ behavior: "smooth", block: "center" })
                }
                className="text-left text-sm font-bold text-slate-600 hover:text-[#000080] hover:bg-[#000080]/5 px-3 py-2.5 rounded-lg transition-all flex items-center gap-2 group"
              >
                <span className="w-2 h-2 bg-[#000080]/20 group-hover:bg-[#000080] rounded-full"></span>
                プランの説明
              </button>
              <button
                onClick={() =>
                  document
                    .getElementById("section-unlisted")
                    ?.scrollIntoView({ behavior: "smooth", block: "center" })
                }
                className="text-left text-sm font-bold text-slate-600 hover:text-[#000080] hover:bg-[#000080]/5 px-3 py-2.5 rounded-lg transition-all flex items-center gap-2 group"
              >
                <span className="w-2 h-2 bg-[#000080]/20 group-hover:bg-[#000080] rounded-full"></span>
                限定公開設定
              </button>
              <button
                onClick={() =>
                  document
                    .getElementById("section-save")
                    ?.scrollIntoView({ behavior: "smooth", block: "center" })
                }
                className="text-left text-sm font-bold text-slate-600 hover:text-[#000080] hover:bg-[#000080]/5 px-3 py-2.5 rounded-lg transition-all flex items-center gap-2 group"
              >
                <span className="w-2 h-2 bg-[#000080]/20 group-hover:bg-[#000080] rounded-full"></span>
                保存ボタンへ
              </button>
            </nav>
          </div>
        </aside>
      </div>

      {/* Regenerate Link Dialog */}
      <Dialog
        open={isRegenerateDialogOpen}
        onOpenChange={setIsRegenerateDialogOpen}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-[#000080]">
              <RefreshCw size={20} />
              限定公開 URL を再採番しますか？
            </DialogTitle>
            <DialogDescription>
              URL を再採番すると、現在の URL は無効になります。既に共有している
              URL は使用できなくなります。
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="outline"
              onClick={() => setIsRegenerateDialogOpen(false)}
            >
              キャンセル
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                handleRegenerateLink();
                setIsRegenerateDialogOpen(false);
              }}
            >
              再採番する
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Link Dialog */}
      <Dialog
        open={isDeleteLinkDialogOpen}
        onOpenChange={setIsDeleteLinkDialogOpen}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-[#000080]">
              <AlertCircle size={20} />
              限定公開 URL を削除しますか？
            </DialogTitle>
            <DialogDescription>
              現在の URL
              は無効になります。公開設定が「限定公開」になっている場合、非公開に変更されます。
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="outline"
              onClick={() => setIsDeleteLinkDialogOpen(false)}
            >
              キャンセル
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                handleDeleteUnlistedLink();
                setIsDeleteLinkDialogOpen(false);
              }}
            >
              削除する
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Post Dialog */}
      <Dialog
        open={isDeletePostDialogOpen}
        onOpenChange={setIsDeletePostDialogOpen}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-600">
              <Trash2 size={20} />
              プランを削除しますか？
            </DialogTitle>
            <DialogDescription className="text-red-600/80">
              この操作は物理削除であり、取り消すことができません。本当に削除してもよろしいですか？
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="outline"
              onClick={() => setIsDeletePostDialogOpen(false)}
            >
              キャンセル
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                handleDelete();
                setIsDeletePostDialogOpen(false);
              }}
            >
              削除する
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Link Dialog */}
      <Dialog
        open={isDeleteLinkDialogOpen}
        onOpenChange={setIsDeleteLinkDialogOpen}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-[#000080]">
              <AlertCircle size={20} />
              限定公開 URL を削除しますか？
            </DialogTitle>
            <DialogDescription>
              現在の URL
              は無効になります。公開設定が「限定公開」になっている場合、非公開に変更されます。
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="outline"
              onClick={() => setIsDeleteLinkDialogOpen(false)}
            >
              キャンセル
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                handleDeleteUnlistedLink();
                setIsDeleteLinkDialogOpen(false);
              }}
            >
              削除する
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Post Dialog */}
      <Dialog
        open={isDeletePostDialogOpen}
        onOpenChange={setIsDeletePostDialogOpen}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-600">
              <Trash2 size={20} />
              プランを削除しますか？
            </DialogTitle>
            <DialogDescription className="text-red-600/80">
              この操作は物理削除であり、取り消すことができません。本当に削除してもよろしいですか？
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="outline"
              onClick={() => setIsDeletePostDialogOpen(false)}
            >
              キャンセル
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                handleDelete();
                setIsDeletePostDialogOpen(false);
              }}
            >
              削除する
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
