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
    // Test database connection first
    const isConnected = await testConnection();
    if (!isConnected) {
      return NextResponse.json(
        { error: "Database connection failed" },
        { status: 500 }
      );
    }

    // Fetch current sensor data from Firebase
    const sensors = await fetchSensorData();

    if (!sensors || sensors.length === 0) {
      return NextResponse.json(
        { message: "No sensor data available in Firebase", synced: 0 },
        { status: 200 }
      );
    }

    // Extract unique rooms and upsert them
    const roomsSet = new Set<string>();
    sensors.forEach((sensor) => {
      if (sensor.room) {
        roomsSet.add(sensor.room);
      }
    });

    // Upsert rooms into database
    for (const roomId of roomsSet) {
      // Convert room ID to a friendly name (capitalize and add spaces)
      const roomName = roomId
        .split("-")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");

      await upsertRoom(roomId, roomName);
    }

    // Prepare sensor data records for batch insert
    const records = sensors.map((sensor) => ({
      sensor_id: sensor.id,
      sensor_name: sensor.sensorName,
      room_id: sensor.room || "unknown",
      category: sensor.category || "system",
      current_value:
        typeof sensor.currentValue === "string"
          ? parseFloat(sensor.currentValue) || 0
          : sensor.currentValue,
      unit: sensor.unit,
      status: sensor.status,
      description: sensor.description,
      timestamp: sensor.lastUpdate ? new Date(sensor.lastUpdate) : new Date(),
    }));

    // Batch insert sensor data
    await batchInsertSensorData(records);

    return NextResponse.json(
      {
        message: "Successfully synced Firebase data to PostgreSQL",
        synced: records.length,
        rooms: roomsSet.size,
        timestamp: new Date().toISOString(),
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error syncing Firebase to PostgreSQL:", error);
    return NextResponse.json(
      {
        error: "Failed to sync data",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
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
      { status: 500 }
    );
  }
}
