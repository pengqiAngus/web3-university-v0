import { NextRequest, NextResponse } from "next/server";
import { type Course } from "@/lib/types/index";
import { fetchApi } from "@/lib/api/fetch";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
  try {
    const courseId = (await params).id;

    const course = await fetchApi<Course>(`course/detail/${courseId}`);

    return NextResponse.json({
      code: 200,
      message: "success",
      data: course,
    });
  } catch (error) {
    console.error("Failed to fetch course detail:", error);
    const isNotFound = error instanceof Error && error.message.includes("404");

    return NextResponse.json(
      {
        code: isNotFound ? 404 : 500,
        message: isNotFound ? "课程不存在" : "获取课程详情失败",
        data: null,
      },
      { status: isNotFound ? 404 : 500 }
    );
  }
}
