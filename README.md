# EcoTrack AI Dashboard

> Smart Home Energy Monitoring & Automation Platform

A modern, real-time energy monitoring dashboard built with Next.js 16, TypeScript, Firebase Realtime Database, and PostgreSQL. Monitor your home's energy consumption, automate devices, and gain AI-powered insights to reduce costs and environmental impact.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Next.js](https://img.shields.io/badge/Next.js-16.1-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue)

## 🌟 Overview

EcoTrack AI is a comprehensive smart home energy management system that helps you reduce energy costs, automate smart devices, monitor in real-time, analyze historical trends, and get AI-powered insights for energy efficiency.

## ✨ Features

- **Real-Time Monitoring** - Live sensor data with Firebase Realtime Database
- **Historical Analytics** - PostgreSQL data storage with time-series queries
- **Smart Automation** - Intelligent device control and scheduling
- **Energy Insights** - AI-powered recommendations
- **Responsive Design** - Works seamlessly on all devices
- **Auto Data Sync** - Client-side sync every minute (no cron jobs needed)

## 🏗️ Tech Stack

- **Next.js 16.1** - React framework with App Router
- **React 19** - UI library
- **TypeScript 5** - Type-safe development
- **Tailwind CSS 4** - Styling
- **Recharts 3.6** - Data visualization
- **Firebase 12.7** - Real-time database
- **PostgreSQL** - Historical data storage

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm
- PostgreSQL database (local or Neon)
- Firebase project with Realtime Database

### Installation

```bash
# Install dependencies
npm install

# Setup environment variables
cp .env.local.example .env.local
# Setup environment variables
cp .env.local.example .env.local
# Edit .env.local with your credentials

# Setup database schema
psql -U postgres -d ecotrackai -f database/schema.sql

# Run development server
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

## 📖 Documentation

Comprehensive documentation is available in the `/docs` folder:

- **[Architecture](docs/ARCHITECTURE.md)** - System design, data flow, technology stack
- **[API Reference](docs/API.md)** - Complete API endpoint documentation
- **[Components](docs/COMPONENTS.md)** - Component library and usage guide
- **[Features](docs/FEATURES.md)** - Detailed feature documentation
- **[Deployment](docs/DEPLOYMENT.md)** - Production deployment guide
- **[Development](docs/DEVELOPMENT.md)** - Development workflow and standards
- **[Project Summary](docs/PROJECT-SUMMARY.md)** - Complete project overview

## 📦 Deploy to Vercel

### 1. Environment Variables

In your Vercel project settings, add these variables:

**Firebase Configuration:**

- `NEXT_PUBLIC_FIREBASE_API_KEY`
- `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
- `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
- `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
- `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
- `NEXT_PUBLIC_FIREBASE_APP_ID`
- `NEXT_PUBLIC_FIREBASE_DATABASE_URL`

**Database Configuration:**

- `DATABASE_URL` or `POSTGRES_URL` - Your connection string

### 2. Deploy

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy to production
vercel --prod
```

### 3. Setup Database Schema

```bash
# Using Neon dashboard SQL editor or psql
psql $DATABASE_URL -f database/schema.sql
```

See [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md) for complete deployment guide.

## 🔄 Data Synchronization

The app uses **client-side automatic syncing** (no server-side cron jobs needed):

- Data syncs every **60 seconds** automatically
- Firebase sensor data → PostgreSQL historical storage
- Implemented via `DataSyncProvider` component
- Works on Vercel free tier

## 📊 API Endpoints

| Endpoint               | Method | Description                         |
| ---------------------- | ------ | ----------------------------------- |
| `/api/rooms`           | GET    | List all rooms                      |
| `/api/historical-data` | GET    | Query historical sensor data        |
| `/api/sync-firebase`   | POST   | Trigger Firebase to PostgreSQL sync |
| `/api/sync-firebase`   | GET    | Check database connection status    |

See [docs/API.md](docs/API.md) for detailed API documentation.

## 🛠️ Development

```bash
npm run dev      # Start development server (port 3000)
npm run build    # Create production build
npm run start    # Start production server
npm run lint     # Run ESLint
```

See [docs/DEVELOPMENT.md](docs/DEVELOPMENT.md) for development workflow.
npm install

# Rebuild

npm run build

```

## 📝 License

MIT License - see LICENSE file for details

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📧 Support

For issues or questions, please open an issue on GitHub.
```
