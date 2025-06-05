import { NextRequest, NextResponse } from "next/server";
import { fetchApi } from "@/lib/api";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;
    if (!file) {
      return NextResponse.json(
        { code: 400, message: "No file provided", data: null },
        { status: 400 }
      );
    }

    const formDataForLambda = new FormData();
    formDataForLambda.append("file", file);

    const response = await fetchApi("upload", {
      method: "POST",
      body: formDataForLambda,
    });
    return NextResponse.json({
      code: 200,
      message: "success",
      data: response,
    });
  } catch (error) {
    console.error("文件上传失败:", error);
    return NextResponse.json(
      { code: 500, message: "File upload failed", data: null },
      { status: 500 }
    );
  }
}
