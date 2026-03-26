import { NextRequest, NextResponse } from "next/server";
import { getPostById } from "@/service/qppost-service";
import bcrypt from "bcryptjs";
import { createGuestEditCookie } from "@/lib/guest-auth";

export async function POST(req: NextRequest) {
  try {
    const { postId, password } = await req.json();

    if (!postId || !password) {
      return NextResponse.json(
        { error: "Post ID and password are required" },
        { status: 400 },
      );
    }

    const post = await getPostById(postId);
    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    // ゲスト投稿でパスワードが設定されているか確認
    if (!post.edit_token) {
      return NextResponse.json(
        { error: "This post does not require password authentication" },
        { status: 400 },
      );
    }

    // パスワード検証
    const isMatch = await bcrypt.compare(password, post.edit_token);
    if (!isMatch) {
      return NextResponse.json({ error: "Invalid password" }, { status: 401 });
    }

    // JWT Cookie を発行
    await createGuestEditCookie(postId);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Guest auth error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
