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
    const status = statusSnapshot.exists() ? statusSnapshot.val() : null;
    console.log("[Sync] Device status:", status);
    return status === "online";
  } catch (error) {
    console.error("[Sync] Error checking device status:", error);
    return false;
  }
}

/**
 * Check if timestamp is recent (within last 5 minutes)
 */
function isTimestampRecent(timestamp: string | number): boolean {
  const ts = new Date(timestamp).getTime();
  const now = Date.now();
  const fiveMinutes = 5 * 60 * 1000;
  const isRecent = now - ts < fiveMinutes;
  console.log("[Sync] Timestamp check:", {
    timestamp: new Date(timestamp).toISOString(),
    now: new Date(now).toISOString(),
    ageMinutes: Math.floor((now - ts) / 60000),
    isRecent,
  });
  return isRecent;
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
    console.log("[Sync] === Starting sync process ===");
    
    // Validate API key
    const apiKey = request.headers.get("x-api-key");
    if (process.env.SYNC_API_KEY && apiKey !== process.env.SYNC_API_KEY) {
      console.log("[Sync] Unauthorized: Invalid API key");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!(await testConnection())) {
      console.log("[Sync] Database unavailable");
      return NextResponse.json({ error: "Database unavailable" }, { status: 503 });
    }

    // Check device status - STRICT CHECK
    const online = await isDeviceOnline();
    if (!online) {
      console.log("[Sync] ❌ Device is OFFLINE - Skipping data storage");
      return NextResponse.json({
        success: false,
        message: "Device offline - data not stored",
        synced: [],
        deviceOnline: false,
      });
    }
    
    console.log("[Sync] ✓ Device is ONLINE - Proceeding with data storage");

    // Ensure rooms exist
    await Promise.all([
      upsertRoom("bedroom", "Bedroom", 1, "residential"),
      upsertRoom("living_room", "Living Room", 1, "residential"),
    ]);

    const db = getFirebaseDatabase();
    const synced: string[] = [];
    const skipped: string[] = [];

    // Fetch and store bedroom sensor data
    console.log("[Sync] Checking bedroom sensor...");
    const bedroomSnap = await get(ref(db, "sensors/bedroom"));
    if (bedroomSnap.exists()) {
      const data = bedroomSnap.val();
      console.log("[Sync] Bedroom data:", { updatedAt: data.updatedAt, temp: data.temperature });
      
      if (data.updatedAt && isTimestampRecent(data.updatedAt)) {
        await batchInsertRoomSensorData([{
          room_id: "bedroom",
          temperature: data.temperature,
          humidity: data.humidity,
          light: data.light,
          motion: data.motion,
          timestamp: new Date(data.updatedAt),
        }]);
        synced.push("bedroom");
        console.log("[Sync] ✓ Bedroom data stored");
      } else {
        skipped.push("bedroom (stale timestamp)");
        console.log("[Sync] ⊘ Bedroom data skipped - timestamp too old");
      }
    } else {
      skipped.push("bedroom (no data)");
      console.log("[Sync] ⊘ Bedroom data not found in Firebase");
    }

    // Fetch and store living room sensor data
    console.log("[Sync] Checking living room sensor...");
    const livingRoomSnap = await get(ref(db, "sensors/living_room"));
    if (livingRoomSnap.exists()) {
      const data = livingRoomSnap.val();
      console.log("[Sync] Living room data:", { updatedAt: data.updatedAt, temp: data.temperature });
      
      if (data.updatedAt && isTimestampRecent(data.updatedAt)) {
        await batchInsertRoomSensorData([{
          room_id: "living_room",
          temperature: data.temperature,
          humidity: data.humidity,
          light: data.light,
          motion: data.motion,
          timestamp: new Date(data.updatedAt),
        }]);
        synced.push("living_room");
        console.log("[Sync] ✓ Living room data stored");
      } else {
        skipped.push("living_room (stale timestamp)");
        console.log("[Sync] ⊘ Living room data skipped - timestamp too old");
      }
    } else {
      skipped.push("living_room (no data)");
      console.log("[Sync] ⊘ Living room data not found in Firebase");
    }

    // Fetch and store PZEM data
    console.log("[Sync] Checking PZEM data...");
    const pzemSnap = await get(ref(db, "home/pzem"));
    if (pzemSnap.exists()) {
      const data = pzemSnap.val();
      console.log("[Sync] PZEM data:", { updatedAt: data.updatedAt, power: data.power });
      
      if (data.updatedAt && isTimestampRecent(data.updatedAt)) {
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
        console.log("[Sync] ✓ PZEM data stored");
      } else {
        skipped.push("pzem (stale timestamp)");
        console.log("[Sync] ⊘ PZEM data skipped - timestamp too old");
      }
    } else {
      skipped.push("pzem (no data)");
      console.log("[Sync] ⊘ PZEM data not found in Firebase");
    }

    console.log("[Sync] === Sync complete ===", { synced, skipped });
    return NextResponse.json({
      success: true,
      synced,
      skipped,
      count: synced.length,
      deviceOnline: true,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Sync error:", error);
    return NextResponse.json({
      error: error instanceof Error ? error.message : "Unknown",
    }, { status: 500 });
  }
}
