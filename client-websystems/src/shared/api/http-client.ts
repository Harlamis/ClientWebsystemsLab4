const BASE_URL = (import.meta as ImportMeta & { env: { VITE_API_URL: string } })
  .env.VITE_API_URL;

export async function http<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const token = localStorage.getItem("session:token");
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      errorData.message || `HTTP ${response.status}: ${response.statusText}`,
    );
  }

  return response.json() as Promise<T>;
}
