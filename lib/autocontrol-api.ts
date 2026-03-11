const BASE_URL =
  process.env.NEXT_PUBLIC_AUTOCONTROL_API_BASE_URL ||
  "https://backend-v4-0.onrender.com";

export async function fetchLiveSensorData(
  room: string,
): Promise<AutoControlLiveData> {
  const res = await fetch(`${BASE_URL}/live/${room}`);
  if (!res.ok) throw new Error(`Failed to fetch live data for ${room}`);
  return res.json();
}

export async function fetchRelayState(
  room: string,
  motion: number,
): Promise<AutoControlRelayData> {
  const res = await fetch(
    `${BASE_URL}/relay?room=${encodeURIComponent(room)}&motion=${motion}`,
  );
  if (!res.ok) throw new Error(`Failed to fetch relay state for ${room}`);
  return res.json();
}

export async function fetchRecommendation(
  room: string,
): Promise<AutoControlRecommendation> {
  const res = await fetch(
    `${BASE_URL}/recommend?room=${encodeURIComponent(room)}`,
  );
  if (!res.ok) throw new Error(`Failed to fetch recommendation for ${room}`);
  return res.json();
}

export async function forceRelayState(
  room: string,
  state: "on" | "off",
): Promise<AutoControlForceRelay> {
  const res = await fetch(
    `${BASE_URL}/force-relay?room=${encodeURIComponent(room)}&state=${state}`,
  );
  if (!res.ok) throw new Error(`Failed to force relay for ${room}`);
  return res.json();
}
