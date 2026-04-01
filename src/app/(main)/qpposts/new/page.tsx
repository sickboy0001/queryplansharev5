import NewPost from "@/components/pages/qppost/NewPost";
import { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "新規プラン投稿 | Query Plan Share",
  };
}

export default function NewPostPage() {
  return <NewPost />;
}
