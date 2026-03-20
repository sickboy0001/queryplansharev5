import { query } from "@/lib/db";
import { auth } from "@/auth";
import { generateShortId } from "@/lib/utils";

export type CommentWithPost = {
  id: string;
  post_id: string;
  post_title: string;
  comment_markdown: string;
  owner_id: string | null;
  owner_name: string | null;
  created_at: string;
  updated_at: string;
};

/**
 * Fetch all comments for a specific post
 */
export async function getComments(postId: string) {
  const res = await query(
    `SELECT c.*, u.display_name as owner_name 
         FROM qps_comments c
         LEFT JOIN users u ON c.owner_id = u.id
         WHERE c.post_id = ?
         ORDER BY c.created_at ASC`,
    [postId],
  );
  return res.rows;
}

/**
 * Create a new comment
 */
export async function createComment(postId: string, commentMarkdown: string) {
  const session = await auth();
  const id = generateShortId();
  const now = new Date().toISOString();

  // Ensure owner_id is either a valid existing user ID or null
  let owner_id: string | null = null;
  if (session?.user?.id) {
    const userRes = await query("SELECT id FROM users WHERE id = ?", [
      session.user.id,
    ]);
    if (userRes.rows.length > 0) {
      owner_id = session.user.id;
    }
  }

  await query(
    `INSERT INTO qps_comments (id, post_id, comment_markdown, owner_id, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?, ?)`,
    [id, postId, commentMarkdown, owner_id, now, now],
  );
}

/**
 * Delete a comment
 */
export async function deleteComment(commentId: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  // Check if user is comment owner or post owner
  const res = await query(
    `SELECT c.owner_id as comment_owner, p.owner_id as post_owner 
         FROM qps_comments c
         JOIN qps_posts p ON c.post_id = p.id
         WHERE c.id = ?`,
    [commentId],
  );
  const row = res.rows[0];
  if (!row) throw new Error("Comment not found");

  if (
    row.comment_owner !== session.user.id &&
    row.post_owner !== session.user.id
  ) {
    throw new Error("Unauthorized");
  }

  await query("DELETE FROM qps_comments WHERE id = ?", [commentId]);
}

/**
 * Update a comment
 */
export async function updateComment(
  commentId: string,
  commentMarkdown: string,
) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const res = await query("SELECT owner_id FROM qps_comments WHERE id = ?", [
    commentId,
  ]);
  const comment = res.rows[0];
  if (!comment) throw new Error("Comment not found");

  // Only the owner can edit their comment
  if (comment.owner_id !== session.user.id) {
    throw new Error("Unauthorized");
  }

  const now = new Date().toISOString();
  await query(
    "UPDATE qps_comments SET comment_markdown = ?, updated_at = ? WHERE id = ?",
    [commentMarkdown, now, commentId],
  );
}

/**
 * Fetch all public comments for the comments gallery
 */
export async function getAllComments() {
  const res = await query(
    `SELECT c.*, p.title as post_title, u.display_name as owner_name
     FROM qps_comments c
     JOIN qps_posts p ON c.post_id = p.id
     LEFT JOIN users u ON c.owner_id = u.id
     WHERE p.is_active = 1 AND p.is_public = 1
     ORDER BY c.created_at DESC`,
  );
  return res.rows as unknown as CommentWithPost[];
}

/**
 * Fetch most recent public comments for dashboard
 */
export async function getRecentComments(limit: number = 5) {
  const res = await query(
    `SELECT c.*, p.title as post_title, u.display_name as owner_name
     FROM qps_comments c
     JOIN qps_posts p ON c.post_id = p.id
     LEFT JOIN users u ON c.owner_id = u.id
     WHERE p.is_active = 1 AND p.is_public = 1
     ORDER BY c.created_at DESC LIMIT ?`,
    [limit],
  );
  return res.rows as unknown as CommentWithPost[];
}
