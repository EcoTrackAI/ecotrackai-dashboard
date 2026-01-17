import { NextResponse } from "next/server";
import { fetchRelayState } from "@/lib/firebase-relay";
import { upsertRelayState, testConnection } from "@/lib/database";

/**
 * Relay configuration
 * Maps relay IDs to room IDs and types
 */
const RELAYS = [
  { id: "bedroom_light", roomId: "bedroom", type: "light" },
  { id: "bedroom_fan", roomId: "bedroom", type: "fan" },
  { id: "bedroom_ac", roomId: "bedroom", type: "ac" },
  { id: "living_room_light", roomId: "living_room", type: "light" },
  { id: "living_room_fan", roomId: "living_room", type: "fan" },
  { id: "living_room_ac", roomId: "living_room", type: "ac" },
];

/**
 * POST /api/relay-sync
 * Sync relay states from Firebase to database
 * Expected to be called by external cron jobs
 */
export async function POST() {
  try {
    // Check database connection
    if (!(await testConnection())) {
      return NextResponse.json(
        { error: "Database unavailable" },
        { status: 503 },
      );
    }

    // Sync all relay states from Firebase to database
    const results = await Promise.all(
      RELAYS.map(async (relay) => {
        try {
          const state = await fetchRelayState(relay.id);
          if (state !== null) {
            await upsertRelayState(relay.id, relay.roomId, relay.type, state);
          }
          return {
            relay: relay.id,
            state,
            synced: state !== null,
          };
        } catch (error) {
          console.error(`Error syncing relay ${relay.id}:`, error);
          return {
            relay: relay.id,
            state: null,
            synced: false,
            error: error instanceof Error ? error.message : "Unknown error",
          };
        }
      }),
    );

    return NextResponse.json(
      {
        success: true,
        synced: results.filter((r) => r.synced).length,
        total: results.length,
        results,
        timestamp: new Date().toISOString(),
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Relay sync error:", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { error: "Failed to sync relays", details: message },
      { status: 500 },
    );
  }
}
