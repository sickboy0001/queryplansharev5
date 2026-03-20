import { query } from "@/lib/db";
import { auth } from "@/auth";
import { v4 as uuidv4 } from "uuid";
import { generateShortId } from "@/lib/utils";
import { isAdminEmail } from "@/service/user-service";

export type Post = {
  id: string;
  query_plan_xml: string;
  title: string;
  comment_markdown: string;
  owner_id: string | null;
  edit_token: string | null;
  is_active: number;
  is_public: number;
  created_at: string;
  updated_at: string;
  owner_name?: string;
};

export async function getPosts(
  options: {
    ownerId?: string;
    limit?: number;
    offset?: number;
  } = {},
) {
  const session = await auth();
  const userId = session?.user?.id;

  let sql = `
    SELECT p.*, u.display_name as owner_name 
    FROM qps_posts p
    LEFT JOIN users u ON p.owner_id = u.id
    WHERE p.is_active = 1
  `;
  const args: any[] = [];

  // If not owner, only public or if logged in, owner + public
  if (options.ownerId) {
    sql += " AND p.owner_id = ?";
    args.push(options.ownerId);

    // If viewing someone else's profile, only public
    if (userId !== options.ownerId) {
      sql += " AND p.is_public = 1";
    }
  } else {
    // General list
    if (!userId) {
      // Guest: only public
      sql += " AND p.is_public = 1";
    } else {
      // Logged in: public OR owner
      sql += " AND (p.is_public = 1 OR p.owner_id = ?)";
      args.push(userId);
    }
  }

  sql += " ORDER BY p.updated_at DESC LIMIT ? OFFSET ?";
  args.push(options.limit || 20, options.offset || 0);

  const res = await query(sql, args);
  return res.rows as unknown as Post[];
}

/**
 * Fetch all posts by a specific user, including inactive ones
 */
export async function getMyAllPosts(userId: string) {
  const sql = `
    SELECT p.*, u.display_name as owner_name 
    FROM qps_posts p
    LEFT JOIN users u ON p.owner_id = u.id
    WHERE p.owner_id = ?
    ORDER BY p.updated_at DESC
  `;
  const res = await query(sql, [userId]);
  return res.rows as unknown as Post[];
}

export async function createPost(data: {
  query_plan_xml: string;
  title: string;
  comment_markdown: string;
  is_public: boolean;
}) {
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

  const editToken = owner_id ? null : uuidv4();

  await query(
    `INSERT INTO qps_posts (id, query_plan_xml, title, comment_markdown, owner_id, edit_token, is_public, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      id,
      data.query_plan_xml,
      data.title,
      data.comment_markdown,
      owner_id,
      editToken,
      data.is_public ? 1 : 0,
      now,
      now,
    ],
  );

  return { id, editToken };
}

export async function getPostById(id: string) {
  const res = await query(
    `SELECT p.*, u.display_name as owner_name 
     FROM qps_posts p
     LEFT JOIN users u ON p.owner_id = u.id
     WHERE p.id = ?`,
    [id],
  );
  return (res.rows[0] as unknown as Post) || null;
}

export async function updatePost(
  id: string,
  data: {
    title?: string;
    comment_markdown?: string;
    is_public?: boolean;
    is_active?: boolean;
    edit_token?: string;
  },
) {
  const session = await auth();
  const post = await getPostById(id);
  if (!post) throw new Error("Post not found");

  // Auth check
  const isAdmin = isAdminEmail(session?.user?.email);
  const isOwner = session?.user?.id && post.owner_id === session.user.id;
  const isGuestWithToken =
    post.edit_token && post.edit_token === data.edit_token;

  if (!isAdmin && !isOwner && !isGuestWithToken) {
    throw new Error("Unauthorized");
  }

  const updates: string[] = [];
  const args: any[] = [];

  if (data.title !== undefined) {
    updates.push("title = ?");
    args.push(data.title);
  }
  if (data.comment_markdown !== undefined) {
    updates.push("comment_markdown = ?");
    args.push(data.comment_markdown);
  }
  if (data.is_public !== undefined) {
    updates.push("is_public = ?");
    args.push(data.is_public ? 1 : 0);
  }
  if (data.is_active !== undefined) {
    updates.push("is_active = ?");
    args.push(data.is_active ? 1 : 0);
  }

  if (updates.length === 0) return;

  const now = new Date().toISOString();
  updates.push("updated_at = ?");
  args.push(now);
  args.push(id);

  await query(`UPDATE qps_posts SET ${updates.join(", ")} WHERE id = ?`, args);
}

export async function deletePost(id: string, editToken?: string) {
  const session = await auth();
  const post = await getPostById(id);
  if (!post) throw new Error("Post not found");

  // Auth check
  const isAdmin = isAdminEmail(session?.user?.email);
  const isOwner = session?.user?.id && post.owner_id === session.user.id;
  const isGuestWithToken = post.edit_token && post.edit_token === editToken;

  if (!isAdmin && !isOwner && !isGuestWithToken) {
    throw new Error("Unauthorized");
  }

  // Delete comments first due to potential foreign keys (if any)
  await query("DELETE FROM qps_comments WHERE post_id = ?", [id]);
  // Delete the post
  await query("DELETE FROM qps_posts WHERE id = ?", [id]);
}
