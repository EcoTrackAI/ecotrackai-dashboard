# Adding Motion and Lighting Sensors to EcoTrackAI

## Overview
Your database schema **already supports** motion (occupancy) and lighting sensors. You just need to add the data to Firebase, and it will automatically sync to PostgreSQL.

## Sensor Data Structure

### Lighting Sensor
```json
{
  "id": "light-living",
  "sensorName": "Ambient Light",
  "currentValue": 65,
  "unit": "%",
  "status": "normal",
  "description": "Living room brightness",
  "category": "lighting",
  "room": "living-room",
  "lastUpdate": "2025-12-25T15:57:52Z"
}
```

### Motion Sensor
```json
{
  "id": "motion-living",
  "sensorName": "Motion Sensor",
  "currentValue": 1,
  "unit": "boolean",
  "status": "normal",
  "description": "Living room presence",
  "category": "occupancy",
  "room": "living-room",
  "lastUpdate": "2025-12-25T15:57:52Z"
}
```

## 3 Ways to Add the Sensors

### Option 1: Use the Script (Easiest)
```bash
node scripts/add-motion-lighting.js
```
This will add:
- 4 lighting sensors (living room, bedroom, kitchen, office)
- 4 motion sensors (living room, bedroom, kitchen, office)

### Option 2: Firebase Console (Manual)
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: **ecotrackai-7a140**
3. Navigate to **Realtime Database**
4. Click on **sensors** node
5. Click the **+** icon to add a new child
6. Enter sensor ID (e.g., `light-living`)
7. Paste the sensor data JSON
8. Click **Add**

### Option 3: Using cURL (API)
```bash
# Add lighting sensor
curl -X PUT \
  'https://ecotrackai-7a140-default-rtdb.asia-southeast1.firebasedatabase.app/sensors/light-living.json' \
  -H 'Content-Type: application/json' \
  -d '{
    "id": "light-living",
    "sensorName": "Ambient Light",
    "currentValue": 65,
    "unit": "%",
    "status": "normal",
    "description": "Living room brightness",
    "category": "lighting",
    "room": "living-room",
    "lastUpdate": "2025-12-25T15:57:52Z"
  }'

# Add motion sensor
curl -X PUT \
  'https://ecotrackai-7a140-default-rtdb.asia-southeast1.firebasedatabase.app/sensors/motion-living.json' \
  -H 'Content-Type: application/json' \
  -d '{
    "id": "motion-living",
    "sensorName": "Motion Sensor",
    "currentValue": 1,
    "unit": "boolean",
    "status": "normal",
    "description": "Living room presence",
    "category": "occupancy",
    "room": "living-room",
    "lastUpdate": "2025-12-25T15:57:52Z"
  }'
```

## How the Data Flow Works

```
Firebase Realtime Database
    ↓
Live Monitoring Dashboard (real-time)
    ↓
Sync Script (cron job or API trigger)
    ↓
PostgreSQL Database (historical data)
    ↓
Analytics & History Pages
```

## Key Points

### Categories
- **Lighting**: Use category `"lighting"`
- **Motion**: Use category `"occupancy"`

### Motion Sensor Values
- `1` = Motion detected / Person present
- `0` = No motion / Room empty

### Lighting Sensor Values
- `0-100` = Brightness percentage
- Can also use `lux` as unit for absolute light measurements

### Database Storage
Once added to Firebase:
1. Data appears **immediately** in Live Monitoring
2. Sync script stores it in **PostgreSQL** for history
3. Available in **Analytics** and **History** pages

## Verify the Data

### Check Firebase
1. Open Firebase Console
2. Go to Realtime Database
3. Look for `sensors/light-living` and `sensors/motion-living`

### Check Dashboard
1. Visit: http://localhost:3000/live-monitoring
2. You should see lighting and motion sensors

### Check PostgreSQL
After running sync:
```bash
node scripts/sync-firebase-to-postgres.js
```

Then query:
```sql
SELECT * FROM sensor_data 
WHERE category IN ('lighting', 'occupancy')
ORDER BY timestamp DESC
LIMIT 10;
```

## Adding More Rooms

To add sensors for additional rooms:

```javascript
// Add to Firebase
{
  "light-garage": {
    "id": "light-garage",
    "sensorName": "Ambient Light",
    "currentValue": 30,
    "unit": "%",
    "status": "normal",
    "description": "Garage brightness",
    "category": "lighting",
    "room": "garage",
    "lastUpdate": "2025-12-25T15:57:52Z"
  },
  "motion-garage": {
    "id": "motion-garage",
    "sensorName": "Motion Sensor",
    "currentValue": 0,
    "unit": "boolean",
    "status": "normal",
    "description": "Garage presence",
    "category": "occupancy",
    "room": "garage",
    "lastUpdate": "2025-12-25T15:57:52Z"
  }
}
```

## Troubleshooting

### Sensors not appearing in dashboard?
- Check Firebase Console to verify data exists
- Check browser console for errors
- Verify Firebase config in `.env.local`

### Data not syncing to PostgreSQL?
- Run sync script manually: `node scripts/sync-firebase-to-postgres.js`
- Check PostgreSQL connection in `.env.local`
- Verify rooms exist in database: `SELECT * FROM rooms;`

### Need to update sensor values?
```bash
# Update via API
curl -X PATCH \
  'https://ecotrackai-7a140-default-rtdb.asia-southeast1.firebasedatabase.app/sensors/motion-living.json' \
  -H 'Content-Type: application/json' \
  -d '{
    "currentValue": 0,
    "lastUpdate": "2025-12-25T16:00:00Z"
  }'
```

## Next Steps

1. Add sensors to Firebase (use any method above)
2. Visit dashboard to see real-time data
3. Run sync script to store in PostgreSQL
4. Check analytics and history pages

All your infrastructure is ready - just add the data! 🚀
