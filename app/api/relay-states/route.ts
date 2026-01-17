import { NextRequest, NextResponse } from "next/server";
import {
  getAllRelayStates,
  getRoomRelayStates,
  getRelayState,
  testConnection,
} from "@/lib/database";

/**
 * GET /api/relay-states
 * Retrieve relay states from database
 * Query parameters:
 *   - relayId: specific relay ID (optional)
 *   - roomId: filter by room (optional)
 */
export async function GET(request: NextRequest) {
  try {
    // Check database connection
    if (!(await testConnection())) {
      return NextResponse.json(
        { error: "Database unavailable" },
        { status: 503 },
      );
    }

    const { searchParams } = request.nextUrl;
    const relayId = searchParams.get("relayId");
    const roomId = searchParams.get("roomId");

    let relays: RelayStateRecord[] = [];

    if (relayId) {
      // Get specific relay
      const relay = await getRelayState(relayId);
      relays = relay ? [relay] : [];
    } else if (roomId) {
      // Get relays for specific room
      relays = await getRoomRelayStates(roomId);
    } else {
      // Get all relays
      relays = await getAllRelayStates();
    }

    // Format response
    const formattedRelays = relays.map((r) => ({
      id: r.id,
      roomId: r.room_id,
      type: r.relay_type,
      state: r.state,
      updatedAt:
        typeof r.updated_at === "string"
          ? r.updated_at
          : r.updated_at?.toISOString(),
    }));

    return NextResponse.json(
      { success: true, count: formattedRelays.length, data: formattedRelays },
      {
        status: 200,
        headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate, max-age=0",
          Pragma: "no-cache",
          Expires: "0",
        },
      },
    );
  } catch (error) {
    console.error("Relay states fetch error:", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { error: "Failed to fetch relay states", details: message },
      { status: 500 },
    );
  }
}
