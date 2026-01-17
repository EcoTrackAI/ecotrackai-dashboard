# Firebase Realtime Database Structure

**Version**: 1.0  
**Last Updated**: January 17, 2026  
**Status**: Active

## Overview

This document describes the complete Firebase Realtime Database structure used by the EcoTrack AI Dashboard. All real-time sensor data, relay states, and system status are stored and synchronized through Firebase.

## Database Paths

### 1. Power Meter Data (`/home/pzem/`)

**Purpose**: Store real-time electrical power metrics from PZEM sensors

**Path**: `home/pzem/`

**Structure**:

```json
{
  "home": {
    "pzem": {
      "current": 12.5, // Current in Amperes (A)
      "energy": 245.8, // Total energy consumed (kWh)
      "frequency": 50, // AC frequency (Hz)
      "pf": 0.98, // Power factor (0.0-1.0)
      "power": 1250, // Current power (W)
      "updatedAt": "2025-01-17T10:30:00.000Z", // ISO 8601 timestamp
      "voltage": 230 // Voltage (V)
    }
  }
}
```

**Data Types**:

- `current` (number): Measured in Amperes
- `energy` (number): Measured in kilowatt-hours (kWh)
- `frequency` (number): AC frequency in Hz
- `pf` (number): Power factor between 0.0 and 1.0
- `power` (number): Real-time power in Watts
- `updatedAt` (string): ISO 8601 timestamp
- `voltage` (number): Measured in Volts

**Update Frequency**: Real-time (device-dependent, typically 1-5 seconds)

**Used By**:

- Analytics page (power metrics, charts)
- Automation page (power consumption display)
- Home dashboard (power overview)

---

### 2. Room Sensors (`/sensors/{room}/`)

**Purpose**: Store real-time environmental sensor data for each room

**Path**: `sensors/bedroom/` and `sensors/living_room/`

**Structure**:

```json
{
  "sensors": {
    "bedroom": {
      "humidity": 65, // Relative humidity (%)
      "light": 450, // Light intensity (lux)
      "motion": true, // Motion detected (boolean)
      "temperature": 22.5, // Temperature (°C)
      "updatedAt": "2025-01-17T10:30:00.000Z" // ISO 8601 timestamp
    },
    "living_room": {
      "humidity": 55,
      "light": 800,
      "motion": false,
      "temperature": 23.0,
      "updatedAt": "2025-01-17T10:29:00.000Z"
    }
  }
}
```

**Available Rooms**:

- `bedroom` - Master bedroom sensors
- `living_room` - Living area sensors

**Data Types**:

- `humidity` (number): Relative humidity percentage (0-100%)
- `light` (number): Light intensity in lux (0-65535)
- `motion` (boolean): Motion detection state
- `temperature` (number): Temperature in Celsius
- `updatedAt` (string): ISO 8601 timestamp

**Update Frequency**: Real-time (device-dependent, typically 1-5 seconds)

**Used By**:

- Live monitoring page (real-time sensor display by room)
- History page (historical sensor data)
- Home dashboard (room status overview)
- Analytics (sensor trends and analysis)

---

### 3. Relay Controls (`/relays/{relay_id}/`)

**Purpose**: Store and control relay states for smart devices

**Path**: `relays/bedroom_light/` and `relays/living_room_light/`

**Structure**:

```json
{
  "relays": {
    "bedroom_light": {
      "state": true // Relay state (true=ON, false=OFF)
    },
    "living_room_light": {
      "state": false
    }
  }
}
```

**Available Relays**:

- `bedroom_light` - Bedroom light relay control
- `living_room_light` - Living room light relay control

**Data Types**:

- `state` (boolean): true = ON/enabled, false = OFF/disabled

**Control Method**:

- Write `true` or `false` to enable/disable relay
- Typically responds in 100-500ms

**Used By**:

- Automation page (manual relay control)
- RelayControlCard component (UI control)
- Smart automation rules (programmatic control)

---

## Reading Data

### Client-Side Subscriptions

Use Firebase SDK to subscribe to real-time updates:

```typescript
import { ref, onValue } from "firebase/database";
import { getDatabase } from "firebase/database";

// Subscribe to PZEM data
const pzemRef = ref(getDatabase(), "home/pzem");
onValue(pzemRef, (snapshot) => {
  const pzemData = snapshot.val();
  console.log("Power:", pzemData.power, "W");
});

// Subscribe to room sensors
const sensorRef = ref(getDatabase(), "sensors/bedroom");
onValue(sensorRef, (snapshot) => {
  const sensorData = snapshot.val();
  console.log("Temperature:", sensorData.temperature, "°C");
});
```

### Available Functions

The project provides utility functions in `lib/firebase-sensors.ts`:

```typescript
// Real-time subscriptions
subscribeRoomSensor(room: 'bedroom' | 'living_room', callback)
subscribePZEMData(callback)
subscribeRelayState(room: string, relayId: string, callback)

// One-time fetches
fetchRoomSensor(room: 'bedroom' | 'living_room')
fetchPZEMData()

// Control relays
setRelayState(room: string, relayId: string, state: boolean)
```

---

## Writing Data

### Relay Control

To control relays, write to the relay state:

```typescript
import { ref, set } from "firebase/database";
import { getDatabase } from "firebase/database";

// Turn on bedroom light
await set(ref(getDatabase(), "relays/bedroom_light/state"), true);

// Turn off living room light
await set(ref(getDatabase(), "relays/living_room_light/state"), false);
```

Or use the provided function:

```typescript
import { setRelayState } from "@/lib/firebase-relay";

await setRelayState("bedroom", "bedroom_light", true);
```

---

## Data Refresh Rules

The database automatically updates through:

1. **IoT Devices**: Push updates directly to Firebase
2. **Real-time Subscriptions**: All clients receive updates instantly
3. **Sync to PostgreSQL**: Client runs sync every 60 seconds (optional)

**No polling required** - Firebase WebSocket connections provide real-time updates.

---

## Backup & Archival

### PostgreSQL Historical Storage

All PZEM and sensor data is optionally synced to PostgreSQL for:

- Long-term historical analysis
- Complex queries and aggregations
- Generating reports

**Sync Endpoint**: `POST /api/sync-firebase`

```typescript
const response = await fetch("/api/sync-firebase", {
  method: "POST",
});
// Response: { synced: 1250, rooms: 2, timestamp: "..." }
```

---

## Best Practices

### ✅ DO

- Subscribe to data you need to display
- Unsubscribe in cleanup functions
- Use TypeScript types from `types/globals.d.ts`
- Handle Firebase initialization errors
- Check `updatedAt` to detect stale data

### ❌ DON'T

- Poll Firebase endpoints (use subscriptions instead)
- Store sensitive data in real-time paths
- Create deep nesting (keep structure flat)
- Write high-frequency data without rate limiting
- Forget to unsubscribe from listeners

---

## Troubleshooting

### Data Not Updating

1. Check Firebase connection status
2. Verify IoT device is sending data
3. Check Firebase Security Rules allow read/write
4. Inspect browser console for errors

### Relay Control Not Working

1. Verify relay path matches available relays
2. Check Firebase write permissions
3. Ensure relay ID is correct
4. Look for network errors in browser console

### Missing Rooms

Current implementation supports:

- `bedroom`
- `living_room`

To add more rooms, update:

1. Firebase database paths
2. Component type definitions in `types/globals.d.ts`
3. Sensor subscription functions in `lib/firebase-sensors.ts`

---

## Migration Notes

**Updated January 17, 2026**: Migrated from mock data to real Firebase paths:

- Simplified PZEM structure: `home/pzem/*` (was scattered)
- Room-based organization: `sensors/{room}/*`
- Relay control: `relays/{relay_id}/state`
- Removed mock data from constants
- Consolidated all types to `types/globals.d.ts`

All pages now fetch from real Firebase data sources instead of API endpoints or static mock data.
