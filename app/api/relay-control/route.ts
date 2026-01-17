import { NextRequest, NextResponse } from "next/server";
import { upsertRelayState, getRelayState, testConnection } from "@/lib/database";
import { setRelayState } from "@/lib/firebase-relay";

/**
 * POST /api/relay-control
 * Control a relay (send command to Firebase and store state in database)
 * Request body:
 *   - relayId: string (required)
 *   - roomId: string (required)
 *   - type: string (required) - relay type
 *   - state: boolean (required) - desired state
 */
export async function POST(request: NextRequest) {
  try {
    // Check database connection
    if (!(await testConnection())) {
      return NextResponse.json(
        { error: "Database unavailable" },
        { status: 503 }
      );
    }

    const body = await request.json();
    const { relayId, roomId, type, state } = body;

    // Validate required fields
    if (!relayId || !roomId || type === undefined || state === undefined) {
      return NextResponse.json(
        {
          error: "Missing required fields: relayId, roomId, type, state",
        },
        { status: 400 }
      );
    }

    // Validate state is boolean
    if (typeof state !== "boolean") {
      return NextResponse.json(
        { error: "state must be a boolean" },
        { status: 400 }
      );
    }

    // Send command to Firebase
    await setRelayState(relayId, state);

    // Store state in database
    await upsertRelayState(relayId, roomId, type, state);

    // Get updated state
    const updatedRelay = await getRelayState(relayId);

    return NextResponse.json(
      {
        success: true,
        message: `Relay ${relayId} set to ${state ? "ON" : "OFF"}`,
        relay: updatedRelay
          ? {
              id: updatedRelay.id,
              roomId: updatedRelay.room_id,
              type: updatedRelay.relay_type,
              state: updatedRelay.state,
              updatedAt:
                typeof updatedRelay.updated_at === "string"
                  ? updatedRelay.updated_at
                  : updatedRelay.updated_at?.toISOString(),
            }
          : null,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Relay control error:", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { error: "Failed to control relay", details: message },
      { status: 500 }
    );
  }
}
