import { createComment, getComments } from "@/service/comments-service";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const commentsRaw = await getComments(id);
    const comments = JSON.parse(JSON.stringify(commentsRaw));
    return NextResponse.json(comments);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const { commentMarkdown } = await req.json();

    if (!commentMarkdown) {
      return NextResponse.json(
        { error: "Comment is required" },
        { status: 400 },
      );
    }

    await createComment(id, commentMarkdown);

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
