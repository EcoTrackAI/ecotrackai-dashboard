import { NextResponse, NextRequest } from "next/server";
import {
  cleanupOldRoomSensorData,
  cleanupOldPZEMData,
  testConnection,
} from "@/lib/database";

function validateAuth(req: NextRequest): boolean {
  const apiKey = req.headers.get("x-api-key");
  const expected = process.env.SYNC_API_KEY;
  return !expected || apiKey === expected;
}

export async function POST(req: NextRequest) {
  try {
    if (!validateAuth(req))
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 },
      );
    if (!(await testConnection()))
      return NextResponse.json(
        { success: false, error: "DB unavailable" },
        { status: 503 },
      );

    const url = new URL(req.url);
    const days = parseInt(url.searchParams.get("days") || "90", 10);

    const [roomDeleted, pzemDeleted] = await Promise.all([
      cleanupOldRoomSensorData(days),
      cleanupOldPZEMData(days),
    ]);
    return NextResponse.json({
      success: true,
      deleted: { room_sensors: roomDeleted, pzem_data: pzemDeleted },
      days,
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}
