/**
 * Add Test Sensor Data to Firebase
 *
 * This script adds sample sensor data to your Firebase Realtime Database
 * for testing the EcoTrack AI dashboard.
 *
 * Usage: node scripts/add-test-data.js
 */

const https = require("https");

const FIREBASE_DATABASE_URL =
  "https://ecotrackai-7a140-default-rtdb.asia-southeast1.firebasedatabase.app";

// Sample sensor data
const sampleSensors = {
  "temp-living": {
    id: "temp-living",
    sensorName: "Living Room Temperature",
    currentValue: 22.5,
    unit: "°C",
    status: "normal",
    description: "Main living area",
    category: "temperature",
    room: "living-room",
    lastUpdate: new Date().toISOString(),
  },
  "temp-bedroom": {
    id: "temp-bedroom",
    sensorName: "Master Bedroom Temperature",
    currentValue: 21.0,
    unit: "°C",
    status: "normal",
    description: "Sleeping area",
    category: "temperature",
    room: "bedroom",
    lastUpdate: new Date().toISOString(),
  },
  "hum-living": {
    id: "hum-living",
    sensorName: "Living Room Humidity",
    currentValue: 65,
    unit: "%",
    status: "normal",
    description: "Main living area",
    category: "humidity",
    room: "living-room",
    lastUpdate: new Date().toISOString(),
  },
  "power-total": {
    id: "power-total",
    sensorName: "Total Power Consumption",
    currentValue: 4.2,
    unit: "kW",
    status: "warning",
    description: "Whole house",
    category: "power",
    room: "all",
    lastUpdate: new Date().toISOString(),
  },
  "env-co2": {
    id: "env-co2",
    sensorName: "CO2 Level",
    currentValue: 680,
    unit: "ppm",
    status: "warning",
    description: "Living room air",
    category: "environmental",
    room: "living-room",
    lastUpdate: new Date().toISOString(),
  },
};

/**
 * Add data to Firebase using HTTP PUT request
 */
function addDataToFirebase() {
  console.log("📤 Adding test sensor data to Firebase...\n");

  const data = JSON.stringify(sampleSensors);
  const url = new URL(`${FIREBASE_DATABASE_URL}/sensors.json`);

  const options = {
    hostname: url.hostname,
    path: url.pathname,
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "Content-Length": Buffer.byteLength(data),
    },
  };

  const req = https.request(options, (res) => {
    let responseData = "";

    res.on("data", (chunk) => {
      responseData += chunk;
    });

    res.on("end", () => {
      if (res.statusCode === 200) {
        console.log("✅ Test data added successfully!\n");
        console.log(
          "Response:",
          JSON.stringify(JSON.parse(responseData), null, 2)
        );
        console.log("\n📊 Added sensors:");
        Object.keys(sampleSensors).forEach((key) => {
          const sensor = sampleSensors[key];
          console.log(
            `  ✓ ${sensor.sensorName} (${sensor.currentValue} ${sensor.unit})`
          );
        });
        console.log("\n🎉 You can now view these sensors at:");
        console.log("   http://localhost:3000/live-monitoring");
        console.log(
          "\n💡 Tip: The dashboard will automatically update when sensor values change in Firebase!"
        );
      } else {
        console.error(`❌ Failed to add data. Status code: ${res.statusCode}`);
        console.error("Response:", responseData);
      }
    });
  });

  req.on("error", (error) => {
    console.error("❌ Error adding data to Firebase:");
    console.error(error.message);
    console.log("\n🔧 Troubleshooting:");
    console.log("  1. Check your internet connection");
    console.log("  2. Verify Firebase Security Rules allow write access");
    console.log("  3. Ensure the database URL is correct");
  });

  req.write(data);
  req.end();
}

// Run the script
console.log("╔════════════════════════════════════════════════════════╗");
console.log("║  Add Test Data to Firebase Realtime Database           ║");
console.log("║  EcoTrack AI Dashboard                                 ║");
console.log("╚════════════════════════════════════════════════════════╝\n");
console.log("Target:", FIREBASE_DATABASE_URL);
console.log("Endpoint: /sensors\n");

addDataToFirebase();
