import { NextResponse, NextRequest } from "next/server";
import { fetchRoomSensor, fetchPZEMData } from "@/lib/firebase-sensors";
import { batchInsertRoomSensorData, batchInsertPZEMData, upsertRoom, testConnection } from "@/lib/database";

function validateAuth(req: NextRequest): boolean {
  const apiKey = req.headers.get("x-api-key");
  const expected = process.env.SYNC_API_KEY;
  return !expected || apiKey === expected;
}

export async function GET() {
  try {
    const connected = await testConnection();
    return NextResponse.json({ status: "ok", database: connected ? "connected" : "disconnected", timestamp: new Date().toISOString() });
  } catch {
    return NextResponse.json({ status: "error", database: "error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    if (!validateAuth(req)) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    if (!(await testConnection())) return NextResponse.json({ success: false, error: "DB unavailable", synced: [], count: 0 }, { status: 503 });
    
    await Promise.all([upsertRoom("bedroom", "Bedroom", 1, "residential"), upsertRoom("living_room", "Living Room", 1, "residential")]);
    const [bed, liv, pz] = await Promise.all([fetchRoomSensor("bedroom"), fetchRoomSensor("living_room"), fetchPZEMData()]);
    const synced = [];
    
    if (bed) {
      await batchInsertRoomSensorData([{room_id:"bedroom", temperature:bed.temperature, humidity:bed.humidity, light:bed.light, motion:bed.motion, timestamp:new Date(bed.updatedAt)}]);
      synced.push("bedroom");
    }
    if (liv) {
      await batchInsertRoomSensorData([{room_id:"living_room", temperature:liv.temperature, humidity:liv.humidity, light:liv.light, motion:liv.motion, timestamp:new Date(liv.updatedAt)}]);
      synced.push("living_room");
    }
    if (pz) {
      await batchInsertPZEMData([{current:pz.current, voltage:pz.voltage, power:pz.power, energy:pz.energy, frequency:pz.frequency, pf:pz.pf, timestamp:new Date(pz.updatedAt)}]);
      synced.push("pzem");
    }
    
    return NextResponse.json({ success: true, synced, count: synced.length, timestamp: new Date().toISOString() });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ success: false, error: msg, synced: [], count: 0 }, { status: 500 });
  }
}
