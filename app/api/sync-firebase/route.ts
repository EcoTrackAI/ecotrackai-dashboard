import { NextRequest, NextResponse } from "next/server";
import { ref, get } from "firebase/database";
import { getFirebaseDatabase } from "@/lib/firebase";
import {
  batchInsertRoomSensorData,
  batchInsertPZEMData,
  upsertRoom,
  testConnection,
} from "@/lib/database";

// Device online status threshold: 10 seconds
const DEVICE_HEARTBEAT_THRESHOLD_MS = 10000;

/**
 * Check if device is online by reading /devices/esp32-main
 * Device is considered online if:
 * 1. online === true
 * 2. lastSeen is within the threshold (10 seconds)
 */
async function checkDeviceOnline(): Promise<{
  online: boolean;
  lastSeen?: number;
  reason: string;
}> {
  try {
    const db = getFirebaseDatabase();
    const deviceSnapshot = await get(ref(db, "devices/esp32-main"));

    if (!deviceSnapshot.exists()) {
      return {
        online: false,
        reason: "Device record not found in Firebase",
      };
    }

    const device = deviceSnapshot.val();

    // Check if online flag is true
    if (device.online !== true) {
      console.log("[Sync] Device online flag is false:", device.online);
      return {
        online: false,
        reason: `Device online flag is ${device.online}`,
      };
    }

    // Validate lastSeen timestamp
    if (!device.lastSeen) {
      console.log("[Sync] Device missing lastSeen timestamp");
      return {
        online: false,
        reason: "Device missing lastSeen timestamp",
      };
    }

    const lastSeenTime = new Date(device.lastSeen).getTime();
    const now = Date.now();
    const ageMs = now - lastSeenTime;

    if (ageMs > DEVICE_HEARTBEAT_THRESHOLD_MS) {
      console.log("[Sync] Device heartbeat stale:", {
        lastSeen: device.lastSeen,
        ageSeconds: Math.floor(ageMs / 1000),
        thresholdSeconds: DEVICE_HEARTBEAT_THRESHOLD_MS / 1000,
      });
      return {
        online: false,
        lastSeen: ageMs,
        reason: `Device heartbeat stale (${Math.floor(ageMs / 1000)}s old)`,
      };
    }

    console.log("[Sync] ✓ Device is ONLINE:", {
      lastSeen: device.lastSeen,
      ageSeconds: Math.floor(ageMs / 1000),
    });

    return {
      online: true,
      lastSeen: ageMs,
      reason: "Device is online and responsive",
    };
  } catch (error) {
    console.error("[Sync] Error checking device status:", error);
    return {
      online: false,
      reason: `Error checking device status: ${error instanceof Error ? error.message : "unknown"}`,
    };
  }
}

/**
 * Check if sensor data timestamp is recent (within last 5 minutes)
 * This prevents storing stale data that was cached in Firebase
 */
function isDataTimestampRecent(timestamp: string | number | undefined): {
  recent: boolean;
  ageSeconds?: number;
} {
  if (!timestamp) {
    return { recent: false };
  }

  const ts = new Date(timestamp).getTime();
  if (isNaN(ts)) {
    console.log("[Sync] Invalid timestamp format:", timestamp);
    return { recent: false };
  }

  const now = Date.now();
  const fiveMinutesMs = 5 * 60 * 1000;
  const ageMs = now - ts;
  const ageSeconds = Math.floor(ageMs / 1000);

  const isRecent = ageMs < fiveMinutesMs;

  console.log("[Sync] Timestamp validation:", {
    timestamp,
    ageSeconds,
    maxAgeSeconds: Math.floor(fiveMinutesMs / 1000),
    recent: isRecent,
  });

  return { recent: isRecent, ageSeconds };
}

/**
 * GET /api/sync-firebase - Health check
 */
export async function GET() {
  try {
    const isConnected = await testConnection();
    const deviceStatus = await checkDeviceOnline();

    return NextResponse.json({
      status: "ok",
      database: isConnected ? "connected" : "disconnected",
      device: deviceStatus,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    return NextResponse.json(
      {
        status: "error",
        error: error instanceof Error ? error.message : "Unknown",
      },
      { status: 500 },
    );
  }
}

/**
 * POST /api/sync-firebase - Sync data from Firebase to database
 * Only stores data if device is ONLINE and timestamps are RECENT
 * Rejects writes if device is offline or data is stale
 */
export async function POST(request: NextRequest) {
  try {
    console.log("[Sync] === Starting sync process ===");

    // Validate API key if configured
    const apiKey = request.headers.get("x-api-key");
    if (process.env.SYNC_API_KEY && apiKey !== process.env.SYNC_API_KEY) {
      console.log("[Sync] Unauthorized: Invalid API key");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check database connectivity
    if (!(await testConnection())) {
      console.log("[Sync] Database unavailable");
      return NextResponse.json(
        {
          error: "Database unavailable",
          success: false,
          synced: [],
          skipped: [],
        },
        { status: 503 },
      );
    }

    // Check if device is online - STRICT VALIDATION
    const deviceStatus = await checkDeviceOnline();
    if (!deviceStatus.online) {
      console.log(`[Sync] ❌ ${deviceStatus.reason}`);
      return NextResponse.json({
        success: false,
        message: `Device offline - data not stored. ${deviceStatus.reason}`,
        synced: [],
        skipped: ["all (device offline)"],
        deviceOnline: false,
        timestamp: new Date().toISOString(),
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
    try {
      const bedroomSnap = await get(ref(db, "sensors/bedroom"));
      if (bedroomSnap.exists()) {
        const data = bedroomSnap.val();
        const { recent, ageSeconds } = isDataTimestampRecent(data.updatedAt);

        if (!data || typeof data !== "object") {
          skipped.push("bedroom (invalid data structure)");
          console.log("[Sync] ⊘ Bedroom data invalid");
        } else if (!recent) {
          skipped.push(`bedroom (data ${ageSeconds}s old)`);
          console.log(
            `[Sync] ⊘ Bedroom data skipped - too old (${ageSeconds}s)`,
          );
        } else {
          // Validate all required fields are present
          if (
            data.temperature !== undefined &&
            data.humidity !== undefined &&
            data.light !== undefined &&
            data.motion !== undefined &&
            data.updatedAt
          ) {
            await batchInsertRoomSensorData([
              {
                room_id: "bedroom",
                temperature: Number(data.temperature) || 0,
                humidity: Number(data.humidity) || 0,
                light: Number(data.light) || 0,
                motion: Boolean(data.motion),
                timestamp: new Date(data.updatedAt),
              },
            ]);
            synced.push("bedroom");
            console.log("[Sync] ✓ Bedroom data stored");
          } else {
            skipped.push("bedroom (missing fields)");
            console.log("[Sync] ⊘ Bedroom data missing required fields");
          }
        }
      } else {
        skipped.push("bedroom (no data in Firebase)");
        console.log("[Sync] ⊘ Bedroom data not found in Firebase");
      }
    } catch (error) {
      skipped.push(
        `bedroom (fetch error: ${error instanceof Error ? error.message : "unknown"})`,
      );
      console.error("[Sync] Error fetching bedroom data:", error);
    }

    // Fetch and store living room sensor data
    console.log("[Sync] Checking living room sensor...");
    try {
      const livingRoomSnap = await get(ref(db, "sensors/living_room"));
      if (livingRoomSnap.exists()) {
        const data = livingRoomSnap.val();
        const { recent, ageSeconds } = isDataTimestampRecent(data.updatedAt);

        if (!data || typeof data !== "object") {
          skipped.push("living_room (invalid data structure)");
          console.log("[Sync] ⊘ Living room data invalid");
        } else if (!recent) {
          skipped.push(`living_room (data ${ageSeconds}s old)`);
          console.log(
            `[Sync] ⊘ Living room data skipped - too old (${ageSeconds}s)`,
          );
        } else {
          // Validate all required fields are present
          if (
            data.temperature !== undefined &&
            data.humidity !== undefined &&
            data.light !== undefined &&
            data.motion !== undefined &&
            data.updatedAt
          ) {
            await batchInsertRoomSensorData([
              {
                room_id: "living_room",
                temperature: Number(data.temperature) || 0,
                humidity: Number(data.humidity) || 0,
                light: Number(data.light) || 0,
                motion: Boolean(data.motion),
                timestamp: new Date(data.updatedAt),
              },
            ]);
            synced.push("living_room");
            console.log("[Sync] ✓ Living room data stored");
          } else {
            skipped.push("living_room (missing fields)");
            console.log("[Sync] ⊘ Living room data missing required fields");
          }
        }
      } else {
        skipped.push("living_room (no data in Firebase)");
        console.log("[Sync] ⊘ Living room data not found in Firebase");
      }
    } catch (error) {
      skipped.push(
        `living_room (fetch error: ${error instanceof Error ? error.message : "unknown"})`,
      );
      console.error("[Sync] Error fetching living room data:", error);
    }

    // Fetch and store PZEM data
    console.log("[Sync] Checking PZEM data...");
    try {
      const pzemSnap = await get(ref(db, "home/pzem"));
      if (pzemSnap.exists()) {
        const data = pzemSnap.val();
        const { recent, ageSeconds } = isDataTimestampRecent(data.updatedAt);

        if (!data || typeof data !== "object") {
          skipped.push("pzem (invalid data structure)");
          console.log("[Sync] ⊘ PZEM data invalid");
        } else if (!recent) {
          skipped.push(`pzem (data ${ageSeconds}s old)`);
          console.log(`[Sync] ⊘ PZEM data skipped - too old (${ageSeconds}s)`);
        } else {
          // Validate all required fields are present
          if (
            data.current !== undefined &&
            data.voltage !== undefined &&
            data.power !== undefined &&
            data.energy !== undefined &&
            data.frequency !== undefined &&
            data.pf !== undefined &&
            data.updatedAt
          ) {
            await batchInsertPZEMData([
              {
                current: Number(data.current) || 0,
                voltage: Number(data.voltage) || 0,
                power: Number(data.power) || 0,
                energy: Number(data.energy) || 0,
                frequency: Number(data.frequency) || 0,
                pf: Number(data.pf) || 0,
                timestamp: new Date(data.updatedAt),
              },
            ]);
            synced.push("pzem");
            console.log("[Sync] ✓ PZEM data stored");
          } else {
            skipped.push("pzem (missing fields)");
            console.log("[Sync] ⊘ PZEM data missing required fields");
          }
        }
      } else {
        skipped.push("pzem (no data in Firebase)");
        console.log("[Sync] ⊘ PZEM data not found in Firebase");
      }
    } catch (error) {
      skipped.push(
        `pzem (fetch error: ${error instanceof Error ? error.message : "unknown"})`,
      );
      console.error("[Sync] Error fetching PZEM data:", error);
    }

    console.log("[Sync] === Sync complete ===", {
      synced: synced.length,
      skipped: skipped.length,
      items: { synced, skipped },
    });

    return NextResponse.json({
      success: true,
      synced,
      skipped,
      count: synced.length,
      deviceOnline: true,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("[Sync] Sync error:", error);
    return NextResponse.json(
      {
        error: "Sync failed",
        details: error instanceof Error ? error.message : "Unknown error",
        success: false,
        synced: [],
        skipped: [],
      },
      { status: 500 },
    );
  }
}
