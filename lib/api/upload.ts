import { FileInfo } from "../types/upload";

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
    const response = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });

    const result = await response.json();
    return result.data.data.fileInfo as FileInfo;
  } catch (error) {
    console.error("文件上传失败:", error);
    throw error instanceof Error ? error : new Error("上传失败");
  }
}
