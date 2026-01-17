import { NextRequest, NextResponse } from "next/server";
import {
  fetchRoomSensor,
  fetchPZEMData,
} from "@/lib/firebase-sensors";
import {
  batchInsertRoomSensorData,
  batchInsertPZEMData,
  upsertRoom,
  testConnection,
} from "@/lib/database";

/**
 * Validate API key from request header
 */
function validateApiKey(request: NextRequest): boolean {
  const apiKey = request.headers.get("x-api-key");
  const expectedKey = process.env.SYNC_API_KEY;

  // Skip validation if no key is configured (development only)
  if (!expectedKey) return true;

  return apiKey === expectedKey;
}

/**
 * GET /api/sync-firebase
 * Health check endpoint
 */
export async function GET() {
  try {
    const isConnected = await testConnection();
    return NextResponse.json(
      {
        status: "ok",
        database: isConnected ? "connected" : "disconnected",
        timestamp: new Date().toISOString(),
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Health check error:", error);
    return NextResponse.json(
      {
        status: "error",
        database: "error",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

/**
 * POST /api/sync-firebase
 * Sync data from Firebase to database
 * Expected to be called by external cron jobs
 * Required header: x-api-key (if SYNC_API_KEY is configured)
 */
export async function POST(request: NextRequest) {
  try {
    // Validate API key
    if (!validateApiKey(request)) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Check database connection
    if (!(await testConnection())) {
      return NextResponse.json(
        { success: false, error: "Database unavailable", synced: [], count: 0 },
        { status: 503 }
      );
    }

    // Ensure rooms exist
    await Promise.all([
      upsertRoom("bedroom", "Bedroom", 1, "residential"),
      upsertRoom("living_room", "Living Room", 1, "residential"),
    ]);

    // Fetch data from Firebase
    const [bedroomData, livingRoomData, pzemData] = await Promise.all([
      fetchRoomSensor("bedroom"),
      fetchRoomSensor("living_room"),
      fetchPZEMData(),
    ]);

    const synced: string[] = [];

    // Store bedroom sensor data
    if (bedroomData) {
      await batchInsertRoomSensorData([
        {
          room_id: "bedroom",
          temperature: bedroomData.temperature,
          humidity: bedroomData.humidity,
          light: bedroomData.light,
          motion: bedroomData.motion,
          timestamp: new Date(bedroomData.updatedAt),
        },
      ]);
      synced.push("bedroom_sensor");
    }

    // Store living room sensor data
    if (livingRoomData) {
      await batchInsertRoomSensorData([
        {
          room_id: "living_room",
          temperature: livingRoomData.temperature,
          humidity: livingRoomData.humidity,
          light: livingRoomData.light,
          motion: livingRoomData.motion,
          timestamp: new Date(livingRoomData.updatedAt),
        },
      ]);
      synced.push("living_room_sensor");
    }

    // Store PZEM data
    if (pzemData) {
      await batchInsertPZEMData([
        {
          current: pzemData.current,
          voltage: pzemData.voltage,
          power: pzemData.power,
          energy: pzemData.energy,
          frequency: pzemData.frequency,
          pf: pzemData.pf,
          timestamp: new Date(pzemData.updatedAt),
        },
      ]);
      synced.push("pzem_data");
    }

    return NextResponse.json(
      {
        success: true,
        synced,
        count: synced.length,
        timestamp: new Date().toISOString(),
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Sync error:", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { success: false, error: message, synced: [], count: 0 },
      { status: 500 }
    );
  }
}
