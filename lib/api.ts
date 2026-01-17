async function apiRequest<T>(endpoint: string, options: FetchOptions = {}): Promise<T> {
  const response = await fetch(endpoint, {
    method: options.method || "GET",
    headers: { "Content-Type": "application/json", ...options.headers },
    ...options,
  });
  if (!response.ok) throw new Error(`API error: ${response.status} ${response.statusText}`);
  const result = await response.json();
  if (result.error) throw new Error(result.error);
  return result;
}

export async function syncFirebaseData(): Promise<{ synced: number; rooms: number; timestamp: string }> {
  return apiRequest("/api/sync-firebase", { method: "POST" });
}
