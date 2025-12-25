import { NextRequest, NextResponse } from "next/server";
import {
  getHistoricalData,
  getAggregatedHourlyData,
  testConnection,
} from "@/lib/database";

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
    // Test database connection
    const isConnected = await testConnection();
    if (!isConnected) {
      return NextResponse.json(
        { error: "Database connection failed" },
        { status: 500 }
      );
    }

    // Parse query parameters
    const searchParams = request.nextUrl.searchParams;
    const startDateStr = searchParams.get("startDate");
    const endDateStr = searchParams.get("endDate");
    const roomIdsStr = searchParams.get("roomIds");
    const aggregation = searchParams.get("aggregation") || "raw";

    // Validate required parameters
    if (!startDateStr || !endDateStr) {
      return NextResponse.json(
        { error: "Missing required parameters: startDate and endDate" },
        { status: 400 }
      );
    }

    // Parse dates
    const startDate = new Date(startDateStr);
    const endDate = new Date(endDateStr);

    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      return NextResponse.json(
        { error: "Invalid date format" },
        { status: 400 }
      );
    }

    // Parse room IDs
    const roomIds = roomIdsStr
      ? roomIdsStr.split(",").map((id) => id.trim())
      : undefined;

    // Fetch data based on aggregation type
    let data;
    if (aggregation === "hourly") {
      data = await getAggregatedHourlyData(startDate, endDate, roomIds);
    } else {
      data = await getHistoricalData(startDate, endDate, roomIds);
    }

    // Transform data to match frontend format
    const transformedData = data.map((record) => ({
      timestamp: record.timestamp.toISOString(),
      roomId: record.roomId,
      roomName: record.roomName,
      energy: Number(record.energy) || 0,
      power: Number(record.power) || 0,
      temperature: Number(record.temperature) || 0,
      humidity: Number(record.humidity) || 0,
      lighting: Number(record.lighting) || 0,
      motion: Number(record.motion) || 0,
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
    console.error("Error fetching historical data:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch historical data",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
