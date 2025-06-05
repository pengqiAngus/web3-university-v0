import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  // const { username, title, description, avatar } = await request.json();

  // TODO: 实现更新用户资料的逻辑
  return NextResponse.json({
    code: 200,
    message: "success",
    data: { success: true },
  });
}
