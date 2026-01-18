import { ref, onValue, off, get } from "firebase/database";
import { getFirebaseDatabase } from "./firebase";

export function subscribeRoomSensor(
  room: "bedroom" | "living_room",
  callback: (data: RoomSensorData | null) => void,
): () => void {
  const db = getFirebaseDatabase();
  const sensorRef = ref(db, `sensors/${room}`);

  onValue(sensorRef, (snapshot) => {
    const data = snapshot.exists() ? (snapshot.val() as RoomSensorData) : null;
    callback(data);
  });

  return () => off(sensorRef, "value");
}

export async function fetchRoomSensor(
  room: "bedroom" | "living_room",
): Promise<RoomSensorData | null> {
  try {
    const db = getFirebaseDatabase();
    const snapshot = await get(ref(db, `sensors/${room}`));
    return snapshot.exists() ? (snapshot.val() as RoomSensorData) : null;
  } 
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  catch (_error) {
    return null;
  }
}

export function subscribePZEMData(
  callback: (data: PZEMData | null) => void,
): () => void {
  const db = getFirebaseDatabase();
  const pzemRef = ref(db, "home/pzem");

  onValue(pzemRef, (snapshot) => {
    const data = snapshot.exists() ? (snapshot.val() as PZEMData) : null;
    callback(data);
  });

  return () => off(pzemRef, "value");
}

export async function fetchPZEMData(): Promise<PZEMData | null> {
  try {
    const db = getFirebaseDatabase();
    const snapshot = await get(ref(db, "home/pzem"));
    return snapshot.exists() ? (snapshot.val() as PZEMData) : null;
  } 
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  catch (_error) {
    return null;
  }
}
