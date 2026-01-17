import { NextRequest, NextResponse } from "next/server";
import { fetchRelayState } from "@/lib/firebase-relay";
import { upsertRelayState, testConnection } from "@/lib/database";

/**
 * POST /api/relay-sync
 * Fetches relay states from Firebase and stores them in PostgreSQL
 */
export async function POST(request: NextRequest) {
  try {
    if (!(await testConnection())) {
      return NextResponse.json(
        { error: "Database connection failed" },
        { status: 500 },
      );
    }

    let syncedCount = 0;
    const relays = [
      { id: "bedroom_light", roomId: "bedroom", type: "light" },
      { id: "living_room_light", roomId: "living_room", type: "light" },
    ];

    // Fetch and store relay states
    for (const relay of relays) {
      try {
        const state = await fetchRelayState(relay.id);
        if (state !== null) {
          await upsertRelayState(relay.id, relay.roomId, relay.type, state);
          syncedCount++;
        }
      } catch (error) {
        console.error(`Failed to sync relay ${relay.id}:`, error);
      }
    }

    return NextResponse.json({
      message: "Successfully synced relay states",
      synced: syncedCount,
      relaysCount: relays.length,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("Relay sync error:", message);
    return NextResponse.json(
      { error: "Failed to sync relay states", details: message },
      { status: 500 },
    );
  }
}

/**
 * GET /api/relay-sync
 * Returns relay sync status information
 */
export async function GET(request: NextRequest) {
  try {
    const isConnected = await testConnection();

    return NextResponse.json({
      status: isConnected ? "ok" : "error",
      message: isConnected ? "Relay sync ready" : "Database connection failed",
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { status: "error", message, details: message },
      { status: 500 },
    );
  }
}
