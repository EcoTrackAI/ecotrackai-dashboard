import { NextResponse } from "next/server";
import { getRooms, testConnection } from "@/lib/database";

/**
 * GET /api/rooms
 * Retrieve all rooms from database
 */
export async function GET() {
  try {
    // Check database connection
    if (!(await testConnection())) {
      return NextResponse.json(
        { error: "Database unavailable" },
        { status: 503 },
      );
    }

    const rooms = await getRooms();

    // Format response
    const formattedRooms = rooms.map((r) => ({
      id: r.id,
      name: r.name,
      floor: r.floor,
      type: r.type,
      updatedAt:
        typeof r.updated_at === "string"
          ? r.updated_at
          : r.updated_at?.toISOString(),
    }));

    return NextResponse.json(
      { success: true, count: formattedRooms.length, data: formattedRooms },
      { status: 200 },
    );
  } catch (error) {
    console.error("Rooms fetch error:", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { error: "Failed to fetch rooms", details: message },
      { status: 500 },
    );
  }
}
