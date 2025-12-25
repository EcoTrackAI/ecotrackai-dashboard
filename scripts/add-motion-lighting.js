/**
 * Script to add motion and lighting sensors to Firebase
 * Run: node scripts/add-motion-lighting.js
 */

const admin = require("firebase-admin");
const path = require("path");

// Initialize Firebase Admin SDK
const serviceAccountPath = path.join(__dirname, "../serviceAccountKey.json");

try {
  const serviceAccount = require(serviceAccountPath);

  if (!admin.apps.length) {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      databaseURL:
        "https://ecotrackai-7a140-default-rtdb.asia-southeast1.firebasedatabase.app",
    });
  }
} catch (error) {
  console.error("Error loading Firebase credentials:", error.message);
  console.log(
    "\nPlease ensure serviceAccountKey.json exists in the project root."
  );
  process.exit(1);
}

const db = admin.database();

// Motion and Lighting sensor data
const sensorsToAdd = {
  // Lighting Sensors
  "light-living": {
    id: "light-living",
    sensorName: "Ambient Light",
    currentValue: 65,
    unit: "%",
    status: "normal",
    description: "Living room brightness",
    category: "lighting",
    room: "living-room",
    lastUpdate: new Date().toISOString(),
  },
  "light-bedroom": {
    id: "light-bedroom",
    sensorName: "Ambient Light",
    currentValue: 45,
    unit: "%",
    status: "normal",
    description: "Bedroom brightness",
    category: "lighting",
    room: "bedroom",
    lastUpdate: new Date().toISOString(),
  },
  "light-kitchen": {
    id: "light-kitchen",
    sensorName: "Ambient Light",
    currentValue: 80,
    unit: "%",
    status: "normal",
    description: "Kitchen brightness",
    category: "lighting",
    room: "kitchen",
    lastUpdate: new Date().toISOString(),
  },
  "light-office": {
    id: "light-office",
    sensorName: "Ambient Light",
    currentValue: 70,
    unit: "%",
    status: "normal",
    description: "Office brightness",
    category: "lighting",
    room: "office",
    lastUpdate: new Date().toISOString(),
  },

  // Motion/Occupancy Sensors
  "motion-living": {
    id: "motion-living",
    sensorName: "Motion Sensor",
    currentValue: 1,
    unit: "boolean",
    status: "normal",
    description: "Living room presence",
    category: "occupancy",
    room: "living-room",
    lastUpdate: new Date().toISOString(),
  },
  "motion-bedroom": {
    id: "motion-bedroom",
    sensorName: "Motion Sensor",
    currentValue: 0,
    unit: "boolean",
    status: "normal",
    description: "Bedroom presence",
    category: "occupancy",
    room: "bedroom",
    lastUpdate: new Date().toISOString(),
  },
  "motion-kitchen": {
    id: "motion-kitchen",
    sensorName: "Motion Sensor",
    currentValue: 1,
    unit: "boolean",
    status: "normal",
    description: "Kitchen presence",
    category: "occupancy",
    room: "kitchen",
    lastUpdate: new Date().toISOString(),
  },
  "motion-office": {
    id: "motion-office",
    sensorName: "Motion Sensor",
    currentValue: 0,
    unit: "boolean",
    status: "normal",
    description: "Office presence",
    category: "occupancy",
    room: "office",
    lastUpdate: new Date().toISOString(),
  },
};

async function addSensors() {
  console.log("Adding motion and lighting sensors to Firebase...\n");

  try {
    for (const [sensorId, sensorData] of Object.entries(sensorsToAdd)) {
      await db.ref(`sensors/${sensorId}`).set(sensorData);
      console.log(
        `✓ Added ${sensorData.category} sensor: ${sensorId} (${sensorData.room})`
      );
    }

    console.log("\n✅ All motion and lighting sensors added successfully!");
    console.log("\nSummary:");
    console.log("- 4 lighting sensors added");
    console.log("- 4 motion/occupancy sensors added");
    console.log("\nThese sensors will now:");
    console.log("- Appear in the Live Monitoring dashboard");
    console.log("- Be synced to PostgreSQL automatically");
    console.log("- Show in analytics and history views");

    process.exit(0);
  } catch (error) {
    console.error("Error adding sensors:", error);
    process.exit(1);
  }
}

addSensors();
