import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    const { username, title, description, avatar } = await request.json();
}

