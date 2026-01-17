import { NextRequest, NextResponse } from "next/server";
import {
  getHistoricalPZEMData,
  getLatestPZEMReading,
  testConnection,
} from "@/lib/database";

/**
 * GET /api/pzem-data
 * Retrieve PZEM data from database
 * Query parameters:
 *   - startDate: ISO string (required)
 *   - endDate: ISO string (required)
 *   - aggregation: "raw" or "hourly" (optional, default: "raw")
 */
export async function GET(request: NextRequest) {
  try {
    // Check database connection
    if (!(await testConnection())) {
      return NextResponse.json(
        { error: "Database unavailable" },
        { status: 503 },
      );
    }

    const { searchParams } = request.nextUrl;
    const startDateStr = searchParams.get("startDate");
    const endDateStr = searchParams.get("endDate");
    const aggregation = (searchParams.get("aggregation") || "raw") as
      | "raw"
      | "hourly";

    // Validate required parameters
    if (!startDateStr || !endDateStr) {
      return NextResponse.json(
        { error: "Missing required parameters: startDate and endDate" },
        { status: 400 },
      );
    }

    // Parse dates
    const startDate = new Date(startDateStr);
    const endDate = new Date(endDateStr);

    // Validate date format
    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      return NextResponse.json(
        { error: "Invalid date format. Use ISO 8601 format." },
        { status: 400 },
      );
    }

    // Fetch historical data
    const data = await getHistoricalPZEMData(startDate, endDate, aggregation);

    // Format response
    const formattedData = data.map((row: HistoricalPZEMData) => ({
      timestamp: row.timestamp,
      current: Number(row.current) || 0,
      voltage: Number(row.voltage) || 0,
      power: Number(row.power) || 0,
      energy: Number(row.energy) || 0,
      frequency: Number(row.frequency) || 0,
      pf: Number(row.pf) || 0,
    }));

    return NextResponse.json(
      { success: true, count: formattedData.length, data: formattedData },
      { status: 200 },
    );
  } catch (error) {
    console.error("PZEM data fetch error:", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { error: "Failed to fetch data", details: message },
      { status: 500 },
    );
  }
}

/**
 * POST /api/pzem-data (optional)
 * Get latest PZEM reading in JSON body
 */
export async function POST() {
  try {
    if (!(await testConnection())) {
      return NextResponse.json(
        { error: "Database unavailable" },
        { status: 503 },
      );
    }

    const latest = await getLatestPZEMReading();

    if (!latest) {
      return NextResponse.json(
        { success: true, data: null, message: "No data available" },
        { status: 200 },
      );
    }

    const formatted = {
      timestamp:
        typeof latest.timestamp === "string"
          ? latest.timestamp
          : latest.timestamp.toISOString(),
      current: Number(latest.current) || 0,
      voltage: Number(latest.voltage) || 0,
      power: Number(latest.power) || 0,
      energy: Number(latest.energy) || 0,
      frequency: Number(latest.frequency) || 0,
      pf: Number(latest.pf) || 0,
    };

    return NextResponse.json(
      { success: true, data: formatted },
      { status: 200 },
    );
  } catch (error) {
    console.error("Latest PZEM fetch error:", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { error: "Failed to fetch data", details: message },
      { status: 500 },
    );
  }
}
