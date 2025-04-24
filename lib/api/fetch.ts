import { toast } from "@/hooks/use-toast";
import { ApiResponse } from "./types";

interface FetchOptions extends RequestInit {
  baseURL?: string;
}

export async function fetchApi<T>(
  path: string,
  options: FetchOptions = {}
): Promise<T> {
  const baseURL = process.env.NEXT_PUBLIC_API_URL;
  if (!baseURL) {
    throw new Error(
      "NEXT_PUBLIC_API_URL is not defined in environment variables"
    );
  }

  const url = new URL(`api/${path}`, baseURL);
  const response = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  if (!response.ok) {
    throw new Error(`API request failed: ${response.statusText}`);
  }

  return response.json();
}
