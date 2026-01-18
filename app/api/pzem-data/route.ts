import { NextRequest, NextResponse } from "next/server";
import {
  getHistoricalPZEMData,
  getLatestPZEMReading,
  testConnection,
} from "@/lib/database";

export const dynamic = "force-dynamic";
export const revalidate = 0;

/**
 * GET /api/pzem-data
 * Retrieve PZEM data from database
 * Query parameters:
 *   - startDate: ISO string (required)
 *   - endDate: ISO string (required)
 *   - aggregation: "raw" or "hourly" (optional, default: "raw")
 */
export async function GET(request: NextRequest) {
  const startTime = Date.now();

  try {
    // Check database connection
    console.log("[API PZEM] Checking database connection...");
    if (!(await testConnection())) {
      console.error("[API PZEM] Database connection failed");
      return NextResponse.json(
        { error: "Database unavailable", success: false, data: [] },
        { status: 503 },
      );
    }

    const { searchParams } = request.nextUrl;
    const startDateStr = searchParams.get("startDate");
    const endDateStr = searchParams.get("endDate");
    const aggregation = (searchParams.get("aggregation") || "raw") as
      | "raw"
      | "hourly";

    console.log("[API PZEM] Request params:", {
      startDate: startDateStr,
      endDate: endDateStr,
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

    console.log("[API PZEM] Fetching PZEM data...");

    // Fetch historical data
    const data = await getHistoricalPZEMData(startDate, endDate, aggregation);

    console.log(
      `[API PZEM] Retrieved ${data.length} records in ${Date.now() - startTime}ms`,
    );

    // Format and filter response - only include recent valid data
    // This prevents stale data that was saved before validation was implemented
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const sevenDaysAgoMs = sevenDaysAgo.getTime();

    const formattedData = data
      .map((row: HistoricalPZEMData) => ({
        timestamp: row.timestamp,
        current: Number(row.current) || 0,
        voltage: Number(row.voltage) || 0,
        power: Number(row.power) || 0,
        energy: Number(row.energy) || 0,
        frequency: Number(row.frequency) || 0,
        pf: Number(row.pf) || 0,
      }))
      .filter((item) => {
        // Ensure timestamp is valid
        const ts = new Date(item.timestamp).getTime();
        if (isNaN(ts)) return false;

        // Only include data from the last 7 days
        // Filter out stale/archived data from before validation
        return ts >= sevenDaysAgoMs;
      });

    console.log(
      `[API PZEM] Filtered to ${formattedData.length} recent valid records`,
    );

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
    console.error("[API PZEM] PZEM data fetch error:", error);
    console.error(
      "[API PZEM] Error stack:",
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
    console.error("Latest PZEM fetch error:", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { error: "Failed to fetch data", details: message },
      { status: 500 },
    );
  }
}
