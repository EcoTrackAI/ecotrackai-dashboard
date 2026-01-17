import { NextRequest, NextResponse } from "next/server";
import { getHistoricalData, testConnection } from "@/lib/database";

/**
 * GET /api/historical-data
 * Fetches historical sensor data from PostgreSQL
 *
 * Query Parameters:
 * - startDate: ISO date string (required)
 * - endDate: ISO date string (required)
 * - roomIds: Comma-separated list of room IDs (optional)
 * - aggregation: 'raw' or 'hourly' (optional, defaults to 'raw')
 */
export async function GET(request: NextRequest) {
  try {
    if (!(await testConnection())) {
      return NextResponse.json(
        { error: "Database connection failed" },
        { status: 500 },
      );
    }

    const { searchParams } = request.nextUrl;
    const startDateStr = searchParams.get("startDate");
    const endDateStr = searchParams.get("endDate");

    if (!startDateStr || !endDateStr) {
      return NextResponse.json(
        { error: "Missing required parameters: startDate and endDate" },
        { status: 400 },
      );
    }

    const startDate = new Date(startDateStr);
    const endDate = new Date(endDateStr);

    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      return NextResponse.json(
        { error: "Invalid date format" },
        { status: 400 },
      );
    }

    const roomIds = searchParams
      .get("roomIds")
      ?.split(",")
      .map((id) => id.trim());
    const aggregation = (searchParams.get("aggregation") || "raw") as
      | "raw"
      | "hourly";

    const data = await getHistoricalData(
      startDate,
      endDate,
      roomIds,
      aggregation,
    );

    const transformedData: HistoricalDataPoint[] = data.map((record: any) => ({
      timestamp:
        typeof record.timestamp === "string"
          ? record.timestamp
          : (record.timestamp as Date).toISOString(),
      roomId: record.roomId,
      roomName: record.roomName,
      temperature: Number(record.temperature) || undefined,
      humidity: Number(record.humidity) || undefined,
      light: Number(record.light) || undefined,
      motion: Boolean(record.motion),
    }));

    return NextResponse.json({
      data: transformedData,
      count: transformedData.length,
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
      roomIds: roomIds || "all",
      aggregation,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("Historical data error:", message);
    return NextResponse.json(
      { error: "Failed to fetch historical data", details: message },
      { status: 500 },
    );
  }
}
