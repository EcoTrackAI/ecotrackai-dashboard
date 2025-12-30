import { fetchSensorData } from "../lib/firebase-sensors";
import { batchInsertSensorData } from "../lib/database";

async function syncFirebaseToNeon() {
  try {
    // Fetch all sensor data from Firebase
    const sensors = await fetchSensorData();
    if (!sensors || sensors.length === 0) {
      console.log("No sensor data found in Firebase.");
      return;
    }
    // Prepare records for Neon Postgres
    const records = sensors.map((sensor: FirebaseSensorData) => ({
      sensor_id: sensor.id,
      sensor_name: sensor.sensorName,
      room_id: sensor.room || "",
      category: sensor.category || "",
      current_value:
        typeof sensor.currentValue === "number"
          ? sensor.currentValue
          : Number(sensor.currentValue) || 0,
      unit: sensor.unit,
      status: String(sensor.status),
      description: sensor.description || undefined,
      timestamp: sensor.lastUpdate ? new Date(sensor.lastUpdate) : new Date(),
    }));
    await batchInsertSensorData(records);
    console.log(
      `Synced ${records.length} records from Firebase to Neon Postgres.`
    );
  } catch (error) {
    console.error("Error syncing Firebase to Neon Postgres:", error);
  }
}

// Run every minute
setInterval(syncFirebaseToNeon, 60 * 1000);

// Run immediately on start
syncFirebaseToNeon();
