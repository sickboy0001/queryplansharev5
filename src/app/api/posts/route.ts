import { createPost, getPosts } from "@/service/qppost-service";
import { NextRequest, NextResponse } from "next/server";
import { validateQueryPlanXml } from "@/lib/utils/query-plan-validation";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const limit = parseInt(searchParams.get("limit") || "20");
  const offset = parseInt(searchParams.get("offset") || "0");

  try {
    const posts = await getPosts({ limit, offset });
    return NextResponse.json(posts);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();

    if (!data.query_plan_xml || !data.title) {
      return NextResponse.json(
        { error: "Title and XML are required" },
        { status: 400 },
      );
    }

    const validation = validateQueryPlanXml(data.query_plan_xml);
    if (!validation.valid) {
      return NextResponse.json({ error: validation.error }, { status: 400 });
    }

    const { id, editToken } = await createPost({
      title: data.title,
      query_plan_xml: data.query_plan_xml,
      comment_markdown: data.comment_markdown || "",
      is_public: data.is_public !== false,
      password: data.password,
    });

    return NextResponse.json({ id, editToken }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
