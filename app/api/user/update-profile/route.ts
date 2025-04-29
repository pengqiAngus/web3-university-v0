import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  // const { username, title, description, avatar } = await request.json();

  // TODO: 实现更新用户资料的逻辑
  return new Response(JSON.stringify({ success: true }), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  });
}
