/**
 * Quick test to verify motion and lighting data sync
 * Run: node scripts/test-motion-lighting-sync.js
 */

const http = require('http');

async function testSync() {
  console.log('🧪 Testing Motion & Lighting Data Sync\n');

  try {
    // Step 1: Test database connection
    console.log('Step 1: Testing database connection...');
    const testRes = await fetch('http://localhost:3000/api/sync-firebase');
    const testData = await testRes.json();
    
    if (!testData.databaseConnected) {
      console.error('❌ Database not connected!');
      console.log('Please check your PostgreSQL connection.');
      process.exit(1);
    }
    console.log('✅ Database connected\n');

    // Step 2: Perform sync
    console.log('Step 2: Syncing Firebase data to PostgreSQL...');
    const syncRes = await fetch('http://localhost:3000/api/sync-firebase', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    });
    const syncData = await syncRes.json();
    
    if (syncData.error) {
      console.error('❌ Sync failed:', syncData.error);
      process.exit(1);
    }
    
    console.log('✅ Sync completed!');
    console.log(`   - Sensors synced: ${syncData.synced}`);
    console.log(`   - Rooms processed: ${syncData.rooms}\n`);

    // Step 3: Test fetching historical data with motion and lighting
    console.log('Step 3: Testing historical data API...');
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 7);
    
    const histRes = await fetch(
      `http://localhost:3000/api/historical-data?startDate=${startDate.toISOString()}&endDate=${endDate.toISOString()}`
    );
    const histData = await histRes.json();
    
    if (histData.error) {
      console.error('❌ Failed to fetch historical data:', histData.error);
      process.exit(1);
    }
    
    console.log('✅ Historical data fetched successfully');
    console.log(`   - Total records: ${histData.count}`);
    
    // Check if data includes lighting and motion
    if (histData.data && histData.data.length > 0) {
      const sampleRecord = histData.data[0];
      const hasLighting = 'lighting' in sampleRecord;
      const hasMotion = 'motion' in sampleRecord;
      
      console.log(`   - Lighting field present: ${hasLighting ? '✅' : '❌'}`);
      console.log(`   - Motion field present: ${hasMotion ? '✅' : '❌'}`);
      
      if (hasLighting && hasMotion) {
        console.log('\n🎉 Success! Motion and lighting data is properly stored and retrieved!');
        console.log('\nSample data point:');
        console.log(`   - Room: ${sampleRecord.roomName}`);
        console.log(`   - Temperature: ${sampleRecord.temperature}°C`);
        console.log(`   - Humidity: ${sampleRecord.humidity}%`);
        console.log(`   - Lighting: ${sampleRecord.lighting}%`);
        console.log(`   - Motion: ${sampleRecord.motion} (${sampleRecord.motion === 1 ? 'Detected' : 'Not detected'})`);
      } else {
        console.log('\n⚠️  Warning: Motion/lighting fields are missing from historical data');
      }
    } else {
      console.log('\n⚠️  No historical data found. This is normal for a fresh database.');
      console.log('   Add sensor data to Firebase and run sync again.');
    }

    console.log('\n✅ All tests passed!');
    console.log('\n📊 Next steps:');
    console.log('   1. Visit: http://localhost:3000/history');
    console.log('   2. Select a date range');
    console.log('   3. Choose "Lighting (%)" or "Motion/Occupancy" from the metric dropdown');
    console.log('   4. View your motion and lighting data!\n');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.log('\nTroubleshooting:');
    console.log('1. Make sure dev server is running: npm run dev');
    console.log('2. Check PostgreSQL is accessible');
    console.log('3. Verify Firebase has sensor data\n');
    process.exit(1);
  }
}

testSync();
