import { toast } from "@/hooks/use-toast";
import { apiFetch } from "./fetch";
import { ApiResponse, UploadResponse } from "./types";

export async function uploadFile(file: File): Promise<string> {
  const formData = new FormData();
  formData.append("file", file);

  try {
    const response = await apiFetch<UploadResponse>("/api/upload", {
      method: "POST",
      body: formData,
      headers: {
        // 移除 Content-Type 让浏览器自动设置正确的 multipart/form-data
        "Content-Type": undefined,
      },
    });

    if (!response.data?.fileId) {
      throw new Error("上传失败：未获取到文件 ID");
    }

    return response.data.fileId;
  } catch (error) {
    throw error instanceof Error ? error : new Error("上传失败");
  }
}
