# Firebase Helper Scripts

This directory contains utility scripts for managing your Firebase Realtime Database integration.

## 📜 Available Scripts

### 1. **test-firebase-connection.js**

Tests your connection to Firebase Realtime Database and shows current data.

**Usage:**

```bash
node scripts/test-firebase-connection.js
```

**What it does:**

- ✅ Checks if Firebase database is accessible
- ✅ Shows connection status and response headers
- ✅ Displays current sensor data (if any)
- ✅ Provides troubleshooting tips if connection fails

**Example Output:**

```
✅ Connection successful!
Found 5 sensor(s) in the database!

Sensor Summary:
  • Living Room Temperature: 22.5 °C [normal]
  • Total Power Consumption: 4.2 kW [warning]
  ...
```

---

### 2. **add-test-data.js**

Adds sample sensor data to your Firebase database for testing.

**Usage:**

```bash
node scripts/add-test-data.js
```

**What it does:**

- ✅ Adds 5 sample sensors to Firebase
- ✅ Includes different sensor types (temperature, humidity, power, environmental)
- ✅ Sets up proper data structure
- ✅ Provides confirmation of successful upload

**Sensors Added:**

- Living Room Temperature (22.5 °C)
- Master Bedroom Temperature (21 °C)
- Living Room Humidity (65 %)
- Total Power Consumption (4.2 kW)
- CO2 Level (680 ppm)

---

### 3. **set-system-status.js**

Sets the system status in Firebase for testing the navigation and sidebar indicators.

**Usage:**

```bash
# Set status to online (default)
node scripts/set-system-status.js online

# Set status to warning
node scripts/set-system-status.js warning

# Set status to offline
node scripts/set-system-status.js offline
```

**What it does:**

- ✅ Updates the system/status path in Firebase
- ✅ Accepts one of three statuses: online, warning, or offline
- ✅ Validates the status before setting
- ✅ Provides confirmation of successful update

**Status Options:**

- `online` - All systems operational (green indicator)
- `warning` - System warnings detected (yellow indicator)
- `offline` - System offline (red indicator)

---

## 🔧 Requirements

- Node.js installed
- Internet connection
- Valid Firebase configuration in `.env` file

## 📝 Customization

### Adding More Sensors

Edit `scripts/add-test-data.js` and add to the `sampleSensors` object:

```javascript
const sampleSensors = {
  "your-sensor-id": {
    id: "your-sensor-id",
    sensorName: "Your Sensor Name",
    currentValue: 123,
    unit: "units",
    status: "normal",
    description: "Description",
    category: "temperature", // or humidity, power, environmental, system
    room: "room-name",
    lastUpdate: new Date().toISOString(),
  },
  // ... existing sensors
};
```

### Testing Different Scenarios

**Test with no data:**

1. Remove all data from Firebase Console
2. Run `node scripts/test-firebase-connection.js`
3. Should show "Database is empty"

**Test with data:**

1. Run `node scripts/add-test-data.js`
2. Run `node scripts/test-firebase-connection.js`
3. Should show all sensors

## 🐛 Troubleshooting

### "Connection failed" error

**Possible causes:**

- No internet connection
- Firebase database URL is incorrect
- Firebase Realtime Database is not enabled

**Solutions:**

1. Check your internet connection
2. Verify `.env` file has correct `NEXT_PUBLIC_FIREBASE_DATABASE_URL`
3. Ensure Firebase Realtime Database is enabled in Firebase Console

### "Permission denied" error

**Solution:**
Update Firebase Security Rules to allow read/write:

```json
{
  "rules": {
    "sensors": {
      ".read": true,
      ".write": true
    },
    "system": {
      ".read": true,
      ".write": true
    }
  }
}
```

### Script hangs or times out

**Solutions:**

1. Check if Firebase database URL is correct
2. Ensure you're connected to the internet
3. Try running the test connection script first

## 💡 Tips

1. **Always test connection first:**

   ```bash
   node scripts/test-firebase-connection.js
   ```

2. **Add test data for development:**

   ```bash
   node scripts/add-test-data.js
   ```

3. **View the data in your dashboard:**

   ```bash
   npm run dev
   # Then visit: http://localhost:3000/live-monitoring
   ```

4. **Clear all data:** Use Firebase Console to delete all sensors, or:
   ```bash
   curl -X DELETE 'https://ecotrackai-7a140-default-rtdb.asia-southeast1.firebasedatabase.app/sensors.json'
   ```

## 🔗 Related Documentation

- [QUICK_START.md](../QUICK_START.md) - Quick start guide
- [FIREBASE_INTEGRATION.md](../FIREBASE_INTEGRATION.md) - Full integration docs
- [SUMMARY.md](../SUMMARY.md) - Project summary
- [lib/firebase-test-data.ts](../lib/firebase-test-data.ts) - More test data examples

## 📞 Need Help?

1. Check the console output for error messages
2. Review [FIREBASE_INTEGRATION.md](../FIREBASE_INTEGRATION.md) troubleshooting section
3. Verify Firebase Console shows your database URL correctly
4. Ensure all environment variables are set in `.env`

---

**Last Updated:** December 24, 2025
