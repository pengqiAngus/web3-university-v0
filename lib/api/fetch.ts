import { toast } from "@/hooks/use-toast";
import { ApiResponse } from "./types";

export async function apiFetch<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
    const url = `${baseUrl}${endpoint}`;

    const response = await fetch(url, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "请求失败");
    }

    return { data: data as T };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "未知错误";
    toast({
      title: "错误",
      description: errorMessage,
      variant: "destructive",
    });
    return { error: errorMessage };
  }
}
