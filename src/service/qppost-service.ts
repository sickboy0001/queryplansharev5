import { query } from "@/lib/db";
import { auth } from "@/auth";
import { v4 as uuidv4 } from "uuid";
import { generateShortId } from "@/lib/utils";
import { isAdminEmail } from "@/service/user-service";
import { nanoid } from "nanoid";
import bcrypt from "bcryptjs";

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

export type UnlistedLink = {
  id: string;
  post_id: string;
  expires_at: string;
  created_at: string;
};
// http://localhost:3000/qpposts/unlisted/Fq0JnIc7ZorD
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

  // If not owner, only public (is_public = 2) or if logged in, owner + public
  if (options.ownerId) {
    sql += " AND p.owner_id = ?";
    args.push(options.ownerId);

    // If viewing someone else's profile, only public
    if (userId !== options.ownerId) {
      sql += " AND p.is_public = 2";
    }
  } else {
    // General list
    if (!userId) {
      // Guest: only public
      sql += " AND p.is_public = 2";
    } else {
      // Logged in: public OR owner
      sql += " AND (p.is_public = 2 OR p.owner_id = ?)";
      args.push(userId);
    }
  }

  sql += " ORDER BY p.updated_at DESC LIMIT ? OFFSET ?";
  args.push(options.limit || 20, options.offset || 0);

  const res = await query(sql, args);
  return res.rows as unknown as Post[];
}

/**
 * Fetch all posts for admin (regardless of public/active status)
 */
export async function getAllPostsForAdmin() {
  const sql = `
    SELECT p.*, u.display_name as owner_name 
    FROM qps_posts p
    LEFT JOIN users u ON p.owner_id = u.id
    ORDER BY p.updated_at DESC
  `;
  const res = await query(sql, []);
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
  password?: string | null;
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

  const editTokenHash =
    owner_id || !data.password ? null : await bcrypt.hash(data.password, 10);

  await query(
    `INSERT INTO qps_posts (id, query_plan_xml, title, comment_markdown, owner_id, edit_token, is_public, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      id,
      data.query_plan_xml,
      data.title,
      data.comment_markdown,
      owner_id,
      editTokenHash,
      data.is_public ? 2 : 0, // 2: Public, 0: Private
      now,
      now,
    ],
  );

  return { id, editToken: data.password || null };
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
    query_plan_xml?: string;
    comment_markdown?: string;
    is_public?: number;
    is_active?: boolean;
    edit_token?: string;
  },
) {
  const session = await auth();
  const post = await getPostById(id);
  if (!post) throw new Error("Post not found");

  // Auth check
  const isAdmin = isAdminEmail(session?.user?.email);
  const isOwner = !!(
    session?.user?.id &&
    post.owner_id &&
    String(post.owner_id) === String(session.user.id)
  );
  const isGuestWithToken = !!(
    post.edit_token &&
    data.edit_token &&
    (await bcrypt.compare(data.edit_token, post.edit_token))
  );

  if (!isAdmin && !isOwner && !isGuestWithToken) {
    throw new Error("Unauthorized");
  }

  const updates: string[] = [];
  const args: any[] = [];

  if (data.title !== undefined) {
    updates.push("title = ?");
    args.push(data.title);
  }
  if (data.query_plan_xml !== undefined) {
    updates.push("query_plan_xml = ?");
    args.push(data.query_plan_xml);
  }
  if (data.comment_markdown !== undefined) {
    updates.push("comment_markdown = ?");
    args.push(data.comment_markdown);
  }
  if (data.is_public !== undefined) {
    updates.push("is_public = ?");
    args.push(data.is_public);
  }
  if (data.is_active !== undefined) {
    updates.push("is_active = ?");
    args.push(data.is_active ? 1 : 0);
  }

  // NOTE: edit_token は認証に使用するのみで、通常は更新しない
  // (もしパスワード変更機能を付ける場合はここで行うが、現状は上書きを防ぐ)

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
  const isOwner = !!(
    session?.user?.id &&
    post.owner_id &&
    String(post.owner_id) === String(session.user.id)
  );
  const isGuestWithToken = !!(
    post.edit_token &&
    editToken &&
    (await bcrypt.compare(editToken, post.edit_token))
  );

  if (!isAdmin && !isOwner && !isGuestWithToken) {
    throw new Error(
      `Unauthorized: isAdmin=${isAdmin}, isOwner=${isOwner}, isGuestWithToken=${isGuestWithToken}, sessionUid=${session?.user?.id}, postOwnerId=${post.owner_id}`,
    );
  }

  // Delete comments first due to potential foreign keys (if any)
  await query("DELETE FROM qps_comments WHERE post_id = ?", [id]);
  // Delete the post
  await query("DELETE FROM qps_posts WHERE id = ?", [id]);
}

/**
 * Unlisted Link operations
 */

export async function getUnlistedLinkByPostId(postId: string) {
  const res = await query(
    "SELECT * FROM qps_unlisted_links WHERE post_id = ?",
    [postId],
  );
  return (res.rows[0] as unknown as UnlistedLink) || null;
}

export async function getUnlistedLinkByToken(token: string) {
  const res = await query("SELECT * FROM qps_unlisted_links WHERE id = ?", [
    token,
  ]);
  return (res.rows[0] as unknown as UnlistedLink) || null;
}

export async function createUnlistedLink(postId: string, hours: number) {
  const id = nanoid(12);
  const expiresAt = new Date(Date.now() + hours * 60 * 60 * 1000).toISOString();
  const now = new Date().toISOString();

  await query(
    "INSERT INTO qps_unlisted_links (id, post_id, expires_at, created_at) VALUES (?, ?, ?, ?)",
    [id, postId, expiresAt, now],
  );

  return { id, post_id: postId, expires_at: expiresAt, created_at: now };
}

export async function deleteUnlistedLinkByPostId(postId: string) {
  await query("DELETE FROM qps_unlisted_links WHERE post_id = ?", [postId]);
}

export async function updateUnlistedLinkExpiry(token: string, days: number) {
  const link = await getUnlistedLinkByToken(token);
  if (!link) throw new Error("Link not found");

  const currentExpiry = new Date(link.expires_at).getTime();
  const newExpiry = new Date(
    currentExpiry + days * 24 * 60 * 60 * 1000,
  ).toISOString();

  await query("UPDATE qps_unlisted_links SET expires_at = ? WHERE id = ?", [
    newExpiry,
    token,
  ]);
}

export async function resetUnlistedLinkExpiry(token: string, hours: number) {
  const newExpiry = new Date(Date.now() + hours * 60 * 60 * 1000).toISOString();
  await query("UPDATE qps_unlisted_links SET expires_at = ? WHERE id = ?", [
    newExpiry,
    token,
  ]);
}
