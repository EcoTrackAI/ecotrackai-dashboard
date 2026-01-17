import { NextResponse } from "next/server";
import { fetchRoomSensor, fetchPZEMData } from "@/lib/firebase-sensors";
import { batchInsertRoomSensorData, batchInsertPZEMData, upsertRoom, testConnection } from "@/lib/database";

export async function POST() {
  if (!(await testConnection())) return NextResponse.json({ error: "DB unavailable" }, { status: 503 });
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
  return NextResponse.json({ synced });
}
