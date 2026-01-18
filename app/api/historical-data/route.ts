import { NextRequest, NextResponse } from "next/server";
import { getAllRecentRoomSensorData, testConnection } from "@/lib/database";

export const dynamic = "force-dynamic";
export const revalidate = 0;

/**
 * GET /api/historical-data
 * Retrieve all recent room sensor data from database (last 90 days)
 * Frontend handles date filtering based on user selection
 */
export async function GET(request: NextRequest) {
  const startTime = Date.now();

  try {
    // Check database connection
    console.log("[API Historical] Checking database connection...");
    if (!(await testConnection())) {
      console.error("[API Historical] Database connection failed");
      return NextResponse.json(
        { error: "Database unavailable", success: false, data: [] },
        { status: 503 },
      );
    }

    console.log("[API Historical] Fetching all recent room sensor data...");

    // Fetch all recent data - let frontend handle date filtering
    const data = await getAllRecentRoomSensorData();

    console.log(
      `[API Historical] Retrieved ${data.length} records in ${Date.now() - startTime}ms`,
    );

    // Format response - database already filters to last 90 days
    // Convert timestamps to ISO strings for consistent serialization
    const formattedData = data.map((row: HistoricalRoomSensorData) => {
      let timestampStr: string;
      const timestamp: any = row.timestamp;
      if (timestamp instanceof Date) {
        timestampStr = timestamp.toISOString();
      } else if (typeof timestamp === "string") {
        // If it's already a string, keep it as is
        timestampStr = timestamp;
      } else {
        timestampStr = String(timestamp);
      }

      return {
        timestamp: timestampStr,
        roomId: row.roomId,
        roomName: row.roomName,
        temperature:
          row.temperature !== undefined ? Number(row.temperature) : undefined,
        humidity:
          row.humidity !== undefined ? Number(row.humidity) : undefined,
        light: row.light !== undefined ? Number(row.light) : undefined,
        motion: Boolean(row.motion),
      };
    });

    return NextResponse.json(
      { success: true, count: formattedData.length, data: formattedData },
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
    console.error("[API Historical] Data fetch error:", error);
    console.error(
      "[API Historical] Error stack:",
      error instanceof Error ? error.stack : "N/A",
    );
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      {
        error: "Failed to fetch data",
        details: message,
        success: false,
        data: [],
      },
      { status: 500 },
    );
  }
}
