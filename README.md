# EcoTrack AI Dashboard

> Smart Home Energy Monitoring & Automation Platform

A modern, real-time energy monitoring dashboard built with Next.js, TypeScript, Firebase, and PostgreSQL. Monitor power consumption, automate devices, and optimize energy usage with AI-powered recommendations.

## ✨ Features

- **Real-Time Monitoring** - Live sensor data with Firebase Realtime Database
- **Historical Analytics** - Long-term data storage and analysis with PostgreSQL
- **Smart Automation** - Control appliances with intelligent rules
- **Energy Insights** - Track power usage, costs, and trends
- **Data Comparison** - Compare usage across time periods
- **AI Recommendations** - ML-powered energy optimization suggestions
- **Data Export** - Export historical data to CSV
- **Responsive Design** - Works on desktop, tablet, and mobile

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- Firebase account with Realtime Database
- PostgreSQL (optional, for historical data)

### Installation

```bash
# Clone repository
git clone <your-repo-url>
cd ecotrackai-dashboard

# Install dependencies
npm install

# Configure environment
cp .env.example .env.local
# Edit .env.local with your Firebase credentials

# Run development server
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
ecotrackai-dashboard/
├── app/                    # Next.js pages and API routes
│   ├── page.tsx           # Dashboard home
│   ├── analytics/         # Power usage analytics
│   ├── automation/        # Device control & automation
│   ├── history/           # Historical data comparison
│   ├── insights/          # AI recommendations
│   ├── live-monitoring/   # Real-time sensor monitoring
│   ├── profile/           # User profile
│   ├── settings/          # App configuration
│   └── api/               # Backend API endpoints
│       ├── historical-data/
│       ├── rooms/
│       └── sync-firebase/
├── components/            # Reusable React components
│   ├── automation/        # Automation controls
│   ├── charts/            # Data visualization
│   ├── history/           # Historical data display
│   ├── metrics/           # Metric cards
│   ├── navigation/        # App shell, sidebar, nav
│   ├── recommendations/   # ML insights
│   ├── rooms/             # Room status cards
│   └── sensors/           # Sensor display
├── lib/                   # Core utilities & services
│   ├── api.ts            # API client
│   ├── constants.ts      # App configuration
│   ├── database.ts       # PostgreSQL queries
│   ├── firebase.ts       # Firebase initialization
│   ├── firebase-sensors.ts    # Sensor data service
│   └── firebase-system-status.ts
├── types/
│   └── globals.d.ts      # Global TypeScript types
├── database/
│   └── schema.sql        # PostgreSQL schema
├── docs/                 # Feature documentation
└── scripts/              # Utility scripts
```

## 🔧 Configuration

### Firebase Setup

1. Create a Firebase project at [console.firebase.google.com](https://console.firebase.google.com)
2. Enable Realtime Database
3. Add Firebase config to `.env.local`:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
NEXT_PUBLIC_FIREBASE_DATABASE_URL=your_database_url
```

### PostgreSQL Setup (Optional)

For historical data storage:

```bash
# Run setup script
.\scripts\setup-postgres.ps1

# Add to .env.local
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
POSTGRES_DATABASE=ecotrackai
POSTGRES_USER=postgres
POSTGRES_PASSWORD=your_password

# Sync Firebase data
node scripts/sync-firebase-to-postgres.js
```

## 📚 Documentation

- [Architecture Overview](docs/architecture.md) - System design and data flow
- [Live Monitoring Guide](docs/live-monitoring.md) - Real-time sensor monitoring
- [Analytics Guide](docs/analytics-guide.md) - Power usage analytics
- [History Guide](docs/history-guide.md) - Historical data comparison
- [Automation Guide](docs/automation.md) - Device control & rules
- [Insights Guide](docs/insights.md) - AI recommendations
- [Profile Guide](docs/profile-guide.md) - User profile management
- [Settings Guide](docs/settings-guide.md) - App configuration

## 🎨 Tech Stack

- **Framework**: Next.js 16 (React 19)
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS 4
- **Database**: Firebase Realtime Database + PostgreSQL
- **Charts**: Recharts
- **Icons**: Lucide React
- **Build Tool**: Turbopack

## 🛠️ Development

### Available Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
```

### API Endpoints

- `GET /api/rooms` - Fetch all rooms
- `GET /api/historical-data` - Query historical sensor data
- `POST /api/sync-firebase` - Sync Firebase to PostgreSQL

### Key Libraries

All utility functions are in `/lib`:

- `api.ts` - HTTP client with error handling
- `database.ts` - PostgreSQL connection and queries
- `firebase-sensors.ts` - Real-time sensor subscriptions
- `constants.ts` - App-wide configuration

## 🔑 Key Features

### Real-Time Data

Firebase Realtime Database provides live sensor updates with automatic synchronization across all clients.

### Energy Analytics

Track power consumption patterns, compare usage across appliances, identify optimization opportunities.

### Smart Automation

Create rules to automatically control devices based on time, occupancy, or energy thresholds.

### AI Recommendations

Machine learning algorithms analyze usage patterns and provide personalized energy-saving suggestions.

## 🐛 Troubleshooting

**Firebase Connection Issues**

- Verify environment variables in `.env.local`
- Check Firebase console for database rules
- Ensure Realtime Database is enabled

**Build Errors**

- Clear `.next` folder: `rm -rf .next`
- Reinstall dependencies: `rm -rf node_modules && npm install`

**PostgreSQL Connection**

- Verify PostgreSQL is running
- Check credentials in `.env.local`
- Run database schema: `psql -f database/schema.sql`

## 📄 License

MIT License - see LICENSE file for details.

## 🤝 Contributing

Contributions welcome! Please open an issue or submit a pull request.

---

**Built for a sustainable future** ⚡

## ✨ Features

- **Real-time Monitoring**: Live sensor data from Firebase Realtime Database
- **Historical Data Storage**: PostgreSQL integration for long-term data analysis
- **Energy Analytics**: Track power usage, appliance consumption, and trends
- **Smart Automation**: Control appliances with automated rules
- **Historical Comparison**: Compare usage across different time periods
- **AI Recommendations**: ML-powered suggestions for energy optimization
- **Data Export**: Export historical data to CSV for external analysis
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile
- **Dark Mode**: Modern UI with Tailwind CSS

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- Firebase project with Realtime Database enabled
- npm, yarn, or pnpm

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/yourusername/ecotrackai-dashboard.git
   cd ecotrackai-dashboard
   ```

2. **Install dependencies**

   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Configure Firebase**

   Create a `.env.local` file in the root directory:

   ```env
   NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
   NEXT_PUBLIC_FIREBASE_DATABASE_URL=your_database_url
   ```

4. **Configure PostgreSQL (Optional - for historical data)**

   For storing and querying historical sensor data:

   a. Install PostgreSQL from [postgresql.org](https://www.postgresql.org/download/)

   b. Run the setup script:

   ```bash
   # Windows PowerShell
   .\scripts\setup-postgres.ps1
   ```

   c. Or manually add to `.env.local`:

   ```env
   POSTGRES_HOST=localhost
   POSTGRES_PORT=5432
   POSTGRES_DATABASE=ecotrackai
   POSTGRES_USER=postgres
   POSTGRES_PASSWORD=your_password
   ```

   d. Sync Firebase data to PostgreSQL:

   ```bash
   node scripts/sync-firebase-to-postgres.js
   ```

   See [docs/postgresql-setup.md](docs/postgresql-setup.md) for detailed instructions.

5. **Run the development server**

   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

6. **Open the app**

   Navigate to [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
ecotrackai-dashboard/
├── app/                      # Next.js app directory
│   ├── analytics/           # Energy analytics page
│   ├── automation/          # Device automation page
│   ├── history/             # Historical data comparison
│   ├── insights/            # AI-powered insights
│   ├── live-monitoring/     # Real-time sensor monitoring
│   ├── profile/             # User profile
│   └── settings/            # App settings
├── components/              # Reusable React components
│   ├── automation/          # Automation controls
│   ├── charts/              # Data visualization
│   ├── history/             # Historical data components
│   ├── metrics/             # Metric display cards
│   ├── navigation/          # Navigation and layout
│   ├── profile/             # Profile components
│   ├── recommendations/     # ML recommendations
│   ├── rooms/               # Room status cards
│   └── sensors/             # Sensor display components
├── lib/                     # Utility functions and services
│   ├── firebase.ts          # Firebase initialization
│   ├── firebase-sensors.ts  # Real-time sensor data service
│   ├── firebase-system-status.ts  # System status service
│   ├── database.ts          # PostgreSQL connection and queries
│   ├── api.ts               # API client functions
│   └── constants.ts         # App constants
├── types/                   # TypeScript type definitions
│   └── globals.d.ts         # Global types (all types consolidated)
├── database/                # Database schema and migrations
│   └── schema.sql           # PostgreSQL schema
├── docs/                    # Documentation
│   ├── firebase-integration.md       # Firebase setup guide
│   ├── postgresql-setup.md           # PostgreSQL setup guide
│   ├── firebase-postgres-integration.md  # Integration overview
│   ├── analytics-setup.md            # Analytics configuration
│   ├── component-*.md                # Component documentation
│   └── ...
├── scripts/                 # Utility scripts
│   ├── setup-postgres.ps1            # PostgreSQL setup script
│   ├── sync-firebase-to-postgres.js  # Data sync script
│   └── ...
│   ├── test-firebase-connection.js  # Test Firebase setup
│   ├── add-test-data.js             # Populate test data
│   └── set-system-status.js         # Set system status
└── public/                  # Static assets
```

## 🔧 Firebase Setup

### Database Structure

Your Firebase Realtime Database should follow this structure:

```json
{
  "sensors": {
    "sensor-id": {
      "id": "sensor-id",
      "sensorName": "Living Room Temperature",
      "currentValue": 22.5,
      "unit": "°C",
      "status": "normal",
      "category": "temperature",
      "room": "living-room",
      "lastUpdate": "2025-12-25T10:30:00Z"
    }
  },
  "system-status": {
    "status": "online",
    "message": "All systems operational",
    "timestamp": "2025-12-25T10:30:00Z"
  }
}
```

### Test Scripts

```bash
# Test Firebase connection
node scripts/test-firebase-connection.js

# Add sample sensor data
node scripts/add-test-data.js

# Update system status
node scripts/set-system-status.js
```

See [Firebase Integration Guide](docs/firebase-integration.md) for detailed setup instructions.

## 📖 Documentation

All documentation has been organized in the `/docs` folder:

- **[Firebase Integration](docs/firebase-integration.md)** - Complete Firebase setup guide
- **[Analytics Setup](docs/analytics-setup.md)** - Configure analytics features
- **[Components Overview](docs/components-overview.md)** - Component architecture
- **[Navigation Integration](docs/navigation-integration.md)** - Navigation setup
- **Component Guides** - Individual component documentation

## 🎨 Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/)
- **Database**: [Firebase Realtime Database](https://firebase.google.com/docs/database)
- **Charts**: [Recharts](https://recharts.org/)
- **Icons**: [Lucide React](https://lucide.dev/)

## 🔑 Key Features Explained

### Real-time Data

The dashboard uses Firebase Realtime Database for live sensor updates. Data is automatically synchronized across all connected clients.

### Energy Analytics

Track power consumption patterns, compare usage across appliances, and identify optimization opportunities.

### Smart Automation

Create rules to automatically control devices based on conditions like time, occupancy, or energy thresholds.

### AI Recommendations

Machine learning algorithms analyze your usage patterns and provide personalized suggestions to reduce energy consumption.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👨‍💻 Development

### Available Scripts

```bash
# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linter
npm run lint
```

### Environment Variables

Required environment variables for development:

- `NEXT_PUBLIC_FIREBASE_*` - Firebase configuration (7 variables, see setup above)

## 🐛 Troubleshooting

### Firebase Connection Issues

- Verify all environment variables are set correctly
- Check Firebase console for database rules
- Ensure Realtime Database is enabled in your Firebase project

### Build Errors

- Clear `.next` folder: `rm -rf .next`
- Delete `node_modules` and reinstall: `rm -rf node_modules && npm install`

### Type Errors

- All types are now consolidated in `types/globals.d.ts`
- No need to import types - they're globally available

## 📞 Support

For support, please open an issue in the GitHub repository.

---

**Built with ❤️ for a sustainable future**
