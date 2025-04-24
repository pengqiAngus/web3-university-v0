interface FileInfo {
  id?: string;
  size?: number;
  title?: string;
  mimetype?: string;
}

interface Course {
  id: number;
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

export type { Course };
