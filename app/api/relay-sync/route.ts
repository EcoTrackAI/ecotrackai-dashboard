import { NextRequest, NextResponse } from "next/server";
import { fetchRelayState } from "@/lib/firebase-relay";
import { upsertRelayState, testConnection } from "@/lib/database";

const RELAYS = [
  { id: "bedroom_light", roomId: "bedroom", type: "light" },
  { id: "living_room_light", roomId: "living_room", type: "light" },
];

export async function POST(request: NextRequest) {
  if (!(await testConnection())) return NextResponse.json({ error: "DB unavailable" }, { status: 503 });
  
  const results = await Promise.all(RELAYS.map(async (relay) => {
    const state = await fetchRelayState(relay.id);
    if (state !== null) await upsertRelayState(relay.id, relay.roomId, relay.type, state);
    return { relay: relay.id, state };
  }));
  
  return NextResponse.json({ synced: results });
}
