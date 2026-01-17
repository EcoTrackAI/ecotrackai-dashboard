import { NextRequest, NextResponse } from "next/server";
import { getAllRelayStates, getRoomRelayStates, getRelayState, testConnection } from "@/lib/database";

export async function GET(request: NextRequest) {
  if (!(await testConnection())) return NextResponse.json({ error: "DB unavailable" }, { status: 503 });
  
  const { searchParams } = request.nextUrl;
  const relayId = searchParams.get("relayId");
  const roomId = searchParams.get("roomId");
  
  let relays: any[] = [];
  if (relayId) {
    const relay = await getRelayState(relayId);
    relays = relay ? [relay] : [];
  } else if (roomId) {
    relays = await getRoomRelayStates(roomId);
  } else {
    relays = await getAllRelayStates();
  }
  
  return NextResponse.json({ data: relays.map((r) => ({id: r.id, roomId: r.room_id, type: r.relay_type, state: r.state})) });
}
