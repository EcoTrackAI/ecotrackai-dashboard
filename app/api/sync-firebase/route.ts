import { NextRequest, NextResponse } from "next/server";
import { fetchSensorData } from "@/lib/firebase-sensors";
import {
  batchInsertSensorData,
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

    const sensors = await fetchSensorData();

    if (!sensors?.length) {
      return NextResponse.json(
        { message: "No sensor data available", synced: 0 },
        { status: 200 },
      );
    }

    // Ensure "unknown" room exists for sensors without a room assignment
    await upsertRoom("unknown", "Unknown", 0, "utility");

    const roomsSet = new Set(
      sensors
        .map((s) => s.room)
        .filter((room): room is string => Boolean(room)),
    );

    for (const roomId of roomsSet) {
      const roomName = roomId
        .split("-")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
      await upsertRoom(roomId, roomName);
    }

    const records = sensors.map((sensor) => ({
      sensor_id: sensor.id,
      sensor_name: sensor.sensorName,
      room_id: sensor.room || "unknown",
      category: sensor.category || "system",
      current_value: parseFloat(String(sensor.currentValue)) || 0,
      unit: sensor.unit,
      status: sensor.status,
      description: sensor.description,
      timestamp: sensor.lastUpdate ? new Date(sensor.lastUpdate) : new Date(),
    }));

    await batchInsertSensorData(records);

    return NextResponse.json({
      message: "Successfully synced data",
      synced: records.length,
      rooms: roomsSet.size,
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
