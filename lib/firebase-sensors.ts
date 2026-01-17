import { ref, onValue, off, get } from "firebase/database";
import { getFirebaseDatabase } from "./firebase";

export function subscribeRoomSensor(room: "bedroom"|"living_room", callback: (data: RoomSensorData|null)=>void): ()=>void {
  const db = getFirebaseDatabase(), unsubscribe = onValue(ref(db, `sensors/${room}`), (snapshot)=> callback(snapshot.exists()?(snapshot.val() as RoomSensorData):null));
  return ()=>off(ref(db, `sensors/${room}`), "value", unsubscribe);
}

export async function fetchRoomSensor(room: "bedroom"|"living_room"): Promise<RoomSensorData|null> {
  try {
    const snapshot = await get(ref(getFirebaseDatabase(), `sensors/${room}`));
    return snapshot.exists()?(snapshot.val() as RoomSensorData):null;
  } catch { return null; }
}

export function subscribePZEMData(callback: (data: PZEMData|null)=>void): ()=>void {
  const db = getFirebaseDatabase(), unsubscribe = onValue(ref(db, "home/pzem"), (snapshot)=> callback(snapshot.exists()?(snapshot.val() as PZEMData):null));
  return ()=>off(ref(db, "home/pzem"), "value", unsubscribe);
}

export async function fetchPZEMData(): Promise<PZEMData|null> {
  try {
    const snapshot = await get(ref(getFirebaseDatabase(), "home/pzem"));
    return snapshot.exists()?(snapshot.val() as PZEMData):null;
  } catch { return null; }
}
