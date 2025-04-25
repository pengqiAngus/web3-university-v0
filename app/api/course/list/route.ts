import { NextResponse } from "next/server";
import { fetchApi } from "@/lib/api/fetch";
import { type Course } from "@/lib/types/index";

export async function GET() {
  try {
    const courses = await fetchApi<Course[]>("course/list");

    return NextResponse.json({
      code: 200,
      message: "success",
      data: courses,
    });
  } catch (error) {
    console.error("Failed to fetch courses:", error);
    return NextResponse.json(
      {
        code: 500,
        message: "获取课程列表失败",
        data: null,
      },
      { status: 500 }
    );
  }
}
