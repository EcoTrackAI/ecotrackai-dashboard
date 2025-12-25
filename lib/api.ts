import { API_CONFIG } from "./constants";

/**
 * Fetch historical energy data from the backend API
 */
export async function fetchHistoricalData(
  startDate: Date,
  endDate: Date,
  roomIds?: string[]
): Promise<HistoricalDataPoint[]> {
  try {
    const params = new URLSearchParams({
      start: startDate.toISOString(),
      end: endDate.toISOString(),
    });

    if (roomIds && roomIds.length > 0) {
      params.append("rooms", roomIds.join(","));
    }

    const response = await fetch(
      `${API_CONFIG.baseUrl}/history/energy?${params.toString()}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error(`API error: ${response.status} ${response.statusText}`);
    }

    const result: HistoricalDataApiResponse = await response.json();

    if (!result.success) {
      throw new Error(result.error || "Failed to fetch historical data");
    }

    return result.data;
  } catch (error) {
    console.error("Error fetching historical data:", error);
    throw error;
  }
}

/**
 * Fetch available rooms from the backend API
 */
export async function fetchRooms(): Promise<RoomOption[]> {
  try {
    const response = await fetch(`${API_CONFIG.baseUrl}/rooms`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status} ${response.statusText}`);
    }

    const result = await response.json();

    if (!result.success) {
      throw new Error(result.error || "Failed to fetch rooms");
    }

    return result.data;
  } catch (error) {
    console.error("Error fetching rooms:", error);
    throw error;
  }
}

/**
 * Generate mock historical data for development/testing
 * Remove this when backend API is ready
 */
export function generateMockHistoricalData(
  startDate: Date,
  endDate: Date,
  rooms: RoomOption[]
): HistoricalDataPoint[] {
  const data: HistoricalDataPoint[] = [];
  const hoursInRange =
    Math.abs(endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60);
  const intervalHours = Math.max(1, Math.floor(hoursInRange / 100)); // Max 100 data points

  for (let i = 0; i < hoursInRange; i += intervalHours) {
    const timestamp = new Date(startDate.getTime() + i * 60 * 60 * 1000);

    rooms.forEach((room) => {
      // Generate realistic-looking data based on time of day
      const hour = timestamp.getHours();
      const isNightTime = hour < 6 || hour > 22;
      const basePower = isNightTime ? 100 : 500;
      const variation = Math.random() * 200;

      data.push({
        timestamp: timestamp.toISOString(),
        roomId: room.id,
        roomName: room.name,
        power: basePower + variation,
        energy: (basePower + variation) * intervalHours * 0.001, // Convert to kWh
        temperature: 20 + Math.random() * 5,
        humidity: 40 + Math.random() * 20,
      });
    });
  }

  return data;
}

/**
 * Generate mock rooms for development/testing
 * Remove this when backend API is ready
 */
export function generateMockRooms(): RoomOption[] {
  return [
    { id: "living-room", name: "Living Room", type: "Common Area" },
    { id: "bedroom-1", name: "Bedroom 1", type: "Bedroom" },
    { id: "bedroom-2", name: "Bedroom 2", type: "Bedroom" },
    { id: "kitchen", name: "Kitchen", type: "Kitchen" },
    { id: "bathroom", name: "Bathroom", type: "Bathroom" },
    { id: "office", name: "Home Office", type: "Office" },
  ];
}
