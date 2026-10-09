import { useAuthStore } from '../stores/auth.ts';

const BASE_URL = import.meta.env.VITE_API_URL;

export async function http<T>(path: string, options: RequestInit = {}, isRetry = false): Promise<T> {
  const authStore = useAuthStore();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (authStore.token) {
    headers['Authorization'] = `Bearer ${authStore.token}`;
  }

  const response = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers,
  });

  if (response.status === 401 && !isRetry && authStore.refreshToken) {
    const refreshed = await authStore.refreshTokens();
    if (refreshed) {
      return http<T>(path, options, true);
    } else {
      authStore.logout();
      throw new Error('Сесія завершилася');
    }
  }

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
  }

  return response.json() as Promise<T>;
}