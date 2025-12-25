import { ref, onValue, off, get, DataSnapshot } from "firebase/database";
import { getFirebaseDatabase } from "./firebase";

export function subscribeSensorData(callback: SensorDataCallback): () => void {
  const database = getFirebaseDatabase();
  const sensorsRef = ref(database, "sensors");

  const listener = (snapshot: DataSnapshot) => {
    const sensors: FirebaseSensorData[] = [];
    
    if (snapshot.exists()) {
      const data = snapshot.val();
      
      if (Array.isArray(data)) {
        sensors.push(...data);
      } else if (typeof data === "object") {
        Object.entries(data).forEach(([key, sensor]: [string, any]) => {
          sensors.push({
            id: sensor.id || key,
            sensorName: sensor.sensorName || sensor.name || "Unknown",
            currentValue: sensor.currentValue || sensor.value || 0,
            unit: sensor.unit || "",
            status: sensor.status || "normal",
            description: sensor.description || "",
            lastUpdate: sensor.lastUpdate || sensor.timestamp || new Date().toISOString(),
            category: sensor.category || "system",
            room: sensor.room || "",
          });
        });
      }
    }
    
    callback(sensors);
  };

  onValue(sensorsRef, listener, (error) => console.error("Sensor data error:", error));
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

    const data = snapshot.val();
    callback({
      id: sensorId,
      sensorName: data.sensorName || data.name || "Unknown",
      currentValue: data.currentValue || data.value || 0,
      unit: data.unit || "",
      status: data.status || "normal",
      description: data.description || "",
      lastUpdate: data.lastUpdate || data.timestamp || new Date().toISOString(),
      category: data.category || "system",
      room: data.room || "",
    });
  };

  onValue(sensorRef, listener, (error) => console.error(`Sensor ${sensorId} error:`, error));
  return () => off(sensorRef, "value", listener);
}

export async function fetchSensorData(): Promise<FirebaseSensorData[]> {
  try {
    const database = getFirebaseDatabase();
    const snapshot = await get(ref(database, "sensors"));
    
    if (!snapshot.exists()) return [];

    const data = snapshot.val();
    const sensors: FirebaseSensorData[] = [];

    if (Array.isArray(data)) return data;

    if (typeof data === "object") {
      Object.entries(data).forEach(([key, sensor]: [string, any]) => {
        sensors.push({
          id: sensor.id || key,
          sensorName: sensor.sensorName || sensor.name || "Unknown",
          currentValue: sensor.currentValue || sensor.value || 0,
          unit: sensor.unit || "",
          status: sensor.status || "normal",
          description: sensor.description || "",
          lastUpdate: sensor.lastUpdate || sensor.timestamp || new Date().toISOString(),
          category: sensor.category || "system",
          room: sensor.room || "",
        });
      });
    }

    return sensors;
  } catch (error) {
    console.error("Error fetching sensors:", error);
    throw error;
  }
}

export function subscribeSensorsByRoom(room: string, callback: SensorDataCallback): () => void {
  return subscribeSensorData((sensors) => callback(sensors.filter(s => s.room === room)));
}

export function subscribeSensorsByCategory(category: string, callback: SensorDataCallback): () => void {
  return subscribeSensorData((sensors) => callback(sensors.filter(s => s.category === category)));
}

// Alias for API usage
export const getSensorData = fetchSensorData;
