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
  console.log("options", options);

  const url = new URL(`api/${path}`, baseURL);
  
  // 根据请求体类型设置 Content-Type
  const headers = new Headers(options.headers);
  if (!headers.has('Content-Type')) {
    if (options.body instanceof FormData) {
      // FormData 不需要设置 Content-Type，浏览器会自动设置正确的 boundary
    } else if (typeof options.body === 'string') {
      headers.set('Content-Type', 'application/json');
    }
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (!response.ok) {
    throw new Error(`API request failed: ${response.statusText}`);
  }

  return response.json();
}
