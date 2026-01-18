import { NextRequest, NextResponse } from "next/server";
import { getHistoricalRoomSensorData, testConnection } from "@/lib/database";

export const dynamic = "force-dynamic";
export const revalidate = 0;

/**
 * GET /api/historical-data
 * Retrieve historical room sensor data from database
 * Query parameters:
 *   - startDate: ISO string (required)
 *   - endDate: ISO string (required)
 *   - roomIds: comma-separated room IDs (optional)
 *   - aggregation: "raw" or "hourly" (optional, default: "raw")
 */
export async function GET(request: NextRequest) {
  const startTime = Date.now();

  try {
    // Check database connection
    console.log("[API] Checking database connection...");
    if (!(await testConnection())) {
      console.error("[API] Database connection failed");
      return NextResponse.json(
        { error: "Database unavailable", success: false, data: [] },
        { status: 503 },
      );
    }

    const { searchParams } = request.nextUrl;
    const startDateStr = searchParams.get("startDate");
    const endDateStr = searchParams.get("endDate");
    const roomIdsStr = searchParams.get("roomIds");
    const aggregation = (searchParams.get("aggregation") || "raw") as
      | "raw"
      | "hourly";

    console.log("[API] Request params:", {
      startDate: startDateStr,
      endDate: endDateStr,
      roomIds: roomIdsStr,
      aggregation,
    });

    // Validate required parameters
    if (!startDateStr || !endDateStr) {
      return NextResponse.json(
        {
          error: "Missing required parameters: startDate and endDate",
          success: false,
          data: [],
        },
        { status: 400 },
      );
    }

    // Parse dates
    const startDate = new Date(startDateStr);
    const endDate = new Date(endDateStr);

    // Validate date format
    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      return NextResponse.json(
        {
          error: "Invalid date format. Use ISO 8601 format.",
          success: false,
          data: [],
        },
        { status: 400 },
      );
    }

    // Parse room IDs if provided
    const roomIds = roomIdsStr
      ? roomIdsStr
          .split(",")
          .map((id) => id.trim())
          .filter((id) => id)
      : undefined;

    console.log("[API] Fetching historical data...");

    // Fetch historical data
    const data = await getHistoricalRoomSensorData(
      startDate,
      endDate,
      roomIds,
      aggregation,
    );

    console.log(
      `[API] Retrieved ${data.length} records in ${Date.now() - startTime}ms`,
    );

    // Format response
    const formattedData = data.map((row: HistoricalRoomSensorData) => ({
      timestamp: row.timestamp,
      roomId: row.roomId,
      roomName: row.roomName,
      temperature:
        row.temperature !== undefined ? Number(row.temperature) : undefined,
      humidity: row.humidity !== undefined ? Number(row.humidity) : undefined,
      light: row.light !== undefined ? Number(row.light) : undefined,
      motion: Boolean(row.motion),
    }));

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
    console.error("[API] Historical data fetch error:", error);
    console.error(
      "[API] Error stack:",
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
