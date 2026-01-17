import { NextRequest, NextResponse } from "next/server";
import {
  getRelayState,
  getAllRelayStates,
  getRoomRelayStates,
  testConnection,
} from "@/lib/database";

/**
 * GET /api/relay-control
 * Fetch relay states from database
 *
 * Query Parameters:
 * - relayId: Optional, specific relay ID (e.g., "bedroom_light")
 * - roomId: Optional, all relays in a room
 * If no parameters, returns all relay states
 */
export async function GET(request: NextRequest) {
  try {
    if (!(await testConnection())) {
      return NextResponse.json(
        { error: "Database connection failed" },
        { status: 500 },
      );
    }

    const { searchParams } = request.nextUrl;
    const relayId = searchParams.get("relayId");
    const roomId = searchParams.get("roomId");

    let relayStates: any[] = [];

    if (relayId) {
      // Get specific relay
      const relayState = await getRelayState(relayId);
      relayStates = relayState ? [relayState] : [];
    } else if (roomId) {
      // Get all relays for a room
      relayStates = await getRoomRelayStates(roomId);
    } else {
      // Get all relays
      relayStates = await getAllRelayStates();
    }

    const transformedData = relayStates.map((record: any) => ({
      id: record.id,
      roomId: record.room_id,
      relayType: record.relay_type,
      state: record.state,
      timestamp:
        typeof record.timestamp === "string"
          ? record.timestamp
          : (record.timestamp as Date).toISOString(),
      updatedAt:
        typeof record.updated_at === "string"
          ? record.updated_at
          : (record.updated_at as Date).toISOString(),
    }));

    return NextResponse.json({
      data: transformedData,
      count: transformedData.length,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("Relay control GET error:", message);
    return NextResponse.json(
      { error: "Failed to fetch relay states", details: message },
      { status: 500 },
    );
  }
}

/**
 * POST /api/relay-control
 * Control a relay state (set on/off)
 *
 * Request body:
 * {
 *   "relayId": "bedroom_light",
 *   "state": true
 * }
 */
export async function POST(request: NextRequest) {
  try {
    if (!(await testConnection())) {
      return NextResponse.json(
        { error: "Database connection failed" },
        { status: 500 },
      );
    }

    const body = await request.json();
    const { relayId, state } = body;

    if (!relayId || typeof state !== "boolean") {
      return NextResponse.json(
        { error: "Missing or invalid required parameters: relayId, state" },
        { status: 400 },
      );
    }

    // For now, this endpoint stores the desired state in DB
    // The actual Firebase control would be done by client-side code
    // This is a placeholder for future automation logic

    return NextResponse.json({
      message: "Relay control request received",
      relayId,
      state,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("Relay control POST error:", message);
    return NextResponse.json(
      { error: "Failed to control relay", details: message },
      { status: 500 },
    );
  }
}
