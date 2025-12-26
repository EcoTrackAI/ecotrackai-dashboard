# EcoTrack AI Dashboard

> Smart Home Energy Monitoring & Automation Platform

Modern real-time energy monitoring dashboard built with Next.js, TypeScript, Firebase, and PostgreSQL.

## ✨ Features

- Real-Time Monitoring - Live sensor data with Firebase
- Historical Analytics - PostgreSQL data storage
- Smart Automation - Intelligent device control
- Energy Insights - AI-powered recommendations
- Responsive Design - Works on all devices

## 🚀 Quick Start

```bash
npm install
cp .env.local.example .env.local  # Edit with your credentials
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

## 📦 Deploy to Vercel

1. **Set Environment Variables** (see `.env.production`)

   - `DATABASE_URL` - PostgreSQL connection
   - Firebase config (already set)
   - `NEXT_PUBLIC_API_URL` - Your Vercel domain

2. **Deploy**

   ```bash
   npm i -g vercel
   vercel --prod
   ```

3. **Setup Database**
   ```bash
   psql $DATABASE_URL < database/schema.sql
   ```

See [DEPLOYMENT.md](DEPLOYMENT.md) for details.

## 🔄 Data Sync

Auto-syncs Firebase to PostgreSQL every minute via Vercel Cron (configured in `vercel.json`).

## 📊 API Endpoints

- `GET /api/rooms` - List rooms
- `GET /api/historical-data` - Query historical data
- `POST /api/sync-firebase` - Manual sync

## 🛠️ Development

```bash
npm run dev      # Dev server
npm run build    # Production build
npm run start    # Production server
```

## 🎨 Tech Stack

- Next.js 16 + React 19
- TypeScript 5
- Tailwind CSS 4
- Firebase Realtime Database
- PostgreSQL
- Recharts

## 📝 License

MIT

## � Configuration

### Firebase Setup

1. Create project at [console.firebase.google.com](https://console.firebase.google.com)
2. Enable Realtime Database
3. Copy config to `.env.local`

### Database Setup

Connection string format:

```
postgresql://user:password@host:port/database
```

## 🔄 Data Sync

The app syncs Firebase data to PostgreSQL every minute using Vercel Cron Jobs (configured in `vercel.json`).

Manual sync:

```bash
curl -X POST https://your-domain.vercel.app/api/sync-firebase
```

## 📊 API Endpoints

- `GET /api/rooms` - List all rooms
- `GET /api/historical-data` - Query historical data
  - Query params: `startDate`, `endDate`, `roomIds`, `aggregation`
- `POST /api/sync-firebase` - Sync Firebase to PostgreSQL

## 🛠️ Development

```bash
npm run dev      # Start dev server
npm run build    # Build for production
npm run start    # Start production server
```

## 🎨 Tech Stack

- Next.js 16 (React 19)
- TypeScript 5
- Tailwind CSS 4
- Firebase Realtime Database
- PostgreSQL
- Recharts

## 🐛 Troubleshooting

**Firebase Connection Issues**

- Verify environment variables
- Check Firebase database rules
- Ensure Realtime Database is enabled

**Database Connection in Production**

- Use `DATABASE_URL` environment variable
- Ensure SSL is enabled for cloud providers
- Check connection string format

**Build Errors**

- Clear `.next`: `rm -rf .next`
- Reinstall deps: `rm -rf node_modules && npm install`

## 📝 License

MIT

## 🤝 Contributing

Contributions welcome! Open an issue or PR.
