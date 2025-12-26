/**
 * Scheduled Firebase to PostgreSQL Sync
 * Runs every minute using setTimeout for Vercel compatibility
 * Note: Vercel has limitations with cron jobs, so we use a timeout-based approach
 */

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
const SYNC_INTERVAL = 60 * 1000; // 1 minute in milliseconds

let isRunning = false;

async function syncFirebaseData() {
  if (isRunning) {
    console.log("⏳ Previous sync still running, skipping...");
    return;
  }

  isRunning = true;
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
  } finally {
    isRunning = false;
  }
}

function scheduleNextSync() {
  setTimeout(async () => {
    await syncFirebaseData();
    scheduleNextSync(); // Schedule the next sync
  }, SYNC_INTERVAL);
}

// Start the sync loop
console.log("🔄 Firebase sync scheduler started, running every minute...");
syncFirebaseData(); // Run immediately on startup
scheduleNextSync(); // Then schedule recurring syncs
