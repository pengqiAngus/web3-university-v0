import { FileInfo } from "../types/upload";
import { fetchApi } from "./fetch";

export interface FileInfoData {
  url: string;
  size: number;
  mimetype: string;
  filename: string;
}

export function createTempFileUrl(file: File): string {
  return URL.createObjectURL(file);
}

export async function uploadFile(file: File): Promise<FileInfo> {
  const formData = new FormData();
  formData.append("file", file);
  try {
    const fileInfo = await fetchApi<FileInfo>("upload", {
      method: "POST",
      body: formData,
    });
    return fileInfo;
  } catch (error) {
    console.error("文件上传失败:", error);
    throw error instanceof Error ? error : new Error("上传失败");
  }
}
