"use client";

import Link from "next/link";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { PostCard, PostCardData } from "@/components/organisms/PostCard";

interface Props {
  posts: PostCardData[];
  myPosts?: PostCardData[];
  ownerId?: string;
  currentUserId?: string;
  isAdmin?: boolean;
}

export default function QpPostList({
  posts,
  myPosts = [],
  ownerId,
  currentUserId,
  isAdmin,
}: Props) {
  const PostGrid = ({ postsToDisplay }: { postsToDisplay: PostCardData[] }) => (
    <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
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
        <Tabs defaultValue="all" className="w-full">
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
          </TabsList>
          <TabsContent value="all">
            <PostGrid postsToDisplay={posts} />
          </TabsContent>
          <TabsContent value="mine">
            <PostGrid postsToDisplay={myPosts} />
          </TabsContent>
        </Tabs>
      ) : (
        <PostGrid postsToDisplay={posts} />
      )}
    </div>
  );
}
