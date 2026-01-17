import { NextRequest, NextResponse } from "next/server";
import { ref, get } from "firebase/database";
import { getFirebaseDatabase } from "@/lib/firebase";
import {
  batchInsertRoomSensorData,
  batchInsertPZEMData,
  upsertRoom,
  testConnection,
} from "@/lib/database";

/**
 * Check if device is online and data is recent
 */
async function isDeviceOnline(): Promise<boolean> {
  try {
    const db = getFirebaseDatabase();
    const statusSnapshot = await get(ref(db, "system/status"));
    return statusSnapshot.exists() && statusSnapshot.val() === "online";
  } catch {
    return false;
  }
}

/**
 * Check if timestamp is recent (within last 2 minutes)
 */
function isTimestampRecent(timestamp: string | number): boolean {
  const ts = new Date(timestamp).getTime();
  const now = Date.now();
  const twoMinutes = 2 * 60 * 1000;
  return now - ts < twoMinutes;
}

/**
 * GET /api/sync-firebase - Health check
 */
export async function GET() {
  try {
    const isConnected = await testConnection();
    return NextResponse.json({
      status: "ok",
      database: isConnected ? "connected" : "disconnected",
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    return NextResponse.json({
      status: "error",
      error: error instanceof Error ? error.message : "Unknown",
    }, { status: 500 });
  }
}

/**
 * POST /api/sync-firebase - Sync data from Firebase to database
 * Only stores data if device is online and timestamp is recent
 */
export async function POST(request: NextRequest) {
  try {
    // Validate API key
    const apiKey = request.headers.get("x-api-key");
    if (process.env.SYNC_API_KEY && apiKey !== process.env.SYNC_API_KEY) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!(await testConnection())) {
      return NextResponse.json({ error: "Database unavailable" }, { status: 503 });
    }

    // Check device status
    const online = await isDeviceOnline();
    if (!online) {
      return NextResponse.json({
        success: false,
        message: "Device offline - data not stored",
        synced: [],
      });
    }

    // Ensure rooms exist
    await Promise.all([
      upsertRoom("bedroom", "Bedroom", 1, "residential"),
      upsertRoom("living_room", "Living Room", 1, "residential"),
    ]);

    const db = getFirebaseDatabase();
    const synced: string[] = [];

    // Fetch and store bedroom sensor data
    const bedroomSnap = await get(ref(db, "sensors/bedroom"));
    if (bedroomSnap.exists()) {
      const data = bedroomSnap.val();
      if (isTimestampRecent(data.updatedAt)) {
        await batchInsertRoomSensorData([{
          room_id: "bedroom",
          temperature: data.temperature,
          humidity: data.humidity,
          light: data.light,
          motion: data.motion,
          timestamp: new Date(data.updatedAt),
        }]);
        synced.push("bedroom");
      }
    }

    // Fetch and store living room sensor data
    const livingRoomSnap = await get(ref(db, "sensors/living_room"));
    if (livingRoomSnap.exists()) {
      const data = livingRoomSnap.val();
      if (isTimestampRecent(data.updatedAt)) {
        await batchInsertRoomSensorData([{
          room_id: "living_room",
          temperature: data.temperature,
          humidity: data.humidity,
          light: data.light,
          motion: data.motion,
          timestamp: new Date(data.updatedAt),
        }]);
        synced.push("living_room");
      }
    }

    // Fetch and store PZEM data
    const pzemSnap = await get(ref(db, "home/pzem"));
    if (pzemSnap.exists()) {
      const data = pzemSnap.val();
      if (isTimestampRecent(data.updatedAt)) {
        await batchInsertPZEMData([{
          current: data.current,
          voltage: data.voltage,
          power: data.power,
          energy: data.energy,
          frequency: data.frequency,
          pf: data.pf,
          timestamp: new Date(data.updatedAt),
        }]);
        synced.push("pzem");
      }
    }

    return NextResponse.json({
      success: true,
      synced,
      count: synced.length,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Sync error:", error);
    return NextResponse.json({
      error: error instanceof Error ? error.message : "Unknown",
    }, { status: 500 });
  }
}
