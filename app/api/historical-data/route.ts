import { NextRequest, NextResponse } from "next/server";
import { getHistoricalRoomSensorData, testConnection } from "@/lib/database";

export async function GET(request: NextRequest) {
  if (!(await testConnection())) {
    return NextResponse.json({ error: "DB unavailable" }, { status: 503 });
  }

  const { searchParams } = request.nextUrl;
  const start = searchParams.get("startDate");
  const end = searchParams.get("endDate");

  if (!start || !end) {
    return NextResponse.json({ error: "Missing dates" }, { status: 400 });
  }

  const startDate = new Date(start);
  const endDate = new Date(end);

  if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
    return NextResponse.json({ error: "Invalid dates" }, { status: 400 });
  }

  const roomIds = searchParams.get("roomIds")?.split(",").map(r => r.trim());
  const agg = (searchParams.get("aggregation") || "raw") as "raw" | "hourly";

  const data = await getHistoricalRoomSensorData(startDate, endDate, roomIds, agg);

  return NextResponse.json({
    data: data.map((r: any) => ({
      timestamp: typeof r.timestamp === "string" ? r.timestamp : r.timestamp.toISOString(),
      roomId: r.roomId,
      roomName: r.roomName,
      temperature: Number(r.temperature) || undefined,
      humidity: Number(r.humidity) || undefined,
      light: Number(r.light) || undefined,
      motion: Boolean(r.motion),
    })),
  });
}
