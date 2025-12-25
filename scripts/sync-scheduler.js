/**
 * Scheduled Firebase to PostgreSQL Sync
 * Runs every 5 minutes via node-cron
 */

const cron = require("node-cron");

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

// Schedule the sync to run every minute
cron.schedule("* * * * *", async () => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] Running Firebase sync...`);

  try {
    const response = await fetch(`${API_URL}/api/sync-firebase`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    });

    const result = await response.json();

    if (response.ok && !result.error) {
      console.log(`✅ Synced ${result.synced} sensors, ${result.rooms} rooms`);
    } else {
      console.error(`❌ Sync failed:`, result.error || response.statusText);
    }
  } catch (error) {
    console.error(`❌ Sync error:`, error.message);
  }
});

console.log("🔄 Firebase sync scheduler started, running every minute...");
