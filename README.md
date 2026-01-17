# 🌿 EcoTrack AI Dashboard

**Enterprise-Grade Smart Home Energy Monitoring & Automation Platform**

[![Next.js](https://img.shields.io/badge/Next.js-16.1-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Firebase](https://img.shields.io/badge/Firebase-12.7-FFCA28?style=flat-square&logo=firebase)](https://firebase.google.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-316192?style=flat-square&logo=postgresql)](https://www.postgresql.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38B2AC?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)

---

## 📖 Overview

**EcoTrack AI Dashboard** is a production-ready, real-time IoT energy monitoring and automation platform for smart homes and commercial buildings. It combines real-time sensor data visualization, historical analytics, intelligent automation, and comprehensive device control in a modern, responsive web interface.

### Business Value

- **📉 Cost Reduction**: Reduce energy bills by up to 30% through intelligent automation
- **⚡ Real-Time Visibility**: Monitor power consumption and environmental data instantly
- **📊 Data-Driven Insights**: Historical analytics reveal consumption patterns
- **🤖 Smart Automation**: Automated device control optimizes energy without manual intervention
- **🌍 Environmental Impact**: Track and reduce carbon footprint with detailed metrics

---

## ✨ Key Features

### 🔴 Live Monitoring

- Real-time sensor data with sub-second latency via Firebase
- Power monitoring (PZEM-004T sensors)
- Environmental sensors (temperature, humidity, light, motion)
- Room-by-room status tracking
- System health monitoring

### 📈 Analytics & Insights

- Historical data visualization with interactive charts
- Time-series analysis (hourly, daily, monthly aggregations)
- Power consumption trends
- Comparative analytics across rooms
- CSV export functionality

### 🎮 Automation & Control

- Smart device control (lights, fans, AC)
- Auto/manual mode switching
- Room-based device management
- Real-time relay state synchronization
- Scheduled automation support

### 🗂️ Data Management

- PostgreSQL for historical data storage
- Firebase Realtime Database for live data
- Efficient data aggregation
- Automated cleanup scheduling
- Database synchronization

---

## 🛠️ Tech Stack

### Frontend

- **Next.js 16.1** - React framework with App Router
- **React 19** - UI library with latest features
- **TypeScript 5** - Type-safe development
- **Tailwind CSS 4** - Utility-first styling
- **Recharts** - Data visualization
- **Lucide React** - Icon system

### Backend & APIs

- **Next.js API Routes** - Serverless functions
- **PostgreSQL** - Historical data storage
- **Firebase Realtime Database** - Live sensor data
- **Node.js** - Runtime environment

### Development Tools

- **ESLint** - Code linting
- **TypeScript Compiler** - Type checking
- **PostCSS** - CSS processing

---

## 🚀 Quick Start

### Prerequisites

- Node.js 20+ and npm
- PostgreSQL 14+
- Firebase project with Realtime Database
- Git

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/yourusername/ecotrackai-dashboard.git
   cd ecotrackai-dashboard
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Environment Configuration**

   Create `.env.local` file:

   ```env
   # PostgreSQL Database
   POSTGRES_HOST=localhost
   POSTGRES_PORT=5432
   POSTGRES_DB=ecotrackai
   POSTGRES_USER=your_user
   POSTGRES_PASSWORD=your_password

   # Firebase Configuration
   NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   NEXT_PUBLIC_FIREBASE_DATABASE_URL=https://your_project.firebaseio.com
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

   # Optional: Weather API
   NEXT_PUBLIC_WEATHER_API_KEY=your_openweather_key
   NEXT_PUBLIC_WEATHER_LAT=28.7041
   NEXT_PUBLIC_WEATHER_LON=77.1025

   # API Security (optional)
   SYNC_API_KEY=your_secret_key
   ```

4. **Database Setup**

   Run the database schema:

   ```bash
   psql -U your_user -d ecotrackai -f database/schema.sql
   ```

5. **Start Development Server**

   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000)

---

## 📁 Project Structure

```
ecotrackai-dashboard/
├── app/                      # Next.js App Router pages
│   ├── api/                  # API routes
│   │   ├── cleanup/          # Data cleanup endpoint
│   │   ├── debug/            # Debug information
│   │   ├── historical-data/  # Historical sensor data
│   │   ├── pzem-data/        # Power meter data
│   │   ├── relay-control/    # Device control
│   │   ├── relay-states/     # Relay status
│   │   ├── relay-sync/       # Firebase sync
│   │   ├── rooms/            # Room management
│   │   └── sync-firebase/    # Background sync
│   ├── analytics/            # Analytics dashboard
│   ├── automation/           # Automation controls
│   ├── debug-ui/             # Debug interface
│   ├── history/              # Historical data viewer
│   ├── live-monitoring/      # Real-time monitoring
│   ├── profile/              # User profile
│   ├── settings/             # System settings
│   ├── layout.tsx            # Root layout
│   └── page.tsx              # Home page
├── components/               # React components
│   ├── automation/           # Automation controls
│   ├── charts/               # Chart components
│   ├── history/              # History components
│   ├── metrics/              # Metric cards
│   ├── navigation/           # Navigation components
│   ├── profile/              # Profile components
│   ├── recommendations/      # AI recommendations
│   ├── rooms/                # Room status
│   └── sensors/              # Sensor displays
├── lib/                      # Core libraries
│   ├── api.ts                # API utilities
│   ├── constants.ts          # App constants
│   ├── database.ts           # PostgreSQL client
│   ├── env.ts                # Environment validation
│   ├── firebase-relay.ts     # Relay management
│   ├── firebase-sensors.ts   # Sensor subscriptions
│   ├── firebase-system-status.ts  # System monitoring
│   ├── firebase.ts           # Firebase initialization
│   ├── weather.ts            # Weather API
│   └── hooks/                # Custom React hooks
├── types/                    # TypeScript definitions
│   └── globals.d.ts          # Global type definitions
├── database/                 # Database files
│   └── schema.sql            # PostgreSQL schema
├── docs/                     # Documentation
└── public/                   # Static assets
```

---

## 🎨 Key Components

### Pages

- **Home** (`/`) - Dashboard overview with live metrics
- **Live Monitoring** (`/live-monitoring`) - Real-time sensor data
- **Analytics** (`/analytics`) - Power consumption charts
- **History** (`/history`) - Historical data viewer with date range picker
- **Automation** (`/automation`) - Device control interface
- **Settings** (`/settings`) - System configuration

### API Endpoints

| Endpoint               | Method | Description                 |
| ---------------------- | ------ | --------------------------- |
| `/api/pzem-data`       | GET    | Power meter historical data |
| `/api/historical-data` | GET    | Sensor historical data      |
| `/api/rooms`           | GET    | Available rooms             |
| `/api/relay-states`    | GET    | Current relay states        |
| `/api/relay-control`   | POST   | Control devices             |
| `/api/relay-sync`      | POST   | Sync Firebase to database   |
| `/api/cleanup`         | POST   | Remove old data             |
| `/api/debug`           | GET    | System debug information    |

---

## 🔧 Configuration

### System Settings

Configure via the Settings page (`/settings`):

- **Rooms**: Add/remove/configure rooms
- **Appliances**: Manage devices and their properties
- **Tariff**: Set electricity pricing
- **Data Sampling**: Configure data collection intervals
- **Notifications**: Alert preferences

### Database Schema

The system uses 4 main tables:

- `rooms` - Room definitions
- `room_sensors` - Environmental sensor data
- `pzem_data` - Power consumption data
- `relay_states` - Device state history

---

## 🚢 Deployment

### Vercel (Recommended)

1. Push code to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy

### Manual Deployment

```bash
npm run build
npm start
```

### Database Requirements

- PostgreSQL 14+ with configured connection
- Proper indexes on timestamp columns
- Regular cleanup cron job

---

## 📊 API Usage Examples

### Get Historical Sensor Data

```typescript
GET /api/historical-data?startDate=2025-01-01&endDate=2025-01-31&aggregation=hourly&roomIds=bedroom,living_room

Response:
{
  "success": true,
  "data": [
    {
      "timestamp": "2025-01-17T10:00:00Z",
      "roomId": "bedroom",
      "roomName": "Bedroom",
      "temperature": 23.5,
      "humidity": 45.2,
      "light": 320,
      "motion": true
    }
  ],
  "count": 150,
  "dateRange": {
    "start": "2025-01-01T00:00:00Z",
    "end": "2025-01-31T23:59:59Z"
  }
}
```

### Control Device

```typescript
POST /api/relay-control
Content-Type: application/json

{
  "relayId": "bedroom_light",
  "state": true
}

Response:
{
  "success": true,
  "relayId": "bedroom_light",
  "state": true,
  "timestamp": "2025-01-17T10:30:00Z"
}
```

---

## 🧪 Development

### Running Tests

```bash
npm run lint
```

### Building for Production

```bash
npm run build
```

### Code Quality

- ESLint configured with Next.js and TypeScript rules
- All types centralized in `types/globals.d.ts`
- No `any` types used
- Strict TypeScript configuration

---

## 📚 Documentation

Comprehensive documentation available in the `docs/` folder:

- **[API.md](docs/API.md)** - Complete API reference
- **[ARCHITECTURE.md](docs/ARCHITECTURE.md)** - System architecture
- **[COMPONENTS.md](docs/COMPONENTS.md)** - Component documentation
- **[DEPLOYMENT.md](docs/DEPLOYMENT.md)** - Deployment guide
- **[DEVELOPMENT.md](docs/DEVELOPMENT.md)** - Development setup
- **[FEATURES.md](docs/FEATURES.md)** - Feature details
- **[FIREBASE-STRUCTURE.md](docs/FIREBASE-STRUCTURE.md)** - Firebase data structure
- **[GETTING-STARTED.md](docs/GETTING-STARTED.md)** - Quick start guide

---

## 🤝 Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run linting and build checks
5. Submit a pull request

---

## 📄 License

This project is licensed under the MIT License.

---

## 🙏 Acknowledgments

- Next.js team for the amazing framework
- Firebase for real-time database
- PostgreSQL for reliable data storage
- Open source community

---

## 📧 Support

For issues and questions:

- Open an issue on GitHub
- Check existing documentation
- Review API examples

---

**Built with ❤️ for a sustainable future**
