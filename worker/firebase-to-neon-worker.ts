import { getFirebaseSensorData } from "../lib/firebase-sensors";
import { batchInsertSensorData } from "../lib/database";

async function syncFirebaseToNeon() {
  try {
    // Fetch all sensor data from Firebase
    const sensors = await getFirebaseSensorData();
    if (!sensors || sensors.length === 0) {
      console.log("No sensor data found in Firebase.");
      return;
    }
    // Prepare records for Neon Postgres
    const records = sensors.map((sensor) => ({
      sensor_id: sensor.id,
      sensor_name: sensor.name,
      room_id: sensor.roomId,
      category: sensor.category,
      current_value: sensor.value,
      unit: sensor.unit,
      status: sensor.status,
      description: sensor.description || null,
      timestamp: new Date(sensor.lastUpdate || Date.now()),
    }));
    await batchInsertSensorData(records);
    console.log(`Synced ${records.length} records from Firebase to Neon Postgres.`);
  } catch (error) {
    console.error("Error syncing Firebase to Neon Postgres:", error);
  }
}

// Run every minute
setInterval(syncFirebaseToNeon, 60 * 1000);

// Run immediately on start
syncFirebaseToNeon();
