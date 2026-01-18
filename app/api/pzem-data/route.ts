import { NextResponse } from "next/server";
import {
  getAllRecentPZEMData,
  getLatestPZEMReading,
  testConnection,
} from "@/lib/database";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  try {
    if (!(await testConnection())) {
      return NextResponse.json(
        { error: "Database unavailable", success: false, data: [] },
        { status: 503 },
      );
    }

    const data = await getAllRecentPZEMData();

    const formattedData = data.map((row: HistoricalPZEMData) => ({
      timestamp: String(row.timestamp),
      current: Number(row.current) || 0,
      voltage: Number(row.voltage) || 0,
      power: Number(row.power) || 0,
      energy: Number(row.energy) || 0,
      frequency: Number(row.frequency) || 0,
      pf: Number(row.pf) || 0,
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
      timestamp: String(latest.timestamp),
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
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { error: "Failed to fetch data", details: message },
      { status: 500 },
    );
  }
}
