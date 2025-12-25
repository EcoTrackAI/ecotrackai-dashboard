/**
 * Sync Firebase data to PostgreSQL
 * Usage: node scripts/sync-firebase-to-postgres.js
 */

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

async function syncData() {
  console.log("🔄 Starting Firebase to PostgreSQL sync...\n");

  try {
    console.log("⏳ Syncing Firebase data to PostgreSQL...");

    const response = await fetch(`${API_URL}/api/sync-firebase`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const result = await response.json();

    if (result.error) {
      throw new Error(result.error);
    }

    console.log("✅ Sync completed successfully!\n");
    console.log("📊 Summary:");
    console.log(`   • Sensors synced: ${result.synced}`);
    console.log(`   • Rooms processed: ${result.rooms}`);
    console.log(`   • Timestamp: ${result.timestamp}\n`);
  } catch (error) {
    console.error("❌ Sync failed:", error.message);
    console.error("\n💡 Troubleshooting:");
    console.error("   1. Ensure dev server is running: npm run dev");
    console.error("   2. Verify PostgreSQL is accessible");
    console.error("   3. Check .env.local database credentials");
    console.error("   4. Verify Firebase connection\n");
    process.exit(1);
  }
}

syncData();
