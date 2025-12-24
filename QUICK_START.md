# 🚀 Quick Start: Firebase Integration

Your Firebase Realtime Database integration is complete! Here's how to get started:

## ✅ What's Been Set Up

1. **Firebase SDK installed** - `firebase` package added
2. **Firebase configuration** - [lib/firebase.ts](lib/firebase.ts)
3. **Sensor data service** - [lib/firebase-sensors.ts](lib/firebase-sensors.ts)
4. **Live monitoring integration** - [app/live-monitoring/page.tsx](app/live-monitoring/page.tsx)
5. **Test data samples** - [lib/firebase-test-data.ts](lib/firebase-test-data.ts)
6. **Helper scripts** - `scripts/` directory

## 📋 Next Steps

### 1. Test the Connection

```bash
node scripts/test-firebase-connection.js
```

This will check if your Firebase database is accessible.

### 2. Add Test Data (Choose One Method)

#### Method A: Using the provided script

```bash
node scripts/add-test-data.js
```

#### Method B: Using Firebase Console

1. Visit: https://console.firebase.google.com/
2. Select project: **ecotrackai-7a140**
3. Go to **Realtime Database** → **Data**
4. Click the **+** icon
5. Copy data from [lib/firebase-test-data.ts](lib/firebase-test-data.ts)
6. Paste and save

#### Method C: Using curl (PowerShell)

```powershell
curl -X PUT `
  'https://ecotrackai-7a140-default-rtdb.asia-southeast1.firebasedatabase.app/sensors/temp-living.json' `
  -H 'Content-Type: application/json' `
  -d '{
    "id": "temp-living",
    "sensorName": "Living Room Temperature",
    "currentValue": 22.5,
    "unit": "°C",
    "status": "normal",
    "category": "temperature",
    "lastUpdate": "2025-12-24T10:30:00.000Z"
  }'
```

### 3. Start the Development Server

```bash
npm run dev
```

### 4. View Live Data

Open your browser to:

```
http://localhost:3000/live-monitoring
```

You should see:

- 🟢 **"Live from Firebase"** (if Firebase has data)
- 🟠 **"Using mock data"** (if Firebase is empty)
- 🔴 **Error message** (if connection failed)

## 🔍 Connection Status

The dashboard will show:

| Status                | Meaning                                   |
| --------------------- | ----------------------------------------- |
| 🟢 Live from Firebase | Connected and receiving real data         |
| 🟠 Using mock data    | Connected but no data in Firebase yet     |
| 🟡 Connecting...      | Initializing connection                   |
| 🔴 Failed to connect  | Check your `.env` file and Firebase setup |

## 📊 Firebase Database Structure

Your sensors should be stored like this:

```
/sensors
  /temp-living
    - id: "temp-living"
    - sensorName: "Living Room Temperature"
    - currentValue: 22.5
    - unit: "°C"
    - status: "normal"
    - category: "temperature"
    - lastUpdate: "2025-12-24T10:30:00.000Z"
  /hum-living
    - id: "hum-living"
    - sensorName: "Living Room Humidity"
    ...
```

## 🛠️ Troubleshooting

### "Failed to connect to Firebase"

- ✅ Check `.env` file has all Firebase credentials
- ✅ Restart dev server: `npm run dev`
- ✅ Verify Firebase Realtime Database is enabled in console

### "Using mock data"

- ✅ Add test data using one of the methods above
- ✅ Check Firebase Security Rules allow read access
- ✅ Run: `node scripts/test-firebase-connection.js`

### No sensors appearing

- ✅ Check browser console for errors (F12)
- ✅ Verify data is in `/sensors` path
- ✅ Ensure data structure matches the required format

## 📚 Additional Documentation

- **Full Integration Guide**: [FIREBASE_INTEGRATION.md](FIREBASE_INTEGRATION.md)
- **Test Data**: [lib/firebase-test-data.ts](lib/firebase-test-data.ts)
- **Firebase Docs**: https://firebase.google.com/docs/database

## 🎉 You're Ready!

Once you add sensor data to Firebase, it will automatically appear on your dashboard in real-time!

**Try it now:**

1. Add a sensor to Firebase
2. Watch it appear instantly on the dashboard
3. Update the sensor value in Firebase
4. See the dashboard update automatically!
