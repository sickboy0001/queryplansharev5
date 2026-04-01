import NewPost from "@/components/pages/qppost/NewPost";
import { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "qps5 - Create Post",
  };
}

export default function NewPostPage() {
  return <NewPost />;
}
