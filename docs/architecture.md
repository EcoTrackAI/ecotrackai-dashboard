# EcoTrack AI - System Architecture

## 🏗️ Overview

EcoTrack AI is a full-stack energy monitoring platform combining real-time Firebase data with PostgreSQL historical storage, built on Next.js with TypeScript.

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Client Layer (React/Next.js)              │
│  ┌──────────┬──────────┬──────────┬──────────┬───────────┐ │
│  │Dashboard │Analytics │Automation│ History  │ Insights  │ │
│  └──────────┴──────────┴──────────┴──────────┴───────────┘ │
└────────────┬────────────────────────────────────────────────┘
             │
             ├─────────────────┬─────────────────┐
             │                 │                 │
             ▼                 ▼                 ▼
┌────────────────────┐ ┌──────────────┐ ┌──────────────────┐
│   Firebase SDK     │ │  API Routes  │ │  UI Components   │
│  (Real-time Data)  │ │  (REST API)  │ │  (Reusable)      │
└────────┬───────────┘ └──────┬───────┘ └──────────────────┘
         │                    │
         │                    ▼
         │           ┌──────────────────┐
         │           │  PostgreSQL DB   │
         │           │  (Historical)    │
         │           └──────────────────┘
         │
         ▼
┌──────────────────────────────────────┐
│  Firebase Realtime Database          │
│  /sensors/*                          │
│  /system/status                      │
└──────────────────────────────────────┘
```

## Data Flow

### Real-Time Monitoring

```
IoT Sensors → Firebase → subscribeSensorData() → React State → UI Update
```

1. **IoT Devices** push sensor data to Firebase
2. **Firebase SDK** subscribes to data changes
3. **React Components** receive real-time callbacks
4. **UI Updates** automatically without polling

### Historical Analytics

```
Firebase → Sync Script → PostgreSQL → API Route → Analytics Page
```

1. **Scheduled Sync** runs every 5 minutes
2. **Data Aggregation** stores sensor readings in PostgreSQL
3. **API Queries** fetch historical data with filters
4. **Chart Components** visualize trends

## Core Modules

### 1. Firebase Integration (`/lib/firebase*.ts`)

**firebase.ts** - Firebase initialization

- Singleton pattern for app instance
- Configuration from environment variables
- Database instance management

**firebase-sensors.ts** - Sensor data service

- `subscribeSensorData()` - Subscribe to all sensors
- `subscribeSingleSensor()` - Monitor specific sensor
- `subscribeSensorsByRoom()` - Filter by room
- `subscribeSensorsByCategory()` - Filter by category
- `fetchSensorData()` - One-time fetch

**firebase-system-status.ts** - System status

- `subscribeSystemStatus()` - Monitor system health
- `setSystemStatus()` - Update system status

### 2. PostgreSQL Integration (`/lib/database.ts`)

**Database Functions:**

- `getPool()` - Connection pool management
- `getRooms()` - Fetch all rooms
- `upsertRoom()` - Create/update room
- `getHistoricalData()` - Query sensor history
- `batchInsertSensorData()` - Bulk insert
- `testConnection()` - Health check

**Query Optimization:**

- Connection pooling (max 20 clients)
- Prepared statements
- Indexed queries
- Aggregation support (raw/hourly)

### 3. API Client (`/lib/api.ts`)

**HTTP Client:**

- Generic `apiRequest<T>()` wrapper
- Error handling and retries
- Type-safe responses

**API Functions:**

- `fetchHistoricalData()` - Get historical sensor data
- `fetchRooms()` - Get all rooms
- `syncFirebaseData()` - Trigger data sync

### 4. Constants (`/lib/constants.ts`)

**Configuration:**

- App metadata
- Color palette
- Status colors
- Default rooms
- Default appliances
- Tariff settings
- Notification settings

## API Routes

### GET `/api/rooms`

Fetch all rooms from PostgreSQL.

**Response:**

```json
{
  "rooms": [
    { "id": "living-room", "name": "Living Room", "type": "Common Area" }
  ],
  "count": 1
}
```

### GET `/api/historical-data`

Query historical sensor data.

**Query Parameters:**

- `startDate` (required) - ISO date string
- `endDate` (required) - ISO date string
- `roomIds` (optional) - Comma-separated room IDs
- `aggregation` (optional) - "raw" or "hourly"

**Response:**

```json
{
  "data": [
    {
      "timestamp": "2025-12-25T10:00:00Z",
      "roomId": "living-room",
      "roomName": "Living Room",
      "power": 1500,
      "energy": 1.5,
      "temperature": 22.5,
      "humidity": 65
    }
  ],
  "count": 100
}
```

### POST `/api/sync-firebase`

Sync current Firebase data to PostgreSQL.

**Response:**

```json
{
  "message": "Successfully synced",
  "synced": 50,
  "rooms": 5,
  "timestamp": "2025-12-25T10:00:00Z"
}
```

## Component Architecture

### Component Structure

```
components/
├── automation/          # Device control
│   ├── ApplianceControlCard
│   ├── AutomationActivityItem
│   └── AutomationControlPanel
├── charts/              # Data visualization
│   └── RealtimeLineChart
├── history/             # Historical data
│   ├── DataTable
│   ├── DateRangePicker
│   ├── HistoricalChart
│   └── RoomSelector
├── metrics/             # Dashboard metrics
│   └── MetricCard
├── navigation/          # Layout & navigation
│   ├── AppShell
│   ├── Navigation
│   ├── Sidebar
│   └── UserProfileDropdown
├── profile/             # User profile
│   └── ProfileCard
├── recommendations/     # AI insights
│   └── MLRecommendationCard
├── rooms/               # Room status
│   └── RoomStatusCard
└── sensors/             # Sensor display
    └── LiveSensorCard
```

### Component Patterns

**Presentation Components:**

- Pure, no side effects
- Accept data via props
- Emit events via callbacks
- Reusable across pages

**Container Components:**

- Manage state
- Fetch data
- Handle business logic
- Compose presentation components

## Type System

All types are defined globally in `/types/globals.d.ts`:

**Key Type Categories:**

- Navigation & UI types
- User & Profile types
- Analytics types
- Automation types
- History & Comparison types
- Sensor types
- Database types
- Settings types

**Benefits:**

- No imports needed
- Consistent across app
- Type-safe throughout
- Easy to maintain

## State Management

### Local State (useState)

Used for component-specific UI state:

- Form inputs
- Modal visibility
- Loading indicators
- Local filters

### Real-Time Subscriptions

Firebase provides automatic state sync:

```typescript
const [sensors, setSensors] = useState<FirebaseSensorData[]>([]);

useEffect(() => {
  const unsubscribe = subscribeSensorData(setSensors);
  return unsubscribe;
}, []);
```

### Server State (API)

API routes handle server-side data:

```typescript
const { data, error, loading } = await fetchHistoricalData(start, end);
```

## Security

### Firebase Rules

```json
{
  "rules": {
    "sensors": {
      ".read": "auth != null",
      ".write": "auth != null"
    },
    "system": {
      ".read": true,
      "status": {
        ".write": "auth != null"
      }
    }
  }
}
```

### API Security

- Environment variable protection
- CORS configuration
- Input validation
- SQL injection prevention (parameterized queries)
- Error message sanitization

## Performance Optimization

### Client-Side

- React Server Components (Next.js 16)
- Code splitting by route
- Image optimization (Next.js Image)
- CSS-in-JS with Tailwind (minimal runtime)
- Memoization for expensive computations

### Server-Side

- PostgreSQL connection pooling
- Query result caching
- Batch inserts for sensor data
- Aggregated queries for large datasets
- API route caching headers

### Database

- Indexed columns (timestamp, room_id, sensor_id)
- Aggregation functions
- Automatic cleanup of old data
- Efficient JOIN queries

## Deployment

### Environment Variables

**Production:**

```env
# Firebase
NEXT_PUBLIC_FIREBASE_*=production_values

# PostgreSQL
POSTGRES_HOST=production_host
POSTGRES_DATABASE=ecotrackai_prod
POSTGRES_USER=prod_user
POSTGRES_PASSWORD=secure_password

# Node
NODE_ENV=production
```

### Build Process

```bash
npm run build  # Creates .next/ directory
npm start      # Runs production server
```

### Monitoring

- Firebase console for real-time metrics
- PostgreSQL logs for query performance
- Next.js analytics for page performance
- Error tracking (recommended: Sentry)

## Scalability Considerations

### Horizontal Scaling

- Next.js supports multiple instances
- PostgreSQL read replicas
- Firebase scales automatically
- Load balancer for API routes

### Data Volume

- Automatic data cleanup (90-day retention)
- Hourly aggregation for large datasets
- Pagination for API responses
- Lazy loading for components

## Related Documentation

- [Live Monitoring](./live-monitoring.md)
- [Analytics Guide](./analytics-guide.md)
- [History Guide](./history-guide.md)
- [Automation Guide](./automation.md)
- [API Reference](./api-reference.md)
  │ │ }); │ │
  │ │ return () => unsubscribe(); // Cleanup │ │
  │ │ }, []); │ │
  │ └──────────────────────────────────────────────────────────┘ │
  │ │
  │ Features: │
  │ • Real-time sensor updates │
  │ • Connection status indicator │
  │ • Category filtering │
  │ • Status summary (active, warning, critical, offline) │
  │ • Fallback to mock data if Firebase is empty │
  └───────────────────────────┬─────────────────────────────────────┘
  │
  │ Renders
  │
  ┌───────────────────────────▼─────────────────────────────────────┐
  │ User Interface (Dashboard) │
  │ │
  │ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ │
  │ │ 🟢 Live │ │ Status │ │ Category │ │
  │ │ Connection │ │ Summary │ │ Filter │ │
  │ └─────────────┘ └─────────────┘ └─────────────┘ │
  │ │
  │ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐ │
  │ │ 🌡️ Temp │ │ 💧 Humid │ │ ⚡ Power │ │ 🌫️ CO2 │ │
  │ │ 22.5°C │ │ 65% │ │ 4.2kW │ │ 680ppm │ │
  │ │ Normal │ │ Normal │ │ Warning │ │ Warning │ │
  │ └──────────┘ └──────────┘ └──────────┘ └──────────┘ │
  │ │
  │ Updates in real-time without page refresh! ⚡ │
  └──────────────────────────────────────────────────────────────────┘

```

## 📊 Data Flow

```

IoT Device/User
│
│ 1. Update sensor value
│
▼
Firebase Realtime Database
│
│ 2. Triggers real-time event
│
▼
Firebase SDK (onValue listener)
│
│ 3. Callback with new data
│
▼
Sensor Service (subscribeSensorData)
│
│ 4. Transform & validate data
│
▼
React Component (setSensors)
│
│ 5. Update state
│
▼
LiveSensorCard Components
│
│ 6. Re-render with new values
│
▼
User sees updated data ✅

```

## 🔄 Real-time Update Flow

```

Time: 10:00:00 AM
┌──────────────┐
│ Firebase DB │ temp-living.currentValue = 22.5
└──────┬───────┘
│
│ WebSocket connection (always listening)
│
▼
┌──────────────┐
│ Your App │ Display: 22.5°C
└──────────────┘

Time: 10:00:05 AM (User changes value in Firebase Console)
┌──────────────┐
│ Firebase DB │ temp-living.currentValue = 25.5
└──────┬───────┘
│
│ Instant push notification via WebSocket
│
▼
┌──────────────┐
│ Your App │ Display: 25.5°C (updated automatically!)
└──────────────┘

```

**No polling needed! Changes propagate instantly via WebSocket connection.**

## 🗂️ File Structure

```

ecotrackai-dashboard/
│
├── .env # Firebase credentials
│
├── lib/
│ ├── firebase.ts # Firebase initialization
│ ├── firebase-sensors.ts # Sensor data service
│ └── firebase-test-data.ts # Sample test data
│
├── app/
│ └── live-monitoring/
│ └── page.tsx # Main dashboard page
│
├── components/
│ └── sensors/
│ └── LiveSensorCard.tsx # Sensor display component
│
├── scripts/
│ ├── test-firebase-connection.js # Test connection
│ ├── add-test-data.js # Add sample data
│ └── README.md # Scripts documentation
│
└── Documentation/
├── FIREBASE_INTEGRATION.md # Complete guide
├── QUICK_START.md # Quick start
├── SUMMARY.md # Project summary
└── ARCHITECTURE.md # This file

```

## 🔐 Security Configuration

### Development (Current)

```

Firebase Rules:
├── Read: ✅ Public (anyone can read)
└── Write: ✅ Public (anyone can write)

```

### Production (Recommended)

```

Firebase Rules:
├── Read: ✅ Public (anyone can read)
└── Write: 🔒 Authenticated users only

````

## 💾 Data Model

### Sensor Object

```typescript
interface FirebaseSensorData {
  id: string; // Unique identifier
  sensorName: string; // Display name
  currentValue: number | string; // Current reading
  unit: string; // Unit of measurement
  status: "normal" | "warning" | "critical" | "offline";
  description?: string; // Optional description
  category?: string; // temperature, humidity, power, etc.
  room?: string; // Room location
  lastUpdate?: string; // ISO timestamp
}
````

### Example

```json
{
  "id": "temp-living",
  "sensorName": "Living Room Temperature",
  "currentValue": 22.5,
  "unit": "°C",
  "status": "normal",
  "description": "Main living area",
  "category": "temperature",
  "room": "living-room",
  "lastUpdate": "2025-12-24T15:53:22.209Z"
}
```

## 🔌 Connection States

```
┌─────────────┐
│ Connecting  │ Initial state, establishing connection
└──────┬──────┘
       │
       ▼
┌─────────────┐
│  Connected  │ Firebase connection established
└──────┬──────┘
       │
       ├──► Has Data ──► 🟢 "Live from Firebase"
       │
       └──► No Data ──► 🟠 "Using mock data"

Error ──► 🔴 "Failed to connect"
```

## 📡 API Methods

### Subscription Methods (Real-time)

```typescript
// Subscribe to all sensors
subscribeSensorData(callback) → unsubscribe()

// Subscribe to one sensor
subscribeSingleSensor(sensorId, callback) → unsubscribe()

// Subscribe to sensors in a room
subscribeSensorsByRoom(room, callback) → unsubscribe()

// Subscribe to sensors by category
subscribeSensorsByCategory(category, callback) → unsubscribe()
```

### Fetch Methods (One-time)

```typescript
// Fetch all sensors once
fetchSensorData() → Promise<FirebaseSensorData[]>
```

## 🎯 Key Features

✅ **Real-time Updates** - Changes sync instantly via WebSocket
✅ **No Polling** - Efficient, event-driven architecture
✅ **Automatic Reconnection** - Handles network interruptions
✅ **Graceful Fallback** - Mock data if Firebase is empty
✅ **Connection Status** - Visual indicator of connection state
✅ **Type Safety** - Full TypeScript support
✅ **Easy to Use** - Simple API with hooks integration
✅ **Scalable** - Can handle hundreds of sensors

## 🚀 Performance Characteristics

- **Initial Load**: ~500ms (includes Firebase SDK initialization)
- **Update Latency**: ~50-200ms (Firebase WebSocket)
- **Memory**: Minimal overhead, only active subscriptions
- **Network**: Single WebSocket connection, reused for all sensors
- **Battery**: Efficient, no polling

## 🔧 Configuration

All configuration is done via environment variables in `.env`:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id
NEXT_PUBLIC_FIREBASE_DATABASE_URL=your-database-url
```

---

**Architecture Version:** 1.0  
**Last Updated:** December 24, 2025  
**Status:** ✅ Production Ready
