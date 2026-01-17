import { NextRequest, NextResponse } from "next/server";
import { getRooms, testConnection } from "@/lib/database";

/**
 * GET /api/rooms
 * Fetches all rooms from PostgreSQL
 */
export async function GET(request: NextRequest) {
  try {
    // Test database connection
    const isConnected = await testConnection();
    if (!isConnected) {
      return NextResponse.json(
        { error: "Database connection failed" },
        { status: 500 },
      );
    }

    // Fetch rooms
    const rooms = await getRooms();

    // Transform to match frontend format
    const transformedRooms = rooms.map((room) => ({
      id: room.id,
      name: room.name,
      floor: room.floor,
      type: room.type,
    }));

    return NextResponse.json({
      rooms: transformedRooms,
      count: transformedRooms.length,
    });
  } catch (error) {
    console.error("Error fetching rooms:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch rooms",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
