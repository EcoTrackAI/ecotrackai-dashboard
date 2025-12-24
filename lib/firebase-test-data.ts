/**
 * Sample Test Data for Firebase Realtime Database
 *
 * This file contains sample sensor data that you can use to populate
 * your Firebase Realtime Database for testing the EcoTrack AI dashboard.
 *
 * USAGE:
 * 1. Option A - Copy and paste this data into Firebase Console
 * 2. Option B - Use the REST API with curl (see examples below)
 * 3. Option C - Use Firebase Admin SDK in your backend
 */

export const sampleSensorData = {
  sensors: {
    // Temperature Sensors
    "temp-living": {
      id: "temp-living",
      sensorName: "Living Room Temperature",
      currentValue: 22.5,
      unit: "°C",
      status: "normal",
      description: "Main living area",
      category: "temperature",
      room: "living-room",
      lastUpdate: new Date().toISOString(),
    },
    "temp-bedroom": {
      id: "temp-bedroom",
      sensorName: "Master Bedroom Temperature",
      currentValue: 21.0,
      unit: "°C",
      status: "normal",
      description: "Sleeping area",
      category: "temperature",
      room: "bedroom",
      lastUpdate: new Date().toISOString(),
    },
    "temp-kitchen": {
      id: "temp-kitchen",
      sensorName: "Kitchen Temperature",
      currentValue: 23.8,
      unit: "°C",
      status: "normal",
      description: "Cooking area",
      category: "temperature",
      room: "kitchen",
      lastUpdate: new Date().toISOString(),
    },
    "temp-office": {
      id: "temp-office",
      sensorName: "Office Temperature",
      currentValue: 24.2,
      unit: "°C",
      status: "warning",
      description: "Home office",
      category: "temperature",
      room: "office",
      lastUpdate: new Date().toISOString(),
    },

    // Humidity Sensors
    "hum-living": {
      id: "hum-living",
      sensorName: "Living Room Humidity",
      currentValue: 65,
      unit: "%",
      status: "normal",
      description: "Main living area",
      category: "humidity",
      room: "living-room",
      lastUpdate: new Date().toISOString(),
    },
    "hum-bedroom": {
      id: "hum-bedroom",
      sensorName: "Bedroom Humidity",
      currentValue: 68,
      unit: "%",
      status: "normal",
      description: "Master bedroom",
      category: "humidity",
      room: "bedroom",
      lastUpdate: new Date().toISOString(),
    },
    "hum-bathroom": {
      id: "hum-bathroom",
      sensorName: "Bathroom Humidity",
      currentValue: 78,
      unit: "%",
      status: "warning",
      description: "Main bathroom",
      category: "humidity",
      room: "bathroom",
      lastUpdate: new Date().toISOString(),
    },

    // Power Sensors
    "power-total": {
      id: "power-total",
      sensorName: "Total Power Consumption",
      currentValue: 4.2,
      unit: "kW",
      status: "warning",
      description: "Whole house",
      category: "power",
      room: "all",
      lastUpdate: new Date().toISOString(),
    },
    "power-hvac": {
      id: "power-hvac",
      sensorName: "HVAC Power Draw",
      currentValue: 2.8,
      unit: "kW",
      status: "normal",
      description: "Air conditioning system",
      category: "power",
      room: "all",
      lastUpdate: new Date().toISOString(),
    },
    "power-solar": {
      id: "power-solar",
      sensorName: "Solar Panel Output",
      currentValue: 3.15,
      unit: "kW",
      status: "normal",
      description: "Rooftop solar array",
      category: "power",
      room: "outdoor",
      lastUpdate: new Date().toISOString(),
    },

    // Environmental Sensors
    "env-aqi-living": {
      id: "env-aqi-living",
      sensorName: "Living Room Air Quality",
      currentValue: 45,
      unit: "AQI",
      status: "normal",
      description: "Indoor air quality index",
      category: "environmental",
      room: "living-room",
      lastUpdate: new Date().toISOString(),
    },
    "env-co2": {
      id: "env-co2",
      sensorName: "CO2 Level",
      currentValue: 680,
      unit: "ppm",
      status: "warning",
      description: "Carbon dioxide concentration",
      category: "environmental",
      room: "living-room",
      lastUpdate: new Date().toISOString(),
    },
    "env-light": {
      id: "env-light",
      sensorName: "Natural Light Level",
      currentValue: 450,
      unit: "lux",
      status: "normal",
      description: "Window sensor",
      category: "environmental",
      room: "living-room",
      lastUpdate: new Date().toISOString(),
    },

    // System Sensors
    "sys-battery": {
      id: "sys-battery",
      sensorName: "Battery Level",
      currentValue: 87,
      unit: "%",
      status: "normal",
      description: "Home battery backup",
      category: "system",
      room: "garage",
      lastUpdate: new Date().toISOString(),
    },
    "sys-water-temp": {
      id: "sys-water-temp",
      sensorName: "Water Heater Temperature",
      currentValue: 54.5,
      unit: "°C",
      status: "normal",
      description: "Hot water tank",
      category: "system",
      room: "utility",
      lastUpdate: new Date().toISOString(),
    },
  },
};

// Export as JSON string for easy copying
export const sampleSensorDataJSON = JSON.stringify(sampleSensorData, null, 2);

/**
 * CURL COMMANDS TO ADD DATA TO FIREBASE
 *
 * Replace YOUR_DATABASE_URL with your actual Firebase database URL:
 * https://ecotrackai-7a140-default-rtdb.asia-southeast1.firebasedatabase.app
 */

export const curlCommands = `
# Add all sensors at once
curl -X PUT \\
  'https://ecotrackai-7a140-default-rtdb.asia-southeast1.firebasedatabase.app/sensors.json' \\
  -H 'Content-Type: application/json' \\
  -d '${sampleSensorDataJSON.replace(/\n/g, " ")}'

# Or add individual sensors:

# Add Living Room Temperature
curl -X PUT \\
  'https://ecotrackai-7a140-default-rtdb.asia-southeast1.firebasedatabase.app/sensors/temp-living.json' \\
  -H 'Content-Type: application/json' \\
  -d '{
    "id": "temp-living",
    "sensorName": "Living Room Temperature",
    "currentValue": 22.5,
    "unit": "°C",
    "status": "normal",
    "description": "Main living area",
    "category": "temperature",
    "room": "living-room",
    "lastUpdate": "${new Date().toISOString()}"
  }'

# Add Power Sensor
curl -X PUT \\
  'https://ecotrackai-7a140-default-rtdb.asia-southeast1.firebasedatabase.app/sensors/power-total.json' \\
  -H 'Content-Type: application/json' \\
  -d '{
    "id": "power-total",
    "sensorName": "Total Power Consumption",
    "currentValue": 4.2,
    "unit": "kW",
    "status": "warning",
    "description": "Whole house",
    "category": "power",
    "room": "all",
    "lastUpdate": "${new Date().toISOString()}"
  }'

# Update a sensor value
curl -X PATCH \\
  'https://ecotrackai-7a140-default-rtdb.asia-southeast1.firebasedatabase.app/sensors/temp-living.json' \\
  -H 'Content-Type: application/json' \\
  -d '{
    "currentValue": 23.5,
    "lastUpdate": "${new Date().toISOString()}"
  }'
`;

// Function to generate sensor with random value (for testing)
export function generateRandomSensor(
  baseValue: number,
  variance: number
): number {
  return Number((baseValue + (Math.random() - 0.5) * variance).toFixed(2));
}

// Function to update sensor status based on value
export function determineSensorStatus(
  value: number,
  type: "temperature" | "humidity" | "power" | "co2"
): "normal" | "warning" | "critical" {
  switch (type) {
    case "temperature":
      if (value > 28) return "critical";
      if (value > 26) return "warning";
      return "normal";

    case "humidity":
      if (value > 80 || value < 30) return "critical";
      if (value > 75 || value < 35) return "warning";
      return "normal";

    case "power":
      if (value > 5) return "critical";
      if (value > 4) return "warning";
      return "normal";

    case "co2":
      if (value > 1000) return "critical";
      if (value > 800) return "warning";
      return "normal";

    default:
      return "normal";
  }
}

/**
 * QUICK START GUIDE
 *
 * 1. Go to Firebase Console: https://console.firebase.google.com/
 * 2. Select project: ecotrackai-7a140
 * 3. Navigate to Realtime Database
 * 4. Click "Data" tab
 * 5. Click the "+" icon next to your database URL
 * 6. Copy the entire sampleSensorData object above
 * 7. Paste it as the value
 * 8. Click "Add"
 * 9. Visit http://localhost:3000/live-monitoring
 * 10. You should see all sensors appear!
 */
