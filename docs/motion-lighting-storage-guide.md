# Storing Motion and Lighting Data in PostgreSQL

## ✅ What Has Been Updated

All necessary code changes have been completed to support motion and lighting sensor data:

### 1. Database Layer ([lib/database.ts](lib/database.ts))
- ✅ Updated `HistoricalDataPoint` interface to include `lighting` and `motion` fields
- ✅ Modified `getHistoricalData()` query to fetch lighting (category: `lighting`) and motion (category: `occupancy`) data
- ✅ Modified `getAggregatedHourlyData()` query to include lighting and motion aggregations

### 2. API Layer ([app/api/historical-data/route.ts](app/api/historical-data/route.ts))
- ✅ Updated response transformation to include `lighting` and `motion` fields

### 3. Type Definitions ([types/globals.d.ts](types/globals.d.ts))
- ✅ Updated global `HistoricalDataPoint` interface with optional `lighting` and `motion` properties

### 4. History Page ([app/history/page.tsx](app/history/page.tsx))
- ✅ Added `lighting` and `motion` to `MetricType`
- ✅ Added dropdown options for "Lighting (%)" and "Motion/Occupancy"

### 5. Mock Data ([lib/api.ts](lib/api.ts))
- ✅ Updated `generateMockHistoricalData()` to include lighting and motion test values

### 6. Test Data ([lib/firebase-test-data.ts](lib/firebase-test-data.ts))
- ✅ Added 4 lighting sensors (living-room, bedroom, kitchen, office)
- ✅ Added 4 motion sensors (living-room, bedroom, kitchen, office)

## 🚀 How to Store Motion & Lighting Data in PostgreSQL

### Step 1: Ensure Firebase Has Your Sensor Data

First, make sure your motion and lighting sensors are in Firebase. You can use:

**Option A: Use the script**
```bash
node scripts/add-motion-lighting.js
```

**Option B: Add manually via Firebase Console**
Go to your Firebase Realtime Database and add sensors under the `sensors` node.

**Option C: Add via your IoT devices**
Your physical sensors should be writing to Firebase in real-time.

### Step 2: Verify Your Environment Variables

Make sure `.env.local` has your PostgreSQL credentials:

```env
# PostgreSQL Configuration
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
POSTGRES_DATABASE=ecotrackai
POSTGRES_USER=postgres
POSTGRES_PASSWORD=your_password

# Firebase Configuration (if using Admin SDK)
FIREBASE_PROJECT_ID=ecotrackai-7a140
FIREBASE_DATABASE_URL=https://ecotrackai-7a140-default-rtdb.asia-southeast1.firebasedatabase.app
```

### Step 3: Start Your Development Server

```bash
npm run dev
```

The server must be running for the sync to work.

### Step 4: Run the Sync Script

In a **new terminal** (while dev server is running):

```bash
node scripts/sync-firebase-to-postgres.js
```

This will:
1. ✅ Connect to PostgreSQL
2. ✅ Fetch all sensor data from Firebase (including motion & lighting)
3. ✅ Store it in the `sensor_data` table
4. ✅ Create/update rooms in the `rooms` table

**Expected Output:**
```
🔄 Starting Firebase to PostgreSQL sync...

1️⃣ Testing database connection...
✅ Database connection successful

2️⃣ Syncing Firebase data to PostgreSQL...
✅ Sync completed successfully!

📊 Summary:
   - Sensors synced: 20
   - Rooms processed: 5
   - Timestamp: 2025-12-25T16:00:00.000Z

💡 You can now view historical data at:
   http://localhost:3000/history
```

### Step 5: Verify Data in PostgreSQL

Connect to your PostgreSQL database and check:

```sql
-- Check if lighting sensors are stored
SELECT * FROM sensor_data 
WHERE category = 'lighting'
ORDER BY timestamp DESC
LIMIT 10;

-- Check if motion sensors are stored
SELECT * FROM sensor_data 
WHERE category = 'occupancy'
ORDER BY timestamp DESC
LIMIT 10;

-- Check all categories
SELECT category, COUNT(*) as count 
FROM sensor_data 
GROUP BY category;

-- Expected result:
-- temperature | 4
-- humidity    | 3
-- power       | 3
-- lighting    | 4
-- occupancy   | 4
-- etc.
```

### Step 6: View in the Dashboard

1. Go to: http://localhost:3000/history
2. Select date range (e.g., "Last 7 Days")
3. Select rooms
4. In the **Metric** dropdown, select:
   - **"Lighting (%)"** to view lighting sensor data
   - **"Motion/Occupancy"** to view motion detection data

## 📊 How the Data is Stored

### Database Schema

The `sensor_data` table already supports all sensor types via the `category` column:

```sql
CREATE TABLE sensor_data (
  id SERIAL PRIMARY KEY,
  sensor_id VARCHAR(100) NOT NULL,
  sensor_name VARCHAR(255) NOT NULL,
  room_id VARCHAR(50) REFERENCES rooms(id),
  category VARCHAR(50) NOT NULL,  -- 'lighting' or 'occupancy'
  current_value NUMERIC(10, 2) NOT NULL,
  unit VARCHAR(20) NOT NULL,
  status VARCHAR(20) NOT NULL,
  description TEXT,
  timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
```

### Sample Data Stored

**Lighting Sensor:**
```
sensor_id: "light-living"
category: "lighting"
current_value: 65
unit: "%"
room_id: "living-room"
```

**Motion Sensor:**
```
sensor_id: "motion-living"
category: "occupancy"
current_value: 1  (1 = motion detected, 0 = no motion)
unit: "boolean"
room_id: "living-room"
```

## 🔄 Automated Sync (Optional)

To sync data automatically at regular intervals:

### Option 1: Schedule with node-cron

The `sync-scheduler.js` script already exists. Update it if needed and run:

```bash
node scripts/sync-scheduler.js
```

This runs in the background and syncs every few minutes.

### Option 2: Set up a cron job (Linux/Mac)

```bash
# Edit crontab
crontab -e

# Add this line to sync every 5 minutes
*/5 * * * * cd /path/to/project && node scripts/sync-firebase-to-postgres.js
```

### Option 3: Use Windows Task Scheduler

1. Open Task Scheduler
2. Create Basic Task
3. Set trigger (e.g., every 5 minutes)
4. Action: Start a program
5. Program: `node`
6. Arguments: `C:\path\to\scripts\sync-firebase-to-postgres.js`

## 📈 Data Flow Diagram

```
IoT Sensors
    ↓
Firebase Realtime Database
    ↓ (Real-time display)
Live Monitoring Page
    ↓ (Sync script)
PostgreSQL Database
    ↓ (Historical queries)
History Page (with Lighting & Motion metrics)
    ↓
Analytics & Reports
```

## 🔍 Querying Historical Data

### Get lighting data for a room
```sql
SELECT timestamp, current_value 
FROM sensor_data 
WHERE room_id = 'living-room' 
  AND category = 'lighting'
  AND timestamp >= NOW() - INTERVAL '7 days'
ORDER BY timestamp DESC;
```

### Get motion detection events
```sql
SELECT timestamp, room_id, current_value 
FROM sensor_data 
WHERE category = 'occupancy' 
  AND current_value = 1
  AND timestamp >= NOW() - INTERVAL '24 hours'
ORDER BY timestamp DESC;
```

### Average lighting by room (last 24h)
```sql
SELECT room_id, AVG(current_value) as avg_lighting 
FROM sensor_data 
WHERE category = 'lighting'
  AND timestamp >= NOW() - INTERVAL '24 hours'
GROUP BY room_id;
```

### Room occupancy percentage (last 7 days)
```sql
SELECT 
  room_id,
  COUNT(*) as total_readings,
  SUM(CASE WHEN current_value = 1 THEN 1 ELSE 0 END) as occupied_readings,
  ROUND(100.0 * SUM(CASE WHEN current_value = 1 THEN 1 ELSE 0 END) / COUNT(*), 2) as occupancy_percentage
FROM sensor_data 
WHERE category = 'occupancy'
  AND timestamp >= NOW() - INTERVAL '7 days'
GROUP BY room_id;
```

## ❗ Troubleshooting

### Problem: Sync fails with "Database connection failed"
**Solution:**
- Check PostgreSQL is running: `psql -U postgres -d ecotrackai`
- Verify `.env.local` credentials are correct
- Check firewall/port 5432 is accessible

### Problem: No data appears in history page
**Solution:**
- Run sync script: `node scripts/sync-firebase-to-postgres.js`
- Check PostgreSQL has data: `SELECT COUNT(*) FROM sensor_data;`
- Clear browser cache and refresh

### Problem: Lighting/Motion options don't appear
**Solution:**
- Ensure you have the latest code changes
- Restart dev server: Stop (`Ctrl+C`) and run `npm run dev` again
- Check browser console for TypeScript errors

### Problem: Motion shows as 0 or 1, want text
**Solution:**
The history chart displays raw values. To show "Occupied"/"Empty" labels, you can modify the chart component or transform the data in the frontend. The raw value is correct for visualization.

## 📝 Next Steps

1. ✅ Add motion & lighting sensors to Firebase
2. ✅ Run sync script to store in PostgreSQL
3. ✅ View data in history page
4. ⏭️ Set up automated sync (optional)
5. ⏭️ Create custom analytics dashboards
6. ⏭️ Add alerts based on motion/lighting patterns
7. ⏭️ Integrate with automation rules

## 🎉 Summary

**Everything is ready!** Your system now:
- ✅ Captures motion and lighting data from Firebase
- ✅ Stores it in PostgreSQL with proper categorization
- ✅ Displays it in the history dashboard
- ✅ Supports all CRUD operations via existing APIs
- ✅ Maintains data consistency across platforms

Just run the sync script, and your motion & lighting data will be available in PostgreSQL and visible in the historical data section!
