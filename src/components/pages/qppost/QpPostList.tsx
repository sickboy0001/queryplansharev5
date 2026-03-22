"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { PostCard, PostCardData } from "@/components/organisms/PostCard";
import {
  getAllPostsForAdminAction,
  getPostsAction,
  getMyAllPostsAction,
} from "@/lib/actions/qppost";

interface Props {
  posts?: PostCardData[];
  myPosts?: PostCardData[];
  ownerId?: string;
  currentUserId?: string;
  isAdmin?: boolean;
}

export default function QpPostList({
  posts: initialPosts = [],
  myPosts: initialMyPosts = [],
  ownerId,
  currentUserId,
  isAdmin,
}: Props) {
  const [posts, setPosts] = useState<PostCardData[]>(initialPosts);
  const [myPosts, setMyPosts] = useState<PostCardData[]>(initialMyPosts);
  const [adminPosts, setAdminPosts] = useState<PostCardData[]>([]);

  const [isLoadingAll, setIsLoadingAll] = useState(false);
  const [isLoadingMine, setIsLoadingMine] = useState(false);
  const [isLoadingAdmin, setIsLoadingAdmin] = useState(false);

  const [activeTab, setActiveTab] = useState("all");

  useEffect(() => {
    if (activeTab === "all" && posts.length === 0) {
      loadAllPosts();
    } else if (activeTab === "mine" && myPosts.length === 0 && currentUserId) {
      loadMyPosts();
    } else if (activeTab === "admin" && adminPosts.length === 0 && isAdmin) {
      loadAdminPosts();
    }
  }, [activeTab, isAdmin, currentUserId]);

  const loadAllPosts = async () => {
    setIsLoadingAll(true);
    try {
      const data = await getPostsAction({ ownerId });
      setPosts(data as any);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoadingAll(false);
    }
  };

  const loadMyPosts = async () => {
    setIsLoadingMine(true);
    try {
      const data = await getMyAllPostsAction();
      setMyPosts(data as any);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoadingMine(false);
    }
  };

  const loadAdminPosts = async () => {
    setIsLoadingAdmin(true);
    try {
      const data = await getAllPostsForAdminAction();
      setAdminPosts(data as any);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoadingAdmin(false);
    }
  };

  const PostGrid = ({
    postsToDisplay,
    loading = false,
  }: {
    postsToDisplay: PostCardData[];
    loading?: boolean;
  }) => (
    <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
      {loading ? (
        <div className="col-span-full py-32 text-center text-slate-400">
          読み込み中...
        </div>
      ) : (
        <>
          {postsToDisplay.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              currentUserId={currentUserId}
              isAdmin={isAdmin}
            />
          ))}
          {postsToDisplay.length === 0 && (
            <div className="col-span-full py-32 text-center text-slate-300 border-4 border-dashed border-slate-100 rounded-2xl bg-white/50">
              <p className="text-xl font-bold uppercase tracking-widest">
                No plans found.
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );

  return (
    <div className="container py-8 px-4 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8 border-b-4 border-[#000080] pb-4">
        <h1 className="text-3xl font-black text-[#000080] uppercase tracking-tighter">
          {ownerId ? "MY QUERY PLANS" : "QUERY PLAN GALLERY"}
        </h1>
        <Link href="/qpposts/new">
          <Button className="bg-[#000080] hover:bg-[#0000a0] text-white font-bold shadow-md h-11 px-6">
            新規投稿
          </Button>
        </Link>
      </div>

      {currentUserId ? (
        <Tabs
          defaultValue="all"
          value={activeTab}
          onValueChange={setActiveTab}
          className="w-full"
        >
          <TabsList className="mb-8 bg-slate-100 p-1 border-2 border-[#000080]/10">
            <TabsTrigger
              value="all"
              className="font-bold data-[state=active]:bg-[#000080] data-[state=active]:text-white"
            >
              一覧
            </TabsTrigger>
            <TabsTrigger
              value="mine"
              className="font-bold data-[state=active]:bg-[#000080] data-[state=active]:text-white"
            >
              投稿分
            </TabsTrigger>
            {isAdmin && (
              <TabsTrigger
                value="admin"
                className="font-bold data-[state=active]:bg-[#000080] data-[state=active]:text-white"
              >
                すべて (管理者)
              </TabsTrigger>
            )}
          </TabsList>
          <TabsContent value="all">
            <PostGrid postsToDisplay={posts} loading={isLoadingAll} />
          </TabsContent>
          <TabsContent value="mine">
            <PostGrid postsToDisplay={myPosts} loading={isLoadingMine} />
          </TabsContent>
          {isAdmin && (
            <TabsContent value="admin">
              <PostGrid postsToDisplay={adminPosts} loading={isLoadingAdmin} />
            </TabsContent>
          )}
        </Tabs>
      ) : (
        <PostGrid postsToDisplay={posts} loading={isLoadingAll} />
      )}
    </div>
  );
}
