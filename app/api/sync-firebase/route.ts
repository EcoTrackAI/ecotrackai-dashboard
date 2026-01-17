import { NextRequest, NextResponse } from "next/server";
import { fetchRoomSensor, fetchPZEMData } from "@/lib/firebase-sensors";
import {
  batchInsertRoomSensorData,
  batchInsertPZEMData,
  upsertRoom,
  testConnection,
} from "@/lib/database";

/**
 * POST /api/sync-firebase
 * Fetches current sensor data from Firebase and stores it in PostgreSQL
 */
export async function POST(request: NextRequest) {
  try {
    if (!(await testConnection())) {
      return NextResponse.json(
        { error: "Database connection failed" },
        { status: 500 },
      );
    }

    // Ensure rooms exist
    await upsertRoom("bedroom", "Bedroom", 1, "residential");
    await upsertRoom("living_room", "Living Room", 1, "residential");

    let syncedCount = 0;

    // Fetch and store bedroom sensor data
    const bedroomData = await fetchRoomSensor("bedroom");
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
      syncedCount++;
    }

    // Fetch and store living room sensor data
    const livingRoomData = await fetchRoomSensor("living_room");
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
      syncedCount++;
    }

    // Fetch and store PZEM power meter data
    const pzemData = await fetchPZEMData();
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
      syncedCount++;
    }

    return NextResponse.json({
      message: "Successfully synced data",
      synced: syncedCount,
      details: {
        bedroom: !!bedroomData,
        living_room: !!livingRoomData,
        pzem: !!pzemData,
      },
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("Sync error:", message);
    return NextResponse.json(
      { error: "Failed to sync data", details: message },
      { status: 500 },
    );
  }
}

/**
 * GET /api/sync-firebase
 * Returns sync status information
 */
export async function GET(request: NextRequest) {
  try {
    const isConnected = await testConnection();

    return NextResponse.json({
      databaseConnected: isConnected,
      message: isConnected
        ? "Database connection successful. Use POST to sync data."
        : "Database connection failed. Check your configuration.",
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: "Failed to check connection",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
