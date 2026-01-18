import { NextResponse, NextRequest } from "next/server";
import {
  cleanupOldRoomSensorData,
  cleanupOldPZEMData,
  testConnection,
} from "@/lib/database";

/**
 * Validate API key from request header
 */
function validateApiKey(request: NextRequest): boolean {
  const apiKey = request.headers.get("x-api-key");
  const expectedKey = process.env.SYNC_API_KEY;

  // Skip validation if no key is configured (development only)
  if (!expectedKey) return true;

  return apiKey === expectedKey;
}

/**
 * POST /api/cleanup
 * Delete old data records to maintain database size
 * Query parameters:
 *   - days: number of days to keep (optional, default: 90)
 * Required header: x-api-key (if SYNC_API_KEY is configured)
 */
export async function POST(request: NextRequest) {
  try {
    // Validate API key
    if (!validateApiKey(request)) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 },
      );
    }

    // Check database connection
    if (!(await testConnection())) {
      return NextResponse.json(
        { success: false, error: "Database unavailable" },
        { status: 503 },
      );
    }

    // Parse days parameter (default to 90 days)
    const { searchParams } = request.nextUrl;
    const days = Math.max(1, parseInt(searchParams.get("days") || "90", 10));

    // Clean up old data
    const [roomSensorDeleted, pzemDataDeleted] = await Promise.all([
      cleanupOldRoomSensorData(days),
      cleanupOldPZEMData(days),
    ]);

    return NextResponse.json(
      {
        success: true,
        message: `Deleted records older than ${days} days`,
        deleted: {
          room_sensors: roomSensorDeleted,
          pzem_data: pzemDataDeleted,
          total: roomSensorDeleted + pzemDataDeleted,
        },
        days,
        timestamp: new Date().toISOString(),
      },
      { status: 200 },
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 },
    );
  }
}
