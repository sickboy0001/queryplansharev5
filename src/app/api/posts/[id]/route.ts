import { updatePost, getPostById, deletePost } from "@/service/qppost-service";
import { NextRequest, NextResponse } from "next/server";
import { verifyGuestEditCookie } from "@/lib/guest-auth";
import { auth } from "@/auth";
import { isAdminEmail } from "@/service/user-service";
import { validateQueryPlanXml } from "@/lib/utils/query-plan-validation";

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const body = await req.json();

    if (body.query_plan_xml) {
      const validation = validateQueryPlanXml(body.query_plan_xml);
      if (!validation.valid) {
        return NextResponse.json({ error: validation.error }, { status: 400 });
      }
    }

    // JWT Cookie を検証（ゲスト編集用）
    const guestPayload = await verifyGuestEditCookie(id);

    // 通常のセッション認証も併用
    const session = await auth();
    const isAdmin = isAdminEmail(session?.user?.email);
    const isOwner =
      session?.user?.id && (await getPostById(id)).owner_id === session.user.id;

    // ゲスト編集またはオーナーまたは管理者の場合のみ許可
    if (!guestPayload && !isAdmin && !isOwner) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await updatePost(id, body, guestPayload || undefined);

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json(
      { error: error.message || "Internal Server Error" },
      { status: error.message === "Unauthorized" ? 401 : 500 },
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const { searchParams } = new URL(req.url);
    const editToken = searchParams.get("editToken") || undefined;

    // JWT Cookie を検証（ゲスト編集用）
    const guestPayload = await verifyGuestEditCookie(id);

    // 通常のセッション認証も併用
    const session = await auth();
    const isAdmin = isAdminEmail(session?.user?.email);
    const isOwner =
      session?.user?.id && (await getPostById(id)).owner_id === session.user.id;

    // ゲスト編集またはオーナーまたは管理者の場合のみ許可
    if (!guestPayload && !isAdmin && !isOwner) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await deletePost(id, editToken, guestPayload || undefined);

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json(
      { error: error.message || "Internal Server Error" },
      { status: error.message === "Unauthorized" ? 401 : 500 },
    );
  }
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const post = await getPostById(id);
    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }
    return NextResponse.json(post);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
