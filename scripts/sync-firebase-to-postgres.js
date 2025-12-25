/**
 * Sync Firebase data to PostgreSQL
 * 
 * This script fetches current sensor data from Firebase Realtime Database
 * and stores it in PostgreSQL for historical tracking.
 * 
 * Usage:
 *   node scripts/sync-firebase-to-postgres.js
 */

const http = require('http');

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

async function syncData() {
  console.log('🔄 Starting Firebase to PostgreSQL sync...\n');

  try {
    // Test connection first
    console.log('1️⃣ Testing database connection...');
    const testResponse = await fetch(`${API_URL}/api/sync-firebase`);
    const testResult = await testResponse.json();
    
    if (!testResult.databaseConnected) {
      console.error('❌ Database connection failed!');
      console.error('Please check your PostgreSQL configuration in .env.local\n');
      process.exit(1);
    }
    
    console.log('✅ Database connection successful\n');

    // Perform sync
    console.log('2️⃣ Syncing Firebase data to PostgreSQL...');
    const syncResponse = await fetch(`${API_URL}/api/sync-firebase`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!syncResponse.ok) {
      throw new Error(`HTTP error! status: ${syncResponse.status}`);
    }

    const result = await syncResponse.json();

    if (result.error) {
      console.error('❌ Sync failed:', result.error);
      if (result.details) {
        console.error('Details:', result.details);
      }
      process.exit(1);
    }

    console.log('✅ Sync completed successfully!\n');
    console.log('📊 Summary:');
    console.log(`   - Sensors synced: ${result.synced}`);
    console.log(`   - Rooms processed: ${result.rooms}`);
    console.log(`   - Timestamp: ${result.timestamp}\n`);

    console.log('💡 You can now view historical data at:');
    console.log(`   ${API_URL}/history\n`);

  } catch (error) {
    console.error('❌ Error during sync:', error.message);
    console.error('\nTroubleshooting:');
    console.error('1. Make sure the development server is running: npm run dev');
    console.error('2. Check PostgreSQL is running and accessible');
    console.error('3. Verify .env.local has correct database credentials');
    console.error('4. Check Firebase connection is working\n');
    process.exit(1);
  }
}

// Run the sync
syncData();
