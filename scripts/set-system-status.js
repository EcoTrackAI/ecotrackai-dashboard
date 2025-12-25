/**
 * Script to set initial system status in Firebase using REST API
 * Run this with: node scripts/set-system-status.js [online|warning|offline]
 */

const path = require("path");
const fs = require("fs");
const https = require("https");
const { URL } = require("url");

// Load environment variables from .env.local
function loadEnv() {
  const envPath = path.join(__dirname, "../.env.local");

  if (!fs.existsSync(envPath)) {
    console.error("❌ Error: .env.local file not found");
    console.log("Please create .env.local with your Firebase configuration");
    process.exit(1);
  }

  const envContent = fs.readFileSync(envPath, "utf8");
  const env = {};

  envContent.split("\n").forEach((line) => {
    // Skip comments and empty lines
    line = line.trim();
    if (line.startsWith("#") || line === "") return;

    const equalIndex = line.indexOf("=");
    if (equalIndex > 0) {
      const key = line.substring(0, equalIndex).trim();
      const value = line.substring(equalIndex + 1).trim();
      env[key] = value;
    }
  });

  return env;
}

const env = loadEnv();

async function setSystemStatus(status = "online") {
  try {
    const databaseURL = env.NEXT_PUBLIC_FIREBASE_DATABASE_URL;

    if (!databaseURL || databaseURL.trim() === "") {
      console.error(
        "❌ Error: NEXT_PUBLIC_FIREBASE_DATABASE_URL is not set in .env.local"
      );
      console.log("\nPlease add your Firebase configuration to .env.local:");
      console.log(
        "NEXT_PUBLIC_FIREBASE_DATABASE_URL=https://your-project.firebaseio.com"
      );
      process.exit(1);
    }

    console.log(`Setting system status to: ${status}`);
    console.log(`Firebase URL: ${databaseURL}`);

    // Construct the URL for the system/status path
    const url = new URL(`/system/status.json`, databaseURL);

    // Prepare the data
    const data = JSON.stringify(status);

    // Make HTTP request
    const options = {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Content-Length": data.length,
      },
    };

    await new Promise((resolve, reject) => {
      const req = https.request(url.toString(), options, (res) => {
        let body = "";

        res.on("data", (chunk) => {
          body += chunk;
        });

        res.on("end", () => {
          if (res.statusCode >= 200 && res.statusCode < 300) {
            console.log("✅ System status set successfully!");
            console.log(`Current system status: ${JSON.parse(body)}`);
            resolve();
          } else {
            console.error(`❌ Error: HTTP ${res.statusCode}`);
            console.error(`Response: ${body}`);
            reject(new Error(`HTTP ${res.statusCode}: ${body}`));
          }
        });
      });

      req.on("error", (error) => {
        console.error("❌ Network error:", error.message);
        reject(error);
      });

      req.write(data);
      req.end();
    });

    // Verify by reading back
    await new Promise((resolve, reject) => {
      const readUrl = new URL(`/system/status.json`, databaseURL);
      https
        .get(readUrl.toString(), (res) => {
          let body = "";

          res.on("data", (chunk) => {
            body += chunk;
          });

          res.on("end", () => {
            if (res.statusCode === 200) {
              console.log(`Verified status: ${JSON.parse(body)}`);
              resolve();
            } else {
              reject(new Error(`Failed to verify: HTTP ${res.statusCode}`));
            }
          });
        })
        .on("error", reject);
    });

    process.exit(0);
  } catch (error) {
    console.error("❌ Error setting system status:", error.message);
    console.log("\nTroubleshooting:");
    console.log("1. Check your Firebase Database URL in .env.local");
    console.log("2. Ensure Firebase Realtime Database is enabled");
    console.log("3. Update security rules to allow writes:");
    console.log(
      '   { "rules": { "system": { ".read": true, ".write": true } } }'
    );
    process.exit(1);
  }
}

// Get status from command line argument or default to "online"
const status = process.argv[2] || "online";

// Validate status
const validStatuses = ["online", "offline", "warning"];
if (!validStatuses.includes(status)) {
  console.error(`Invalid status: ${status}`);
  console.error(`Valid statuses are: ${validStatuses.join(", ")}`);
  process.exit(1);
}

setSystemStatus(status);
