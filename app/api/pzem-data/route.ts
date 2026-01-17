import { NextRequest, NextResponse } from "next/server";
import { getHistoricalPZEMData, testConnection } from "@/lib/database";

/**
 * GET /api/pzem-data
 * Fetches historical PZEM power meter data from PostgreSQL
 *
 * Query Parameters:
 * - startDate: ISO date string (required)
 * - endDate: ISO date string (required)
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

    const aggregation = (searchParams.get("aggregation") || "raw") as
      | "raw"
      | "hourly";

    const data = await getHistoricalPZEMData(startDate, endDate, aggregation);

    const transformedData = data.map((record: any) => ({
      timestamp:
        typeof record.timestamp === "string"
          ? record.timestamp
          : (record.timestamp as Date).toISOString(),
      current: Number(record.current) || 0,
      voltage: Number(record.voltage) || 0,
      power: Number(record.power) || 0,
      energy: Number(record.energy) || 0,
      frequency: Number(record.frequency) || 0,
      pf: Number(record.pf) || 0,
    }));

    return NextResponse.json({
      data: transformedData,
      count: transformedData.length,
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
      aggregation,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("PZEM data error:", message);
    return NextResponse.json(
      { error: "Failed to fetch PZEM data", details: message },
      { status: 500 },
    );
  }
}
