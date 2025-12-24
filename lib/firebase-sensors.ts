import {
  ref,
  onValue,
  off,
  get,
  DatabaseReference,
  DataSnapshot,
} from "firebase/database";
import { getFirebaseDatabase } from "./firebase";
import { SensorStatus } from "@/components/sensors";

/**
 * Sensor data structure from Firebase
 */
export interface FirebaseSensorData {
  id: string;
  sensorName: string;
  currentValue: number | string;
  unit: string;
  status: SensorStatus;
  description?: string;
  lastUpdate?: string;
  category?: string;
  room?: string;
}

/**
 * Subscription callback type
 */
export type SensorDataCallback = (sensors: FirebaseSensorData[]) => void;

/**
 * Subscribe to real-time sensor data updates from Firebase
 *
 * @param callback Function to call when sensor data updates
 * @returns Unsubscribe function to stop listening
 *
 * @example
 * ```tsx
 * const unsubscribe = subscribeSensorData((sensors) => {
 *   console.log('Received sensor data:', sensors);
 *   setSensors(sensors);
 * });
 *
 * // Later, to unsubscribe:
 * unsubscribe();
 * ```
 */
export function subscribeSensorData(callback: SensorDataCallback): () => void {
  const database = getFirebaseDatabase();
  const sensorsRef = ref(database, "sensors");

  const listener = (snapshot: DataSnapshot) => {
    if (snapshot.exists()) {
      const data = snapshot.val();

      // Convert Firebase object to array
      const sensorsArray: FirebaseSensorData[] = [];

      // Handle different data structures
      if (Array.isArray(data)) {
        // If data is already an array
        sensorsArray.push(...data);
      } else if (typeof data === "object") {
        // If data is an object with sensor IDs as keys
        Object.keys(data).forEach((key) => {
          const sensor = data[key];
          sensorsArray.push({
            id: sensor.id || key,
            sensorName: sensor.sensorName || sensor.name || "Unknown Sensor",
            currentValue: sensor.currentValue || sensor.value || 0,
            unit: sensor.unit || "",
            status: sensor.status || "normal",
            description: sensor.description || "",
            lastUpdate:
              sensor.lastUpdate || sensor.timestamp || new Date().toISOString(),
            category: sensor.category || "system",
            room: sensor.room || "",
          });
        });
      }

      callback(sensorsArray);
    } else {
      // No data available
      callback([]);
    }
  };

  // Start listening
  onValue(sensorsRef, listener, (error) => {
    console.error("Error listening to sensor data:", error);
  });

  // Return unsubscribe function
  return () => {
    off(sensorsRef, "value", listener);
  };
}

/**
 * Subscribe to a specific sensor's data
 *
 * @param sensorId The ID of the sensor to monitor
 * @param callback Function to call when sensor data updates
 * @returns Unsubscribe function
 */
export function subscribeSingleSensor(
  sensorId: string,
  callback: (sensor: FirebaseSensorData | null) => void
): () => void {
  const database = getFirebaseDatabase();
  const sensorRef = ref(database, `sensors/${sensorId}`);

  const listener = (snapshot: DataSnapshot) => {
    if (snapshot.exists()) {
      const data = snapshot.val();
      callback({
        id: sensorId,
        sensorName: data.sensorName || data.name || "Unknown Sensor",
        currentValue: data.currentValue || data.value || 0,
        unit: data.unit || "",
        status: data.status || "normal",
        description: data.description || "",
        lastUpdate:
          data.lastUpdate || data.timestamp || new Date().toISOString(),
        category: data.category || "system",
        room: data.room || "",
      });
    } else {
      callback(null);
    }
  };

  onValue(sensorRef, listener, (error) => {
    console.error(`Error listening to sensor ${sensorId}:`, error);
  });

  return () => {
    off(sensorRef, "value", listener);
  };
}

/**
 * Fetch sensor data once (no real-time updates)
 *
 * @returns Promise with array of sensors
 */
export async function fetchSensorData(): Promise<FirebaseSensorData[]> {
  try {
    const database = getFirebaseDatabase();
    const sensorsRef = ref(database, "sensors");
    const snapshot = await get(sensorsRef);

    if (snapshot.exists()) {
      const data = snapshot.val();
      const sensorsArray: FirebaseSensorData[] = [];

      if (Array.isArray(data)) {
        sensorsArray.push(...data);
      } else if (typeof data === "object") {
        Object.keys(data).forEach((key) => {
          const sensor = data[key];
          sensorsArray.push({
            id: sensor.id || key,
            sensorName: sensor.sensorName || sensor.name || "Unknown Sensor",
            currentValue: sensor.currentValue || sensor.value || 0,
            unit: sensor.unit || "",
            status: sensor.status || "normal",
            description: sensor.description || "",
            lastUpdate:
              sensor.lastUpdate || sensor.timestamp || new Date().toISOString(),
            category: sensor.category || "system",
            room: sensor.room || "",
          });
        });
      }

      return sensorsArray;
    }

    return [];
  } catch (error) {
    console.error("Error fetching sensor data:", error);
    throw error;
  }
}

/**
 * Subscribe to sensors by room
 *
 * @param room Room name to filter by
 * @param callback Function to call when sensor data updates
 * @returns Unsubscribe function
 */
export function subscribeSensorsByRoom(
  room: string,
  callback: SensorDataCallback
): () => void {
  return subscribeSensorData((sensors) => {
    const filtered = sensors.filter((sensor) => sensor.room === room);
    callback(filtered);
  });
}

/**
 * Subscribe to sensors by category
 *
 * @param category Category to filter by (temperature, humidity, power, etc.)
 * @param callback Function to call when sensor data updates
 * @returns Unsubscribe function
 */
export function subscribeSensorsByCategory(
  category: string,
  callback: SensorDataCallback
): () => void {
  return subscribeSensorData((sensors) => {
    const filtered = sensors.filter((sensor) => sensor.category === category);
    callback(filtered);
  });
}
