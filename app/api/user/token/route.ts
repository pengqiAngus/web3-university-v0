import { fetchApi } from "@/lib/api/fetch";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const { address, signature, nonce } = await request.json();
  try {
    const data = await fetchApi("user/login", {
      method: "POST",
      body: JSON.stringify({ address, signature, nonce }),
    });
    return NextResponse.json({
      code: 200,
      message: "success",
      data,
    });
  } catch (error) {
    return NextResponse.json({
      code: 500,
      message: "error",
      data: error,
    });
  }
}
