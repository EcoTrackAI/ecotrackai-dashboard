export type RelayRoom = "bedroom" | "living_room";

export interface RelayDecisionResponse {
  room: string;
  motion: number;
  relay_state: boolean;
  timestamp: string;
}

const AUTO_CONTROL_API_BASE_URL =
  process.env.NEXT_PUBLIC_ML_API_BASE_URL ||
  "https://backend-v4-0.onrender.com";

export async function fetchRelayDecision(
  room: RelayRoom,
  motion: number,
): Promise<RelayDecisionResponse> {
  const params = new URLSearchParams({
    room,
    motion: String(motion),
  });

  const url = `${AUTO_CONTROL_API_BASE_URL}/relay?${params.toString()}`;
  let response = await fetch(url, {
    method: "POST",
    cache: "no-store",
  });

  if (!response.ok && response.status === 405) {
    response = await fetch(url, {
      method: "GET",
      cache: "no-store",
    });
  }

  if (!response.ok) {
    throw new Error(`Failed to fetch relay decision (${response.status})`);
  }

  const data = (await response.json()) as Partial<RelayDecisionResponse>;

  if (
    typeof data.room !== "string" ||
    typeof data.motion !== "number" ||
    typeof data.relay_state !== "boolean" ||
    typeof data.timestamp !== "string"
  ) {
    throw new Error("Relay decision response has an invalid shape");
  }

  return {
    room: data.room,
    motion: data.motion,
    relay_state: data.relay_state,
    timestamp: data.timestamp,
  };
}
