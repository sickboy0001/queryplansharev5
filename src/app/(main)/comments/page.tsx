import { getAllComments } from "@/service/comments-service";
import Comments from "@/components/pages/comments/Comments";

export default async function CommentsPage() {
  const commentsRaw = await getAllComments();

  // Ensure plain objects for client component
  const comments = JSON.parse(JSON.stringify(commentsRaw));

  return <Comments comments={comments} />;
}
