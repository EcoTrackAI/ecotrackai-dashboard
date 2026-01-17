import { ref, onValue, off, get } from "firebase/database";
import { getFirebaseDatabase } from "./firebase";

/**
 * Subscribe to real-time room sensor updates
 */
export function subscribeRoomSensor(
  room: "bedroom" | "living_room",
  callback: (data: RoomSensorData | null) => void
): () => void {
  const db = getFirebaseDatabase();
  const sensorRef = ref(db, `sensors/${room}`);

  const unsubscribe = onValue(sensorRef, (snapshot) => {
    const data = snapshot.exists() ? (snapshot.val() as RoomSensorData) : null;
    callback(data);
  });

  return () => off(sensorRef, "value");
}

/**
 * Fetch room sensor data once
 */
export async function fetchRoomSensor(
  room: "bedroom" | "living_room"
): Promise<RoomSensorData | null> {
  try {
    const db = getFirebaseDatabase();
    const snapshot = await get(ref(db, `sensors/${room}`));
    return snapshot.exists() ? (snapshot.val() as RoomSensorData) : null;
  } catch (error) {
    console.error(`Error fetching ${room} sensor:`, error);
    return null;
  }
}

/**
 * Subscribe to real-time PZEM data updates
 */
export function subscribePZEMData(
  callback: (data: PZEMData | null) => void
): () => void {
  const db = getFirebaseDatabase();
  const pzemRef = ref(db, "home/pzem");

  const unsubscribe = onValue(pzemRef, (snapshot) => {
    const data = snapshot.exists() ? (snapshot.val() as PZEMData) : null;
    callback(data);
  });

  return () => off(pzemRef, "value");
}

/**
 * Fetch PZEM data once
 */
export async function fetchPZEMData(): Promise<PZEMData | null> {
  try {
    const db = getFirebaseDatabase();
    const snapshot = await get(ref(db, "home/pzem"));
    return snapshot.exists() ? (snapshot.val() as PZEMData) : null;
  } catch (error) {
    console.error("Error fetching PZEM data:", error);
    return null;
  }
}
