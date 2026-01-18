import { NextResponse } from "next/server";
import {
  testConnection,
  getLatestPZEMReading,
  getLatestRoomSensorReadings,
  getRooms,
  getRoomSensorCount,
  getPZEMDataCount,
} from "@/lib/database";

export const dynamic = "force-dynamic";
export const revalidate = 0;

/**
 * GET /api/debug
 * Debug endpoint to check database content and environment configuration
 */
export async function GET() {
  try {
    // Check environment configuration (don't expose sensitive values)
    const envCheck = {
      NODE_ENV: process.env.NODE_ENV,
      hasDatabaseUrl: !!process.env.DATABASE_URL,
      hasPostgresUrl: !!process.env.POSTGRES_URL,
      hasFirebaseConfig: !!(
        process.env.NEXT_PUBLIC_FIREBASE_API_KEY &&
        process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL
      ),
      databaseUrlPattern: process.env.DATABASE_URL
        ? process.env.DATABASE_URL.substring(0, 30) + "..."
        : "Not set",
    };

    const isConnected = await testConnection();

    if (!isConnected) {
      return NextResponse.json(
        {
          status: "error",
          message: "Database not connected",
          environment: envCheck,
          troubleshooting: {
            suggestions: [
              "Verify DATABASE_URL or POSTGRES_URL is set in environment variables",
              "Check if database accepts connections from your hosting IP",
              "Ensure connection string includes sslmode=require for cloud databases",
              "Check database server is running and accessible",
            ],
          },
        },
        { status: 503 },
      );
    }

    // Get database info
    const [rooms, latestPZEM, latestSensors, sensorCount, pzemCount] =
      await Promise.all([
        getRooms(),
        getLatestPZEMReading(),
        getLatestRoomSensorReadings(),
        getRoomSensorCount(),
        getPZEMDataCount(),
      ]);

    return NextResponse.json(
      {
        status: "connected",
        environment: envCheck,
        database: {
          rooms: {
            count: rooms.length,
            data: rooms,
          },
          pzem: {
            totalRecords: pzemCount,
            latest: latestPZEM,
            note: latestPZEM
              ? `Latest reading from ${latestPZEM.timestamp}`
              : "No PZEM data found. Run sync to populate.",
          },
          sensors: {
            totalRecords: sensorCount,
            count: latestSensors.length,
            latest: latestSensors.slice(0, 5),
            note:
              latestSensors.length > 0
                ? `Latest readings from ${latestSensors[0].timestamp}`
                : "No sensor data found. Run sync to populate.",
          },
        },
        timestamp: new Date().toISOString(),
      },
      {
        status: 200,
        headers: {
          "Cache-Control":
            "no-store, no-cache, must-revalidate, proxy-revalidate",
          Pragma: "no-cache",
          Expires: "0",
        },
      },
    );
  } catch (error) {
    console.error("Debug endpoint error:", error);
    return NextResponse.json(
      {
        status: "error",
        message: error instanceof Error ? error.message : "Unknown error",
        stack:
          process.env.NODE_ENV === "development" && error instanceof Error
            ? error.stack
            : undefined,
      },
      { status: 500 },
    );
  }
}
