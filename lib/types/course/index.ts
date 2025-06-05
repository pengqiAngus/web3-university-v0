import type { FileInfo } from "@/lib/types/upload";

export interface Course {
  id: string;
  name: string;
  category: string;
  description: string;
  price: string;
  duration: number;
  imgInfo: FileInfo;
  fileInfo: FileInfo;
  imgUrl?: string;
  fileUrl?: string;
  createdAt: string;
  updatedAt: string;
}
