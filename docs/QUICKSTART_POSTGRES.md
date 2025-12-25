# Quick Start: Firebase to PostgreSQL Integration

## 🚀 5-Minute Setup

### Prerequisites
- PostgreSQL installed
- Firebase configured
- Development server running

### Steps

#### 1. Install PostgreSQL
Download from [postgresql.org](https://www.postgresql.org/download/)

#### 2. Run Setup (Windows PowerShell)
```powershell
cd ecotrackai-dashboard
.\scripts\setup-postgres.ps1
```

The script will:
- ✅ Check PostgreSQL installation
- ✅ Create database
- ✅ Set up schema
- ✅ Configure `.env.local`

#### 3. Start Development Server
```bash
npm run dev
```

#### 4. Sync Firebase Data
```bash
node scripts/sync-firebase-to-postgres.js
```

Expected output:
```
🔄 Starting Firebase to PostgreSQL sync...

1️⃣ Testing database connection...
✅ Database connection successful

2️⃣ Syncing Firebase data to PostgreSQL...
✅ Sync completed successfully!

📊 Summary:
   - Sensors synced: 12
   - Rooms processed: 5
   - Timestamp: 2024-12-25T10:30:00.000Z

💡 You can now view historical data at:
   http://localhost:3000/history
```

#### 5. View Historical Data
Open browser: http://localhost:3000/history

The page will now show **real data from PostgreSQL** instead of mock data!

## 🔄 Automated Syncing (Optional)

### Every 5 Minutes
```bash
npm install node-cron
```

Create `sync-cron.js`:
```javascript
const cron = require('node-cron');

cron.schedule('*/5 * * * *', async () => {
  await fetch('http://localhost:3000/api/sync-firebase', { method: 'POST' });
});
```

Run it:
```bash
node sync-cron.js
```

## ✅ Verify It's Working

1. **Check database has data:**
   ```bash
   psql -U postgres -d ecotrackai -c "SELECT COUNT(*) FROM sensor_data;"
   ```

2. **Test API:**
   ```bash
   curl http://localhost:3000/api/rooms
   ```

3. **View in browser:**
   Navigate to http://localhost:3000/history

## 🆘 Issues?

See [docs/postgresql-setup.md](./postgresql-setup.md) for troubleshooting.
