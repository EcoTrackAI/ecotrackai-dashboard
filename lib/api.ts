/**
 * API Client Module
 * Centralized API calls for data fetching
 */

async function apiRequest<T>(
  endpoint: string,
  options: FetchOptions = {}
): Promise<T> {
  const response = await fetch(endpoint, {
    method: options.method || "GET",
    headers: { "Content-Type": "application/json", ...options.headers },
    ...options,
  });

  if (!response.ok) {
    throw new Error(`API error: ${response.status} ${response.statusText}`);
  }

  const result = await response.json();
  if (result.error) throw new Error(result.error);
  return result;
}

export async function fetchHistoricalData(
  startDate: Date,
  endDate: Date,
  roomIds?: string[]
): Promise<HistoricalDataPoint[]> {
  const params = new URLSearchParams({
    startDate: startDate.toISOString(),
    endDate: endDate.toISOString(),
  });

  if (roomIds?.length) params.append("roomIds", roomIds.join(","));

  const result = await apiRequest<{ data: HistoricalDataPoint[] }>(
    `/api/historical-data?${params}`
  );
  return result.data || [];
}

export async function fetchRooms(): Promise<RoomOption[]> {
  const result = await apiRequest<{ rooms: RoomOption[] }>("/api/rooms");
  return result.rooms || [];
}

export async function syncFirebaseData(): Promise<{
  synced: number;
  rooms: number;
  timestamp: string;
}> {
  return apiRequest("/api/sync-firebase", { method: "POST" });
}
