# Firebase to PostgreSQL Integration

This integration allows you to:
- ✅ Store Firebase sensor data in PostgreSQL for historical analysis
- ✅ Query historical data with flexible date ranges and filters
- ✅ View trends and patterns over time
- ✅ Export data for external analysis

## Quick Start

### 1. Install PostgreSQL
Download and install from [postgresql.org](https://www.postgresql.org/download/)

### 2. Run Setup Script (Windows)
```powershell
.\scripts\setup-postgres.ps1
```

Or manually:
```bash
# Create database
psql -U postgres -c "CREATE DATABASE ecotrackai;"

# Run schema
psql -U postgres -d ecotrackai -f database/schema.sql
```

### 3. Configure Environment
Create `.env.local` in project root:
```env
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
POSTGRES_DATABASE=ecotrackai
POSTGRES_USER=postgres
POSTGRES_PASSWORD=your_password
```

### 4. Start Development Server
```bash
npm run dev
```

### 5. Sync Firebase Data
```bash
node scripts/sync-firebase-to-postgres.js
```

Or use the API:
```bash
curl -X POST http://localhost:3000/api/sync-firebase
```

### 6. View Historical Data
Navigate to: http://localhost:3000/history

## Architecture

```
┌─────────────┐
│   Firebase  │  Real-time sensor data
│  Realtime   │
│  Database   │
└──────┬──────┘
       │
       │ Sync (via API)
       ▼
┌─────────────┐
│ PostgreSQL  │  Historical data storage
│  Database   │
└──────┬──────┘
       │
       │ Query
       ▼
┌─────────────┐
│   History   │  Data visualization
│    Page     │
└─────────────┘
```

## API Endpoints

### Sync Firebase to PostgreSQL
```http
POST /api/sync-firebase
```
Fetches current Firebase data and stores in PostgreSQL

### Get Historical Data
```http
GET /api/historical-data?startDate=2024-12-01&endDate=2024-12-25&roomIds=living-room
```

### Get Rooms
```http
GET /api/rooms
```

## Database Schema

### Tables
- **rooms** - Room/location information
- **sensor_data** - Historical sensor readings

### Views
- **sensor_data_hourly** - Hourly aggregated data
- **sensor_data_daily** - Daily aggregated data

## Automated Syncing

### Option 1: Node-cron (Recommended for development)
```bash
npm install node-cron
```

```javascript
// Auto-sync every 5 minutes
const cron = require('node-cron');

cron.schedule('*/5 * * * *', async () => {
  await fetch('http://localhost:3000/api/sync-firebase', { method: 'POST' });
});
```

### Option 2: System Cron (Linux/macOS)
```bash
# Edit crontab
crontab -e

# Add this line (sync every 5 minutes)
*/5 * * * * curl -X POST http://localhost:3000/api/sync-firebase
```

### Option 3: Windows Task Scheduler
1. Open Task Scheduler
2. Create Basic Task
3. Trigger: Every 5 minutes
4. Action: `curl -X POST http://localhost:3000/api/sync-firebase`

## Data Export

Export sensor data to CSV:
```bash
psql -U postgres -d ecotrackai -c "COPY (SELECT * FROM sensor_data WHERE timestamp >= NOW() - INTERVAL '30 days') TO STDOUT WITH CSV HEADER" > data.csv
```

## Maintenance

### View Data
```sql
-- Recent readings
SELECT * FROM sensor_data ORDER BY timestamp DESC LIMIT 100;

-- Hourly averages
SELECT * FROM sensor_data_hourly WHERE hour >= NOW() - INTERVAL '7 days';
```

### Clean Old Data
```sql
-- Delete data older than 90 days
SELECT cleanup_old_sensor_data(90);
```

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Connection refused | Check PostgreSQL is running: `systemctl status postgresql` |
| Permission denied | Grant privileges: `GRANT ALL PRIVILEGES ON DATABASE ecotrackai TO postgres;` |
| No data showing | Run sync: `POST /api/sync-firebase` |
| Slow queries | Use hourly aggregation for long date ranges |

## Files Overview

```
├── database/
│   └── schema.sql              # Database schema and tables
├── lib/
│   ├── database.ts             # PostgreSQL connection and queries
│   ├── api.ts                  # Updated to use real endpoints
│   └── firebase-sensors.ts     # Firebase data fetching
├── app/api/
│   ├── sync-firebase/route.ts  # Sync endpoint
│   ├── historical-data/route.ts # Historical data endpoint
│   └── rooms/route.ts          # Rooms endpoint
├── scripts/
│   ├── setup-postgres.ps1      # Setup script (Windows)
│   └── sync-firebase-to-postgres.js # Manual sync script
└── docs/
    └── postgresql-setup.md     # Detailed documentation
```

## Production Deployment

### Managed PostgreSQL Services
- **AWS RDS** - Reliable, scalable
- **Google Cloud SQL** - Good integration with GCP
- **Azure Database** - Good for Azure deployments
- **Supabase** - PostgreSQL + additional features
- **Neon** - Serverless PostgreSQL

### Environment Variables
Set in your hosting platform:
- `POSTGRES_HOST`
- `POSTGRES_PORT`
- `POSTGRES_DATABASE`
- `POSTGRES_USER`
- `POSTGRES_PASSWORD`

## Documentation

For detailed setup instructions, see:
- [PostgreSQL Setup Guide](./postgresql-setup.md)
- [API Documentation](../README.md)

## Support

- PostgreSQL Docs: https://www.postgresql.org/docs/
- Next.js API Routes: https://nextjs.org/docs/api-routes
- Firebase Docs: https://firebase.google.com/docs
