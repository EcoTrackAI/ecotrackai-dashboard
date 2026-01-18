async function apiRequest<T>(
  endpoint: string,
  options: FetchOptions = {},
): Promise<T> {
  const maxRetries = 3;
  const retryDelay = 1000; // 1 second

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      const response = await fetch(endpoint, {
        method: options.method || "GET",
        headers: { "Content-Type": "application/json", ...options.headers },
        ...options,
      });

      if (!response.ok) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const _errorText = await response.text();

        // Don't retry on client errors (4xx), only on server errors (5xx)
        if (response.status < 500) {
          throw new Error(
            `API error: ${response.status} ${response.statusText}`,
          );
        }

        // Retry on server errors
        if (attempt < maxRetries - 1) {
          await new Promise((resolve) =>
            setTimeout(resolve, retryDelay * (attempt + 1)),
          );
          continue;
        }
        throw new Error(`API error: ${response.status} ${response.statusText}`);
      }

      const result = await response.json();
      if (result.error) throw new Error(result.error);
      return result;
    } catch (error) {
      // Network errors or parsing errors
      if (attempt < maxRetries - 1) {
        await new Promise((resolve) =>
          setTimeout(resolve, retryDelay * (attempt + 1)),
        );
        continue;
      }
      throw error;
    }
  }

  throw new Error("Max retries exceeded");
}

export async function syncFirebaseData(): Promise<{
  synced: number;
  rooms: number;
  timestamp: string;
}> {
  return apiRequest("/api/sync-firebase", { method: "POST" });
}
