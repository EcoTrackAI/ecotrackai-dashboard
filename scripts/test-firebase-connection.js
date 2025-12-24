/**
 * Firebase Connection Test Script
 *
 * Run this script to test your Firebase connection and see if you can
 * read data from your Realtime Database.
 *
 * Usage: node scripts/test-firebase-connection.js
 */

const https = require("https");

// Your Firebase configuration
const FIREBASE_DATABASE_URL =
  "https://ecotrackai-7a140-default-rtdb.asia-southeast1.firebasedatabase.app";

/**
 * Test Firebase connection by attempting to read data
 */
function testFirebaseConnection() {
  console.log("🔍 Testing Firebase Realtime Database connection...\n");
  console.log("Database URL:", FIREBASE_DATABASE_URL);
  console.log("Endpoint:", `${FIREBASE_DATABASE_URL}/sensors.json\n`);

  const url = `${FIREBASE_DATABASE_URL}/sensors.json`;

  https
    .get(url, (res) => {
      let data = "";

      res.on("data", (chunk) => {
        data += chunk;
      });

      res.on("end", () => {
        console.log("✅ Connection successful!\n");
        console.log("Status Code:", res.statusCode);
        console.log("Response Headers:", JSON.stringify(res.headers, null, 2));
        console.log("\nResponse Data:");

        try {
          const parsed = JSON.parse(data);

          if (parsed === null) {
            console.log("⚠️  Database is empty. No sensors found.");
            console.log("\n📝 To add test data, run one of these commands:\n");
            console.log("Option 1 - Add via Firebase Console:");
            console.log("  1. Visit: https://console.firebase.google.com/");
            console.log("  2. Select project: ecotrackai-7a140");
            console.log("  3. Go to Realtime Database > Data");
            console.log("  4. Copy test data from lib/firebase-test-data.ts\n");

            console.log("Option 2 - Add via curl:");
            console.log(
              `  curl -X PUT '${FIREBASE_DATABASE_URL}/sensors/temp-living.json' \\`
            );
            console.log(`    -H 'Content-Type: application/json' \\`);
            console.log(`    -d '{`);
            console.log(`      "id": "temp-living",`);
            console.log(`      "sensorName": "Living Room Temperature",`);
            console.log(`      "currentValue": 22.5,`);
            console.log(`      "unit": "°C",`);
            console.log(`      "status": "normal",`);
            console.log(`      "category": "temperature",`);
            console.log(`      "lastUpdate": "${new Date().toISOString()}"`);
            console.log(`    }'`);
          } else {
            console.log(JSON.stringify(parsed, null, 2));

            const sensorCount = Object.keys(parsed).length;
            console.log(`\n✅ Found ${sensorCount} sensor(s) in the database!`);

            console.log("\nSensor Summary:");
            Object.keys(parsed).forEach((key) => {
              const sensor = parsed[key];
              console.log(
                `  • ${sensor.sensorName || key}: ${sensor.currentValue} ${
                  sensor.unit
                } [${sensor.status}]`
              );
            });
          }
        } catch (error) {
          console.error("❌ Error parsing response:", error);
          console.log("Raw response:", data);
        }
      });
    })
    .on("error", (error) => {
      console.error("❌ Connection failed!");
      console.error("Error:", error.message);
      console.log("\n🔧 Troubleshooting:");
      console.log("  1. Check your internet connection");
      console.log("  2. Verify the Firebase Database URL is correct");
      console.log(
        "  3. Ensure Firebase Realtime Database is enabled in console"
      );
      console.log("  4. Check Firebase Security Rules allow read access");
    });
}

// Run the test
console.log("╔════════════════════════════════════════════════════════╗");
console.log("║  Firebase Realtime Database Connection Test            ║");
console.log("║  EcoTrack AI Dashboard                                 ║");
console.log("╚════════════════════════════════════════════════════════╝\n");

testFirebaseConnection();
