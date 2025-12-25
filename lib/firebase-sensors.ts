import { ref, onValue, off, get, DataSnapshot } from "firebase/database";
import { getFirebaseDatabase } from "./firebase";

/**
 * Transform raw sensor data into FirebaseSensorData format
 */
function transformSensorData(key: string, sensor: any): FirebaseSensorData {
  return {
    id: sensor.id || key,
    sensorName: sensor.sensorName || sensor.name || "Unknown",
    currentValue: sensor.currentValue || sensor.value || 0,
    unit: sensor.unit || "",
    status: sensor.status || "normal",
    description: sensor.description || "",
    lastUpdate:
      sensor.lastUpdate || sensor.timestamp || new Date().toISOString(),
    category: sensor.category || "system",
    room: sensor.room || "",
  };
}

/**
 * Parse sensor data snapshot into array
 */
function parseSensorSnapshot(data: any): FirebaseSensorData[] {
  if (!data) return [];
  if (Array.isArray(data)) return data;
  if (typeof data === "object") {
    return Object.entries(data).map(([key, sensor]) =>
      transformSensorData(key, sensor as any)
    );
  }
  return [];
}

export function subscribeSensorData(callback: SensorDataCallback): () => void {
  const database = getFirebaseDatabase();
  const sensorsRef = ref(database, "sensors");

  const listener = (snapshot: DataSnapshot) => {
    const sensors = snapshot.exists()
      ? parseSensorSnapshot(snapshot.val())
      : [];
    callback(sensors);
  };

  onValue(sensorsRef, listener, (error) =>
    console.error("Sensor data error:", error)
  );
  return () => off(sensorsRef, "value", listener);
}

export function subscribeSingleSensor(
  sensorId: string,
  callback: (sensor: FirebaseSensorData | null) => void
): () => void {
  const database = getFirebaseDatabase();
  const sensorRef = ref(database, `sensors/${sensorId}`);

  const listener = (snapshot: DataSnapshot) => {
    if (!snapshot.exists()) {
      callback(null);
      return;
    }
    callback(transformSensorData(sensorId, snapshot.val()));
  };

  onValue(sensorRef, listener, (error) =>
    console.error(`Sensor ${sensorId} error:`, error)
  );
  return () => off(sensorRef, "value", listener);
}

export async function fetchSensorData(): Promise<FirebaseSensorData[]> {
  try {
    const database = getFirebaseDatabase();
    const snapshot = await get(ref(database, "sensors"));
    return snapshot.exists() ? parseSensorSnapshot(snapshot.val()) : [];
  } catch (error) {
    console.error("Error fetching sensors:", error);
    throw error;
  }
}
