import { fetchApi } from "@/lib/api";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    const { id } = await request.json();
    const url = await fetchApi(`upload/get-temp-url?id=${id}`, {
        method: "GET",
    });
    return NextResponse.json({
        url,
    });
}
