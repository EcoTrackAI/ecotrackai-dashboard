import { NextRequest, NextResponse } from "next/server";
import { getHistoricalPZEMData, testConnection } from "@/lib/database";

export async function GET(request: NextRequest) {
  if (!(await testConnection())) {
    return NextResponse.json({ error: "DB unavailable" }, { status: 503 });
  }

  const { searchParams } = request.nextUrl;
  const start = searchParams.get("startDate");
  const end = searchParams.get("endDate");
  const agg = (searchParams.get("aggregation") || "raw") as "raw" | "hourly";

  if (!start || !end) {
    return NextResponse.json({ error: "Missing dates" }, { status: 400 });
  }

  const startDate = new Date(start);
  const endDate = new Date(end);

  if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
    return NextResponse.json({ error: "Invalid dates" }, { status: 400 });
  }

  const data = await getHistoricalPZEMData(startDate, endDate, agg);

  return NextResponse.json({
    data: data.map((r: any) => ({
      timestamp: typeof r.timestamp === "string" ? r.timestamp : r.timestamp.toISOString(),
      current: Number(r.current) || 0,
      voltage: Number(r.voltage) || 0,
      power: Number(r.power) || 0,
      energy: Number(r.energy) || 0,
      frequency: Number(r.frequency) || 0,
      pf: Number(r.pf) || 0,
    })),
  });
}
