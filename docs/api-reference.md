# API Reference

Complete reference for all API endpoints and client functions.

## API Routes

### GET `/api/rooms`

Fetch all rooms from the database.

**Response:**

```typescript
{
  rooms: RoomOption[];
  count: number;
}
```

**Example:**

```typescript
const response = await fetch("/api/rooms");
const { rooms } = await response.json();
```

---

### GET `/api/historical-data`

Query historical sensor data with date range and optional room filtering.

**Query Parameters:**

| Parameter     | Type                | Required | Description              |
| ------------- | ------------------- | -------- | ------------------------ |
| `startDate`   | string (ISO 8601)   | Yes      | Start of date range      |
| `endDate`     | string (ISO 8601)   | Yes      | End of date range        |
| `roomIds`     | string              | No       | Comma-separated room IDs |
| `aggregation` | `"raw" \| "hourly"` | No       | Data aggregation level   |

**Response:**

```typescript
{
  data: HistoricalDataPoint[];
  count: number;
  startDate: string;
  endDate: string;
  roomIds: string | "all";
  aggregation: "raw" | "hourly";
}
```

**Example:**

```typescript
const params = new URLSearchParams({
  startDate: "2025-12-01T00:00:00Z",
  endDate: "2025-12-31T23:59:59Z",
  roomIds: "living-room,bedroom",
  aggregation: "hourly",
});

const response = await fetch(`/api/historical-data?${params}`);
const { data } = await response.json();
```

---

### POST `/api/sync-firebase`

Sync current Firebase sensor data to PostgreSQL.

**Response:**

```typescript
{
  message: string;
  synced: number;
  rooms: number;
  timestamp: string;
}
```

**Example:**

```typescript
const response = await fetch("/api/sync-firebase", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
});
const result = await response.json();
```

---

### GET `/api/sync-firebase`

Get sync status and database connection information.

**Response:**

```typescript
{
  databaseConnected: boolean;
  lastSync?: string;
  status: string;
}
```

## Client API Functions

All client functions are exported from `/lib/api.ts`.

### `fetchHistoricalData()`

Fetch historical energy data with date range filtering.

**Signature:**

```typescript
async function fetchHistoricalData(
  startDate: Date,
  endDate: Date,
  roomIds?: string[]
): Promise<HistoricalDataPoint[]>;
```

**Parameters:**

- `startDate` - Start of date range
- `endDate` - End of date range
- `roomIds` - Optional array of room IDs to filter

**Returns:** Array of historical data points

**Example:**

```typescript
import { fetchHistoricalData } from "@/lib/api";

const startDate = new Date("2025-12-01");
const endDate = new Date("2025-12-31");
const roomIds = ["living-room", "bedroom"];

const data = await fetchHistoricalData(startDate, endDate, roomIds);
```

---

### `fetchRooms()`

Fetch all available rooms.

**Signature:**

```typescript
async function fetchRooms(): Promise<RoomOption[]>;
```

**Returns:** Array of room options

**Example:**

```typescript
import { fetchRooms } from "@/lib/api";

const rooms = await fetchRooms();
console.log(rooms); // [{ id: 'living-room', name: 'Living Room', type: 'Common Area' }]
```

---

### `syncFirebaseData()`

Trigger Firebase to PostgreSQL data sync.

**Signature:**

```typescript
async function syncFirebaseData(): Promise<{
  synced: number;
  rooms: number;
  timestamp: string;
}>;
```

**Returns:** Sync result summary

**Example:**

```typescript
import { syncFirebaseData } from "@/lib/api";

const result = await syncFirebaseData();
console.log(`Synced ${result.synced} sensors`);
```

## Firebase Functions

All Firebase functions are exported from `/lib/firebase-sensors.ts` and `/lib/firebase-system-status.ts`.

### `subscribeSensorData()`

Subscribe to real-time updates for all sensors.

**Signature:**

```typescript
function subscribeSensorData(
  callback: (sensors: FirebaseSensorData[]) => void
): () => void;
```

**Parameters:**

- `callback` - Function called with sensor data on updates

**Returns:** Unsubscribe function

**Example:**

```typescript
import { subscribeSensorData } from "@/lib/firebase-sensors";

useEffect(() => {
  const unsubscribe = subscribeSensorData((sensors) => {
    setSensors(sensors);
  });

  return () => unsubscribe();
}, []);
```

---

### `subscribeSingleSensor()`

Subscribe to updates for a specific sensor.

**Signature:**

```typescript
function subscribeSingleSensor(
  sensorId: string,
  callback: (sensor: FirebaseSensorData | null) => void
): () => void;
```

**Parameters:**

- `sensorId` - ID of sensor to monitor
- `callback` - Function called with sensor updates

**Returns:** Unsubscribe function

**Example:**

```typescript
import { subscribeSingleSensor } from "@/lib/firebase-sensors";

const unsubscribe = subscribeSingleSensor("temp-living", (sensor) => {
  if (sensor) {
    console.log(`Temperature: ${sensor.currentValue}${sensor.unit}`);
  }
});
```

---

### `subscribeSensorsByRoom()`

Subscribe to sensors filtered by room.

**Signature:**

```typescript
function subscribeSensorsByRoom(
  room: string,
  callback: (sensors: FirebaseSensorData[]) => void
): () => void;
```

**Parameters:**

- `room` - Room ID to filter by
- `callback` - Function called with filtered sensors

**Returns:** Unsubscribe function

---

### `subscribeSensorsByCategory()`

Subscribe to sensors filtered by category.

**Signature:**

```typescript
function subscribeSensorsByCategory(
  category: string,
  callback: (sensors: FirebaseSensorData[]) => void
): () => void;
```

**Parameters:**

- `category` - Category to filter by (e.g., "temperature", "humidity")
- `callback` - Function called with filtered sensors

**Returns:** Unsubscribe function

---

### `fetchSensorData()`

Fetch sensor data once without subscribing.

**Signature:**

```typescript
async function fetchSensorData(): Promise<FirebaseSensorData[]>;
```

**Returns:** Array of all sensors

**Example:**

```typescript
import { fetchSensorData } from "@/lib/firebase-sensors";

const sensors = await fetchSensorData();
console.log(`Found ${sensors.length} sensors`);
```

---

### `subscribeSystemStatus()`

Subscribe to system status updates.

**Signature:**

```typescript
function subscribeSystemStatus(
  callback: (status: SystemStatus) => void
): () => void;
```

**Parameters:**

- `callback` - Function called when status changes

**Returns:** Unsubscribe function

**Example:**

```typescript
import { subscribeSystemStatus } from "@/lib/firebase-system-status";

useEffect(() => {
  const unsubscribe = subscribeSystemStatus((status) => {
    setSystemStatus(status); // "online", "offline", or "warning"
  });

  return () => unsubscribe();
}, []);
```

---

### `setSystemStatus()`

Update the system status.

**Signature:**

```typescript
async function setSystemStatus(status: SystemStatus): Promise<void>;
```

**Parameters:**

- `status` - New system status ("online" | "offline" | "warning")

**Example:**

```typescript
import { setSystemStatus } from "@/lib/firebase-system-status";

await setSystemStatus("warning");
```

## Database Functions

All database functions are exported from `/lib/database.ts`.

### `getHistoricalData()`

Query historical sensor data from PostgreSQL.

**Signature:**

```typescript
async function getHistoricalData(
  startDate: Date,
  endDate: Date,
  roomIds?: string[],
  aggregation?: "raw" | "hourly"
): Promise<HistoricalDataPoint[]>;
```

**Parameters:**

- `startDate` - Start of date range
- `endDate` - End of date range
- `roomIds` - Optional room filter
- `aggregation` - Data aggregation level

**Returns:** Array of historical data points

---

### `getRooms()`

Fetch all rooms from database.

**Signature:**

```typescript
async function getRooms(): Promise<DBRoom[]>;
```

**Returns:** Array of room records

---

### `upsertRoom()`

Create or update a room.

**Signature:**

```typescript
async function upsertRoom(
  id: string,
  name: string,
  floor?: number,
  type?: string
): Promise<void>;
```

**Parameters:**

- `id` - Room ID
- `name` - Room name
- `floor` - Floor number (default: 1)
- `type` - Room type (default: "residential")

---

### `batchInsertSensorData()`

Insert multiple sensor records efficiently.

**Signature:**

```typescript
async function batchInsertSensorData(
  records: Array<{
    sensor_id: string;
    sensor_name: string;
    room_id: string;
    category: string;
    current_value: number;
    unit: string;
    status: string;
    description?: string;
    timestamp?: Date;
  }>
): Promise<void>;
```

**Parameters:**

- `records` - Array of sensor data records

---

### `testConnection()`

Test PostgreSQL connection.

**Signature:**

```typescript
async function testConnection(): Promise<boolean>;
```

**Returns:** `true` if connected, `false` otherwise

## Type Definitions

All types are globally available from `/types/globals.d.ts`. No imports needed.

### Key Interfaces

```typescript
interface FirebaseSensorData {
  id: string;
  sensorName: string;
  currentValue: number | string;
  unit: string;
  status: "normal" | "warning" | "critical" | "offline";
  category?: string;
  room?: string;
  description?: string;
  lastUpdate?: string;
}

interface HistoricalDataPoint {
  timestamp: string;
  roomId: string;
  roomName: string;
  power: number;
  energy: number;
  temperature?: number;
  humidity?: number;
  lighting?: number;
  motion?: number;
}

interface RoomOption {
  id: string;
  name: string;
  type: string;
}

type SystemStatus = "online" | "offline" | "warning";
```

## Error Handling

All API functions throw errors that should be caught:

```typescript
try {
  const data = await fetchHistoricalData(start, end);
} catch (error) {
  console.error("Failed to fetch data:", error);
  // Handle error appropriately
}
```

## Rate Limiting

- Firebase: Subject to Firebase plan limits
- PostgreSQL: Connection pool max 20 clients
- API Routes: No built-in rate limiting (implement if needed)

## Related

- [Architecture Overview](./architecture.md)
- [Live Monitoring](./live-monitoring.md)
- [Analytics Guide](./analytics-guide.md)
