# Live Monitoring - Real-Time Sensor Dashboard

## Overview

The Live Monitoring page provides real-time visualization of all sensors across your smart home, with automatic updates from Firebase Realtime Database.

## Features

- **Real-Time Updates** - Live sensor data without page refresh
- **Sensor Categories** - Energy, temperature, humidity, lighting, occupancy
- **Status Indicators** - Normal, warning, critical, offline states
- **Room Filtering** - View sensors by room
- **Search & Sort** - Find sensors quickly
- **Responsive Grid** - Adapts to screen size

## Data Flow

```
Firebase Realtime DB → firebase-sensors.ts → Live Monitoring Page → Sensor Cards
```

## Implementation

### Subscribe to Sensor Data

```typescript
import { subscribeSensorData } from "@/lib/firebase-sensors";

useEffect(() => {
  const unsubscribe = subscribeSensorData((sensors) => {
    setSensors(sensors);
  });

  return () => unsubscribe();
}, []);
```

### Sensor Data Structure

```typescript
interface FirebaseSensorData {
  id: string;
  sensorName: string;
  currentValue: number | string;
  unit: string;
  status: "normal" | "warning" | "critical" | "offline";
  category?: string; // "temperature", "humidity", "power", etc.
  room?: string; // "living-room", "bedroom", etc.
  description?: string;
  lastUpdate?: string;
}
```

## Components

### LiveSensorCard

Displays individual sensor information with status color coding.

**Props:**

- `sensorName` - Display name
- `currentValue` - Current reading
- `unit` - Measurement unit
- `status` - Sensor status
- `description` - Additional context
- `lastUpdate` - Last update timestamp

**Status Colors:**

- `normal` - Green
- `warning` - Orange/Yellow
- `critical` - Red
- `offline` - Gray

### Usage Example

```tsx
<LiveSensorCard
  sensorName="Living Room Temperature"
  currentValue={22.5}
  unit="°C"
  status="normal"
  description="Main living area"
  lastUpdate={new Date()}
/>
```

## Filtering & Search

### By Room

```typescript
import { subscribeSensorsByRoom } from "@/lib/firebase-sensors";

subscribeSensorsByRoom("living-room", (sensors) => {
  setRoomSensors(sensors);
});
```

### By Category

```typescript
import { subscribeSensorsByCategory } from "@/lib/firebase-sensors";

subscribeSensorsByCategory("temperature", (sensors) => {
  setTemperatureSensors(sensors);
});
```

## Best Practices

1. **Unsubscribe on Cleanup** - Always return unsubscribe function in useEffect
2. **Error Handling** - Handle connection errors gracefully
3. **Loading States** - Show loading indicator while fetching initial data
4. **Optimistic Updates** - Update UI immediately for better UX

## Customization

### Add New Sensor Categories

Update the sensor data in Firebase with appropriate category:

```json
{
  "sensors": {
    "new-sensor": {
      "id": "new-sensor",
      "sensorName": "Air Quality",
      "currentValue": 45,
      "unit": "AQI",
      "status": "normal",
      "category": "air-quality",
      "room": "living-room"
    }
  }
}
```

### Custom Status Logic

Define custom status determination in your component:

```typescript
function determineStatus(value: number, category: string): SensorStatus {
  if (category === "temperature") {
    if (value > 30) return "critical";
    if (value > 26) return "warning";
    return "normal";
  }
  // Add more categories...
}
```

## Troubleshooting

**Sensors not updating**

- Check Firebase connection
- Verify database rules allow read access
- Check console for errors

**Slow updates**

- Check network latency
- Verify Firebase plan limits
- Consider data aggregation

**Missing sensors**

- Verify sensor data structure in Firebase
- Check category/room filters
- Ensure sensors have required fields

## Related

- [Firebase Integration](./architecture.md)
- [Sensor Components](../components/sensors/README.md)
- [API Reference](./api-reference.md)
