import { query } from "@/lib/db";

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
