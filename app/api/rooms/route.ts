import { NextRequest, NextResponse } from "next/server";
import { getRooms, testConnection } from "@/lib/database";

export async function GET(request: NextRequest) {
  if (!(await testConnection())) {
    return NextResponse.json({ error: "DB unavailable" }, { status: 503 });
  }

  const rooms = await getRooms();
  return NextResponse.json({ rooms });
}
