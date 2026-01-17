import { NextResponse } from "next/server";
import {
  testConnection,
  getLatestPZEMReading,
  getLatestRoomSensorReadings,
  getRooms,
} from "@/lib/database";

/**
 * GET /api/debug
 * Debug endpoint to check database content
 */
export async function GET() {
  try {
    const isConnected = await testConnection();

    if (!isConnected) {
      return NextResponse.json(
        {
          status: "error",
          message: "Database not connected",
        },
        { status: 503 },
      );
    }

    // Get database info
    const [rooms, latestPZEM, latestSensors] = await Promise.all([
      getRooms(),
      getLatestPZEMReading(),
      getLatestRoomSensorReadings(),
    ]);

    return NextResponse.json(
      {
        status: "connected",
        database: {
          rooms: {
            count: rooms.length,
            data: rooms,
          },
          pzem: {
            latest: latestPZEM,
            note: latestPZEM
              ? `Latest reading from ${latestPZEM.timestamp}`
              : "No data",
          },
          sensors: {
            count: latestSensors.length,
            latest: latestSensors.slice(0, 5),
            note:
              latestSensors.length > 0
                ? `Latest readings from ${latestSensors[0].timestamp}`
                : "No data",
          },
        },
        timestamp: new Date().toISOString(),
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Debug endpoint error:", error);
    return NextResponse.json(
      {
        status: "error",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
