import { fetchApi } from "@/lib/api";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    const data = await request.json();
    const user = await fetchApi(`user/profile`, {
        method: "POST",
        body: JSON.stringify(data),
    });
    return NextResponse.json(user);
}
