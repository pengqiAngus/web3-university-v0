export interface ApiResponse<T> {
  code: number;
  message: string;
  data: T;
}

export interface UploadResponse {
  fileId: string;
  url: string;
  size: number;
  mimetype: string;
}
