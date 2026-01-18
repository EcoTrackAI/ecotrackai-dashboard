import { NextResponse } from "next/server";
import { getAllRecentRoomSensorData, testConnection } from "@/lib/database";

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

    const data = await getAllRecentRoomSensorData();

    const formattedData = data.map((row: HistoricalRoomSensorData) => ({
      timestamp: String(row.timestamp),
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
