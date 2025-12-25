# PostgreSQL Integration Setup Guide

This guide will help you set up PostgreSQL integration for storing and retrieving historical sensor data from Firebase.

## Prerequisites

- Node.js and npm installed
- PostgreSQL server installed and running (v12 or higher recommended)
- Firebase project configured with sensor data

## Step 1: Install PostgreSQL

### Windows
1. Download PostgreSQL from [postgresql.org](https://www.postgresql.org/download/windows/)
2. Run the installer and follow the setup wizard
3. Remember the password you set for the `postgres` user
4. Default port is 5432

### macOS
```bash
brew install postgresql@15
brew services start postgresql@15
```

### Linux (Ubuntu/Debian)
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
```

## Step 2: Create Database

1. Open PostgreSQL command line (psql):
```bash
# Windows
psql -U postgres

# macOS/Linux
sudo -u postgres psql
```

2. Create the database:
```sql
CREATE DATABASE ecotrackai;
```

3. Exit psql:
```
\q
```

## Step 3: Run Database Schema

Navigate to your project directory and run the schema file:

```bash
# Windows
psql -U postgres -d ecotrackai -f database/schema.sql

# macOS/Linux
sudo -u postgres psql -d ecotrackai -f database/schema.sql
```

This will create:
- `rooms` table - Stores room information
- `sensor_data` table - Stores historical sensor readings
- Indexes for optimized queries
- Views for aggregated data (hourly and daily)
- Helper functions for data cleanup

## Step 4: Configure Environment Variables

Create a `.env.local` file in the root of your project:

```env
# PostgreSQL Connection
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
POSTGRES_DATABASE=ecotrackai
POSTGRES_USER=postgres
POSTGRES_PASSWORD=your_password_here

# Firebase Configuration (if not already set)
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
NEXT_PUBLIC_FIREBASE_DATABASE_URL=your_database_url
```

**Note**: Never commit `.env.local` to version control!

## Step 5: Test Database Connection

Run the development server:

```bash
npm run dev
```

Test the connection by visiting:
```
http://localhost:3000/api/sync-firebase
```

You should see:
```json
{
  "databaseConnected": true,
  "message": "Database connection successful. Use POST to sync data."
}
```

## Step 6: Sync Data from Firebase

### Manual Sync

Use curl or Postman to trigger a sync:

```bash
curl -X POST http://localhost:3000/api/sync-firebase
```

Or visit the URL in your browser and use a REST client.

### Response

Success response:
```json
{
  "message": "Successfully synced Firebase data to PostgreSQL",
  "synced": 12,
  "rooms": 5,
  "timestamp": "2024-12-25T10:30:00.000Z"
}
```

### Automated Sync (Recommended)

For production, set up a cron job or scheduled task to sync data periodically.

#### Using Node Cron (Add to your project)

1. Install node-cron:
```bash
npm install node-cron
```

2. Create `scripts/sync-scheduler.js`:
```javascript
const cron = require('node-cron');

// Sync every 5 minutes
cron.schedule('*/5 * * * *', async () => {
  try {
    console.log('Running Firebase sync...');
    const response = await fetch('http://localhost:3000/api/sync-firebase', {
      method: 'POST'
    });
    const result = await response.json();
    console.log('Sync completed:', result);
  } catch (error) {
    console.error('Sync failed:', error);
  }
});

console.log('Sync scheduler started');
```

3. Run the scheduler:
```bash
node scripts/sync-scheduler.js
```

#### Using System Cron (Linux/macOS)

1. Open crontab:
```bash
crontab -e
```

2. Add this line to sync every 5 minutes:
```
*/5 * * * * curl -X POST http://localhost:3000/api/sync-firebase
```

#### Using Windows Task Scheduler

1. Open Task Scheduler
2. Create Basic Task
3. Set trigger (e.g., every 5 minutes)
4. Action: Start a program
5. Program: `curl`
6. Arguments: `-X POST http://localhost:3000/api/sync-firebase`

## Step 7: View Historical Data

1. Navigate to the History page in your dashboard:
   ```
   http://localhost:3000/history
   ```

2. The page will now fetch real data from PostgreSQL instead of mock data

3. Select date ranges and rooms to view historical trends

## API Endpoints

### 1. Sync Firebase Data
**POST** `/api/sync-firebase`

Fetches current sensor data from Firebase and stores it in PostgreSQL.

**Response:**
```json
{
  "message": "Successfully synced Firebase data to PostgreSQL",
  "synced": 12,
  "rooms": 5,
  "timestamp": "2024-12-25T10:30:00.000Z"
}
```

### 2. Get Historical Data
**GET** `/api/historical-data`

**Query Parameters:**
- `startDate` (required): ISO date string
- `endDate` (required): ISO date string
- `roomIds` (optional): Comma-separated room IDs
- `aggregation` (optional): 'raw' or 'hourly' (default: 'raw')

**Example:**
```
/api/historical-data?startDate=2024-12-01T00:00:00Z&endDate=2024-12-25T23:59:59Z&roomIds=living-room,bedroom
```

**Response:**
```json
{
  "data": [
    {
      "timestamp": "2024-12-25T10:00:00Z",
      "roomId": "living-room",
      "roomName": "Living Room",
      "energy": 2.5,
      "power": 450,
      "temperature": 22.5,
      "humidity": 55
    }
  ],
  "count": 150,
  "startDate": "2024-12-01T00:00:00Z",
  "endDate": "2024-12-25T23:59:59Z",
  "roomIds": ["living-room", "bedroom"],
  "aggregation": "raw"
}
```

### 3. Get Rooms
**GET** `/api/rooms`

**Response:**
```json
{
  "rooms": [
    {
      "id": "living-room",
      "name": "Living Room",
      "floor": 1,
      "type": "residential"
    }
  ],
  "count": 5
}
```

## Database Maintenance

### View Data
```sql
-- View recent sensor data
SELECT * FROM sensor_data 
ORDER BY timestamp DESC 
LIMIT 100;

-- View hourly aggregated data
SELECT * FROM sensor_data_hourly 
WHERE hour >= NOW() - INTERVAL '7 days'
ORDER BY hour DESC;

-- View room statistics
SELECT 
  r.name,
  COUNT(sd.id) as reading_count,
  AVG(sd.current_value) as avg_value
FROM rooms r
LEFT JOIN sensor_data sd ON r.id = sd.room_id
GROUP BY r.name;
```

### Clean Old Data
```sql
-- Delete data older than 90 days
SELECT cleanup_old_sensor_data(90);
```

### Export Data
```bash
# Export to CSV
psql -U postgres -d ecotrackai -c "COPY (SELECT * FROM sensor_data WHERE timestamp >= NOW() - INTERVAL '30 days') TO STDOUT WITH CSV HEADER" > data_export.csv
```

## Troubleshooting

### Connection Refused
- Verify PostgreSQL is running: `sudo systemctl status postgresql` (Linux) or check Services (Windows)
- Check firewall settings
- Verify credentials in `.env.local`

### Permission Denied
- Ensure the database user has proper permissions:
```sql
GRANT ALL PRIVILEGES ON DATABASE ecotrackai TO postgres;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO postgres;
```

### No Data in History Page
1. Verify Firebase has sensor data
2. Run sync manually: `POST /api/sync-firebase`
3. Check database: `SELECT COUNT(*) FROM sensor_data;`
4. Check browser console for errors

### Slow Queries
- Ensure indexes are created (run schema.sql again)
- Use hourly aggregation for long date ranges
- Consider partitioning for very large datasets

## Production Deployment

### Environment Variables
Set these in your production environment (Vercel, AWS, etc.):
- `POSTGRES_HOST`
- `POSTGRES_PORT`
- `POSTGRES_DATABASE`
- `POSTGRES_USER`
- `POSTGRES_PASSWORD`

### Database Hosting Options
1. **AWS RDS** - Managed PostgreSQL
2. **Google Cloud SQL** - Managed PostgreSQL
3. **Azure Database** - Managed PostgreSQL
4. **Heroku Postgres** - Easy setup for smaller apps
5. **Supabase** - PostgreSQL with additional features
6. **Neon** - Serverless PostgreSQL

### Connection Pooling
For production, consider using connection pooling:
- pgBouncer
- Built-in pool (already configured in `lib/database.ts`)

### Monitoring
- Set up database monitoring
- Log sync failures
- Alert on connection issues
- Monitor query performance

## Next Steps

1. Set up automated syncing (cron job)
2. Configure database backups
3. Implement data export features in UI
4. Add data visualization enhancements
5. Set up monitoring and alerts

## Support

For issues or questions, refer to:
- PostgreSQL docs: https://www.postgresql.org/docs/
- Next.js API routes: https://nextjs.org/docs/api-routes
- Firebase docs: https://firebase.google.com/docs
