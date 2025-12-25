# Firebase Integration for Live Sensor Data

This document explains how to connect your EcoTrack AI dashboard to Firebase Realtime Database for live sensor data.

## 🔧 Setup Complete

Your Firebase integration is now configured and ready to use! The following components have been set up:

### 1. **Environment Variables** (`.env`)

All Firebase credentials are configured:

- `NEXT_PUBLIC_FIREBASE_API_KEY`
- `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
- `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
- `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
- `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
- `NEXT_PUBLIC_FIREBASE_APP_ID`
- `NEXT_PUBLIC_FIREBASE_DATABASE_URL`

### 2. **Firebase Services** (`lib/firebase.ts`)

- Firebase app initialization
- Database instance management
- Singleton pattern for efficient resource usage

### 3. **Sensor Data Service** (`lib/firebase-sensors.ts`)

- Real-time sensor data subscription
- Single sensor monitoring
- Room-based filtering
- Category-based filtering
- One-time data fetching

### 4. **Live Monitoring Page** (`app/live-monitoring/page.tsx`)

- Automatic Firebase connection
- Real-time data updates
- Connection status indicator
- Fallback to mock data if no Firebase data available

## 📊 Firebase Database Structure

Your Firebase Realtime Database should follow this structure:

```json
{
  "sensors": {
    "temp-living": {
      "id": "temp-living",
      "sensorName": "Living Room Temperature",
      "currentValue": 22.5,
      "unit": "°C",
      "status": "normal",
      "description": "Main living area",
      "category": "temperature",
      "room": "living-room",
      "lastUpdate": "2025-12-24T10:30:00.000Z"
    },
    "hum-bedroom": {
      "id": "hum-bedroom",
      "sensorName": "Bedroom Humidity",
      "currentValue": 65,
      "unit": "%",
      "status": "normal",
      "description": "Master bedroom",
      "category": "humidity",
      "room": "bedroom",
      "lastUpdate": "2025-12-24T10:30:00.000Z"
    },
    "power-total": {
      "id": "power-total",
      "sensorName": "Total Power Consumption",
      "currentValue": 4.2,
      "unit": "kW",
      "status": "warning",
      "description": "Whole house",
      "category": "power",
      "room": "all",
      "lastUpdate": "2025-12-24T10:30:00.000Z"
    }
  }
}
```

### Sensor Data Fields

| Field          | Type             | Required | Description                                                             |
| -------------- | ---------------- | -------- | ----------------------------------------------------------------------- |
| `id`           | string           | Yes      | Unique sensor identifier                                                |
| `sensorName`   | string           | Yes      | Display name of the sensor                                              |
| `currentValue` | number \| string | Yes      | Current sensor reading                                                  |
| `unit`         | string           | Yes      | Unit of measurement (°C, %, kW, etc.)                                   |
| `status`       | string           | Yes      | Sensor status: `normal`, `warning`, `critical`, `offline`               |
| `description`  | string           | No       | Additional context about the sensor                                     |
| `category`     | string           | No       | Category: `temperature`, `humidity`, `power`, `environmental`, `system` |
| `room`         | string           | No       | Room location of the sensor                                             |
| `lastUpdate`   | string           | No       | ISO timestamp of last update                                            |

## 🚀 Usage Examples

### Basic Real-time Subscription

```typescript
import { subscribeSensorData } from "@/lib/firebase-sensors";

// Subscribe to all sensor updates
const unsubscribe = subscribeSensorData((sensors) => {
  console.log("Received sensors:", sensors);
  // Update your UI here
});

// Later, unsubscribe
unsubscribe();
```

### Subscribe to Single Sensor

```typescript
import { subscribeSingleSensor } from "@/lib/firebase-sensors";

const unsubscribe = subscribeSingleSensor("temp-living", (sensor) => {
  if (sensor) {
    console.log("Temperature:", sensor.currentValue, sensor.unit);
  }
});
```

### Filter by Room

```typescript
import { subscribeSensorsByRoom } from "@/lib/firebase-sensors";

const unsubscribe = subscribeSensorsByRoom("bedroom", (sensors) => {
  console.log("Bedroom sensors:", sensors);
});
```

### Filter by Category

```typescript
import { subscribeSensorsByCategory } from "@/lib/firebase-sensors";

const unsubscribe = subscribeSensorsByCategory("temperature", (sensors) => {
  console.log("Temperature sensors:", sensors);
});
```

### One-time Fetch

```typescript
import { fetchSensorData } from "@/lib/firebase-sensors";

async function loadSensors() {
  try {
    const sensors = await fetchSensorData();
    console.log("Fetched sensors:", sensors);
  } catch (error) {
    console.error("Error:", error);
  }
}
```

## 🔐 Firebase Security Rules

Add these security rules to your Firebase Realtime Database:

```json
{
  "rules": {
    "sensors": {
      ".read": true,
      ".write": "auth != null",
      "$sensorId": {
        ".validate": "newData.hasChildren(['id', 'sensorName', 'currentValue', 'unit', 'status'])"
      }
    }
  }
}
```

**For development only** (not recommended for production):

```json
{
  "rules": {
    "sensors": {
      ".read": true,
      ".write": true
    }
  }
}
```

## 📝 Adding Sensor Data to Firebase

### Method 1: Firebase Console

1. Open [Firebase Console](https://console.firebase.google.com/)
2. Select your project: `ecotrackai-7a140`
3. Navigate to **Realtime Database**
4. Click on the **Data** tab
5. Add a new child named `sensors`
6. Add sensor objects following the structure above

### Method 2: Using Firebase Admin SDK (Backend)

```javascript
const admin = require("firebase-admin");
const db = admin.database();

// Add a sensor
const sensorRef = db.ref("sensors/temp-living");
await sensorRef.set({
  id: "temp-living",
  sensorName: "Living Room Temperature",
  currentValue: 22.5,
  unit: "°C",
  status: "normal",
  description: "Main living area",
  category: "temperature",
  room: "living-room",
  lastUpdate: new Date().toISOString(),
});
```

### Method 3: Using REST API

```bash
curl -X PUT \
  'https://ecotrackai-7a140-default-rtdb.asia-southeast1.firebasedatabase.app/sensors/temp-living.json' \
  -d '{
    "id": "temp-living",
    "sensorName": "Living Room Temperature",
    "currentValue": 22.5,
    "unit": "°C",
    "status": "normal",
    "description": "Main living area",
    "category": "temperature",
    "room": "living-room",
    "lastUpdate": "2025-12-24T10:30:00.000Z"
  }'
```

## 🎯 Testing Your Integration

1. **Start the development server:**

   ```bash
   npm run dev
   ```

2. **Navigate to the Live Monitoring page:**

   ```
   http://localhost:3000/live-monitoring
   ```

3. **Check connection status:**

   - Look for the connection indicator in the top-right corner
   - 🟢 "Live from Firebase" = Connected and receiving data
   - 🟠 "Using mock data" = Connected but no data in Firebase
   - 🔴 "Error message" = Connection error

4. **Add test data to Firebase:**
   - Use the Firebase Console to add a test sensor
   - Watch the dashboard update in real-time!

## 🐛 Troubleshooting

### Connection Issues

**Problem:** "Failed to connect to Firebase"

- ✅ Check `.env` file has all Firebase credentials
- ✅ Verify credentials are correct (no typos)
- ✅ Ensure `NEXT_PUBLIC_` prefix is present
- ✅ Restart the development server after changing `.env`

**Problem:** No data appearing

- ✅ Check Firebase Console to ensure data exists at `/sensors` path
- ✅ Verify Firebase Security Rules allow read access
- ✅ Check browser console for errors (F12)

**Problem:** "Permission denied"

- ✅ Update Firebase Security Rules to allow read access
- ✅ Ensure database URL is correct

### Data Format Issues

**Problem:** Sensors not displaying correctly

- ✅ Verify sensor objects have required fields: `id`, `sensorName`, `currentValue`, `unit`, `status`
- ✅ Check `status` is one of: `normal`, `warning`, `critical`, `offline`
- ✅ Ensure `currentValue` is a number or string

## 📱 Monitoring Real-time Updates

The dashboard automatically:

- ✅ Connects to Firebase on page load
- ✅ Subscribes to real-time updates
- ✅ Updates UI immediately when data changes
- ✅ Cleans up connections when page is closed
- ✅ Shows connection status
- ✅ Falls back to mock data if no Firebase data

## 🔄 Next Steps

1. **Add sensor data to Firebase** using any of the methods above
2. **Configure Firebase Security Rules** for production
3. **Set up Firebase Authentication** (optional, for write access)
4. **Create IoT device integration** to push sensor data to Firebase
5. **Add historical data logging** for analytics

## 📚 Additional Resources

- [Firebase Realtime Database Documentation](https://firebase.google.com/docs/database)
- [Firebase Security Rules](https://firebase.google.com/docs/database/security)
- [Firebase Admin SDK](https://firebase.google.com/docs/admin/setup)
- [Next.js Environment Variables](https://nextjs.org/docs/basic-features/environment-variables)

## 🎉 You're All Set!

Your dashboard is now connected to Firebase and ready to display live sensor data. Add some sensors to your Firebase database and watch them appear in real-time!
