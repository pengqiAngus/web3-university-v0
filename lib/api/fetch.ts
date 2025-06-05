import type { ApiResponse } from "@/lib/types/api";

interface FetchOptions extends RequestInit {
  baseURL?: string;
  token?: string;
}

export async function fetchApi<T>(
  path: string,
  options: FetchOptions = {}
): Promise<T> {
  const baseURL = options.baseURL || process.env.NEXT_PUBLIC_API_URL;
  if (!baseURL) {
    throw new Error(
      "NEXT_PUBLIC_API_URL is not defined in environment variables"
    );
  }
  const url = path.startsWith("http")
    ? path
    : new URL(`api/${path.replace(/^api\//, "")}`, baseURL).toString();
  const headers = new Headers(options.headers);
  if (!headers.has("Content-Type")) {
    if (options.body instanceof FormData) {
      // FormData 不需要设置 Content-Type
    } else if (typeof options.body === "string") {
      headers.set("Content-Type", "application/json");
    }
  }
  if (options.token) {
    const cleanToken = options.token.replace(/"/g, "");
    headers.set("Authorization", `Bearer ${cleanToken}`);
  }
  const response = await fetch(url, {
    ...options,
    headers,
  });
  let json: ApiResponse<T>;
  try {
    json = await response.json();
  } catch {
    throw new Error("Invalid JSON response");
  }
  if (!response.ok || json.code !== 200) {
    throw new Error(json.message || response.statusText);
  }
  return json.data as T;
}
