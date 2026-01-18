import { NextRequest, NextResponse } from "next/server";
import {
  getAllRecentPZEMData,
  getLatestPZEMReading,
  testConnection,
} from "@/lib/database";

export const dynamic = "force-dynamic";
export const revalidate = 0;

/**
 * GET /api/pzem-data
 * Retrieve all recent PZEM data from database (last 90 days)
 * Frontend handles date filtering based on user selection
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

    console.log("[API PZEM] Fetching all recent PZEM data...");

    // Fetch all recent data - let frontend handle date filtering
    const data = await getAllRecentPZEMData();

    console.log(
      `[API PZEM] Retrieved ${data.length} records in ${Date.now() - startTime}ms`,
    );

    // Format response - database already filters to last 90 days
    // Convert timestamps to ISO strings for consistent serialization
    const formattedData = data.map((row: HistoricalPZEMData) => {
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
        current: Number(row.current) || 0,
        voltage: Number(row.voltage) || 0,
        power: Number(row.power) || 0,
        energy: Number(row.energy) || 0,
        frequency: Number(row.frequency) || 0,
        pf: Number(row.pf) || 0,
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
