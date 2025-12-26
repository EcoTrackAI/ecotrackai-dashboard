# System Architecture

## Overview

EcoTrack AI Dashboard follows a modern, scalable architecture using Next.js App Router, Firebase for real-time data, and PostgreSQL for historical storage.

## Architecture Diagram

```
┌──────────────────────────────────────────────────────────────────────┐
│                         Client Layer (Browser)                       │
│    ┌───────────────┐  ┌───────────────┐  ┌──────────────────────┐    │
│    │  React Pages  │  │  Components   │  │  Client Providers    │    │
│    │  (App Router) │  │  (UI Logic)   │  │  (DataSyncProvider)  │    │
│    └─────┬─────────┘  └─────┬─────────┘  └──────────┬───────────┘    │
└──────────┼──────────────────┼───────────────────────┼────────────────┘
           │                  │                       │
           │                  │                       │ Sync Timer (60s)
           │                  │                       │
┌──────────▼──────────────────▼───────────────────────▼────────────────┐
│                      Next.js Application Layer                       │
│                                                                      │
│  ┌───────────────────────────────────────────────────────────────┐   │
│  │                    API Routes (Serverless)                    │   │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────────┐     │   │
│  │  │ /api/rooms   │  │/api/hist-data│  │/api/sync-firebase│     │   │
│  │  └──────┬───────┘  └───────┬──────┘  └─────────┬────────┘     │   │
│  └─────────┼──────────────────┼───────────────────┼──────────────┘   │
│            │                  │                   │                  │
│  ┌─────────▼──────────────────▼───────────────────▼──────────────┐   │
│  │                      Library Layer (lib/)                     │   │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────────────┐ │   │
│  │  │ database.ts  │  │  firebase.ts │  │ firebase-sensors.ts  │ │   │
│  │  │ (PostgreSQL) │  │  (Init)      │  │ (Subscriptions)      │ │   │
│  │  └──────┬───────┘  └───────┬──────┘  └─────────┬────────────┘ │   │
│  └─────────┼──────────────────┼───────────────────┼──────────────┘   │
└────────────┼──────────────────┼───────────────────┼──────────────────┘
             │                  │                   │
             │                  │                   │
┌────────────▼──────────────────▼───────────────────▼──────────────────┐
│                          Data Layer                                  │
│                                                                      │
│  ┌────────────────────────────┐      ┌───────────────────────────┐   │
│  │    PostgreSQL Database     │      │  Firebase Realtime DB     │   │
│  │                            │      │                           │   │
│  │  • rooms                   │      │  • /sensors               │   │
│  │  • sensor_data             │◄─────┤  • /system-status         │   │
│  │  • sensor_data_hourly      │ Sync │  • Live updates           │   │
│  │  • sensor_data_daily       │      │                           │   │
│  └────────────────────────────┘      └───────────────────────────┘   │
│                                                                      │
└──────────────────────────────────────────────────────────────────────┘
                                  │
                                  │ Sensor Data Feed
                                  ▼
                     ┌─────────────────────────┐
                     │   IoT Sensors/Devices   │
                     │  (ESP32, Arduino, etc)  │
                     └─────────────────────────┘
```

## Component Architecture

### 1. Frontend Layer (React Components)

**Location**: `/app` and `/components`

#### Pages (App Router)

- **`/app/page.tsx`** - Dashboard overview with metrics, sensors, rooms
- **`/app/live-monitoring/page.tsx`** - Real-time sensor monitoring
- **`/app/history/page.tsx`** - Historical data analysis
- **`/app/analytics/page.tsx`** - Energy analytics and charts
- **`/app/automation/page.tsx`** - Device automation controls
- **`/app/insights/page.tsx`** - AI-powered recommendations
- **`/app/profile/page.tsx`** - User profile management
- **`/app/settings/page.tsx`** - Application settings

#### Reusable Components

- **Metrics** (`/components/metrics`) - Metric cards with trends
- **Sensors** (`/components/sensors`) - Live sensor displays
- **Rooms** (`/components/rooms`) - Room status cards
- **Charts** (`/components/charts`) - Data visualization
- **Automation** (`/components/automation`) - Control panels
- **Navigation** (`/components/navigation`) - Nav, sidebar, header

### 2. Application Layer (Next.js)

**Location**: `/app/api` and `/lib`

#### API Routes (Serverless Functions)

**`/api/rooms`** - Room Management

- `GET` - List all rooms
- Returns: `DBRoom[]`

**`/api/historical-data`** - Historical Queries

- `GET` - Query sensor data by date range and rooms
- Query params: `startDate`, `endDate`, `roomIds`
- Returns: `HistoricalDataPoint[]`

**`/api/sync-firebase`** - Data Synchronization

- `POST` - Sync Firebase data to PostgreSQL
- `GET` - Check database connection status
- Returns: Sync status and record counts

#### Library Modules

**`lib/firebase.ts`** - Firebase Initialization

```typescript
export function initializeFirebase(): { app; database };
export function getFirebaseDatabase(): Database;
```

**`lib/firebase-sensors.ts`** - Sensor Data Subscriptions

```typescript
export function subscribeSensorData(callback): unsubscribe;
export function subscribeSingleSensor(id, callback): unsubscribe;
export async function fetchSensorData(): FirebaseSensorData[];
```

**`lib/database.ts`** - PostgreSQL Operations

```typescript
export function getPool(): Pool;
export async function getRooms(): DBRoom[];
export async function upsertRoom(id, name, floor, type): void;
export async function batchInsertSensorData(records): void;
export async function getHistoricalData(
  start,
  end,
  rooms
): HistoricalDataPoint[];
export async function testConnection(): boolean;
```

### 3. Data Layer

#### Firebase Realtime Database

**Structure:**

```json
{
  "sensors": {
    "sensor-id-1": {
      "id": "sensor-id-1",
      "sensorName": "Living Room Temperature",
      "currentValue": 22.5,
      "unit": "°C",
      "status": "normal",
      "category": "temperature",
      "room": "living-room",
      "lastUpdate": "2025-12-26T10:30:00Z"
    }
  },
  "system-status": {
    "status": "online",
    "lastUpdate": "2025-12-26T10:30:00Z"
  }
}
```

**Usage:**

- Real-time sensor readings
- Live system status
- Immediate updates to all connected clients
- WebSocket connections for low latency

#### PostgreSQL Database

**Schema:**

```sql
rooms (
  id VARCHAR(50) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  floor INTEGER,
  type VARCHAR(100),
  created_at TIMESTAMP,
  updated_at TIMESTAMP
)

sensor_data (
  id SERIAL PRIMARY KEY,
  sensor_id VARCHAR(100) NOT NULL,
  sensor_name VARCHAR(255) NOT NULL,
  room_id VARCHAR(50) REFERENCES rooms(id),
  category VARCHAR(50) NOT NULL,
  current_value NUMERIC(10, 2) NOT NULL,
  unit VARCHAR(20) NOT NULL,
  status VARCHAR(20) NOT NULL,
  description TEXT,
  timestamp TIMESTAMP NOT NULL,
  created_at TIMESTAMP
)

-- Views for aggregated data
sensor_data_hourly (view)
sensor_data_daily (view)
```

**Usage:**

- Long-term data storage
- Historical queries and analytics
- Time-series aggregations
- Data export and reporting

## Data Flow

### Real-Time Monitoring Flow

```
IoT Sensor → Firebase RTDB → WebSocket → React Component → UI Update
    (1ms)        (10-50ms)      (10ms)       (16ms)
```

1. **IoT sensor** reads value and pushes to Firebase
2. **Firebase RTDB** broadcasts change to all listeners
3. **React component** receives update via `subscribeSensorData()`
4. **Component re-renders** with new data
5. **UI updates** displayed to user

### Historical Data Sync Flow

```
Firebase RTDB → Sync Timer → API Call → Batch Insert → PostgreSQL
   (Live)        (60s)        (100ms)     (200ms)
```

1. **DataSyncProvider** triggers every 60 seconds
2. **API `/api/sync-firebase`** called via POST
3. **Firebase data fetched** with `fetchSensorData()`
4. **Rooms created/updated** via `upsertRoom()`
5. **Sensor data batch inserted** via `batchInsertSensorData()`
6. **PostgreSQL stores** for historical analysis

### Historical Query Flow

```
User Input → API Call → PostgreSQL Query → Data Transform → Chart Render
   (0ms)      (100ms)      (50-200ms)         (10ms)         (16ms)
```

1. **User selects** date range and rooms in history page
2. **API `/api/historical-data`** called with params
3. **PostgreSQL query** executes with date filters
4. **Data aggregation** performed (raw or hourly)
5. **Results returned** as `HistoricalDataPoint[]`
6. **Recharts renders** visualization

## Security Architecture

### Environment Variables

- All sensitive configs in `.env.local` (never committed)
- `NEXT_PUBLIC_*` prefix for client-safe variables
- Database credentials server-side only

### Firebase Security

- Realtime Database rules configured
- Read/write permissions set per path
- Anonymous read allowed (for public dashboards)
- Write restricted to authenticated users

### PostgreSQL Security

- Connection pooling with SSL in production
- Prepared statements prevent SQL injection
- Row-level security (RLS) ready
- Backup and recovery configured

### API Security

- Server-side validation on all endpoints
- Rate limiting (via Vercel)
- CORS configuration
- Error handling without data leaks

## Performance Optimizations

### Frontend

- React Server Components for reduced JS bundle
- Client components only when needed
- Image optimization with Next.js Image
- Code splitting by route
- Lazy loading for charts

### Backend

- Connection pooling (20 max connections)
- Batch inserts for sensor data
- Indexed queries on timestamp and room_id
- Materialized views for aggregations
- Caching with React Cache

### Database

- Composite indexes on common query patterns
- Hourly and daily aggregate views
- Old data cleanup function
- Query optimization with EXPLAIN

## Scalability

### Horizontal Scaling

- Serverless API routes scale automatically
- Firebase RTDB handles millions of concurrent connections
- PostgreSQL can scale with read replicas

### Vertical Scaling

- Connection pool adjustable
- Database resources upgradeable
- Vercel plan tiers available

### Data Volume

- 10K sensors × 1 reading/minute × 365 days = 5.26B records/year
- With cleanup function: Retain 90 days = 1.3B records
- Partitioning strategy available for larger deployments

## Monitoring & Observability

### Logging

- Console logs in development
- Vercel logs in production
- Error tracking ready for Sentry integration

### Metrics

- API response times via Vercel Analytics
- Database query performance
- Firebase usage dashboard
- Custom metrics via telemetry

### Alerts

- Database connection failures
- Sync failures logged
- High error rates detectable
- Performance degradation monitoring

## Deployment Architecture

### Development

```
Local Machine → Next.js Dev Server → Firebase (Dev) → PostgreSQL (Local)
```

### Production (Vercel)

```
GitHub Push → Vercel Build → Deploy Edge Functions → Firebase (Prod) → Neon PostgreSQL
```

- Automatic deployments on git push
- Preview deployments for PRs
- Environment variables per environment
- Edge functions globally distributed

## Technology Choices

### Why Next.js?

- Server and client components
- Built-in API routes
- Excellent TypeScript support
- Automatic code splitting
- Image optimization
- SEO friendly

### Why Firebase RTDB?

- True real-time updates (WebSocket)
- Offline support
- Automatic scaling
- Simple SDK
- Cost-effective for read-heavy workloads

### Why PostgreSQL?

- Reliable time-series storage
- Complex queries and aggregations
- ACID compliance
- Mature ecosystem
- Easy backups and migrations

### Why Vercel?

- Best Next.js hosting
- Automatic scaling
- Edge functions
- Preview deployments
- Easy environment management

## Future Architecture Considerations

### Planned Improvements

1. **User Authentication** - Firebase Auth integration
2. **WebSocket API** - For even faster updates
3. **Message Queue** - RabbitMQ/Redis for buffering
4. **Microservices** - Split API into services
5. **GraphQL API** - Alternative to REST
6. **Edge Caching** - CDN for static assets
7. **Data Lake** - S3 for long-term archival

### Alternative Architectures

- **Serverless-first**: All functions, no long-running processes
- **Monolithic**: Single server application
- **Microservices**: Separate services for each domain
- **Event-driven**: Message bus between services
