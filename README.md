<div align="center">
  <h1>🌿 EcoTrack AI Dashboard</h1>
  
  <p><strong>Enterprise-Grade Smart Home Energy Monitoring & Automation Platform</strong></p>
  
  <p>
    <img src="https://img.shields.io/badge/Next.js-16.1-black?style=flat-square&logo=next.js" alt="Next.js" />
    <img src="https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react" alt="React" />
    <img src="https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript" alt="TypeScript" />
    <img src="https://img.shields.io/badge/Firebase-12.7-FFCA28?style=flat-square&logo=firebase" alt="Firebase" />
    <img src="https://img.shields.io/badge/PostgreSQL-16-316192?style=flat-square&logo=postgresql" alt="PostgreSQL" />
  </p>

  <p>
    <a href="#-key-features">Features</a> •
    <a href="#-tech-stack">Tech Stack</a> •
    <a href="#-quick-start">Quick Start</a> •
    <a href="#-documentation">Documentation</a> •
    <a href="#-deployment">Deployment</a>
  </p>
</div>

---

## 📖 About

**EcoTrack AI Dashboard** is a production-ready, real-time energy monitoring and automation platform designed for modern smart homes and commercial buildings. Built with cutting-edge technologies, it provides comprehensive energy management capabilities through live sensor monitoring, historical data analytics, intelligent automation, and AI-powered optimization recommendations.

### Business Value

- **Cost Reduction**: Reduce energy bills by up to 30% through intelligent automation and insights
- **Real-Time Visibility**: Monitor power consumption across all rooms and devices instantly
- **Data-Driven Decisions**: Historical analytics reveal consumption patterns and optimization opportunities
- **Automated Efficiency**: Smart device control optimizes energy usage without manual intervention
- **Environmental Impact**: Track and reduce your carbon footprint with detailed metrics

## 🎯 Key Features

### 💡 Real-Time Monitoring

Monitor live sensor data with sub-second latency using Firebase Realtime Database. Track temperature, humidity, power consumption, lighting levels, occupancy, and system health across all rooms and devices.

### 📊 Historical Analytics

Query and visualize years of historical data stored in PostgreSQL. Perform time-series analysis, identify trends, and export data for further analysis. Support for hourly, daily, and monthly aggregations.

### 🤖 Smart Automation

Intelligent device control with auto/manual modes. Create automation rules based on time, occupancy, energy thresholds, or environmental conditions. Reduce energy waste automatically.

### 🧠 AI-Powered Insights

Receive personalized recommendations to optimize energy usage. Machine learning algorithms analyze patterns and suggest actionable improvements with estimated cost savings.

### 📱 Responsive Design

Fully responsive interface optimized for desktop, tablet, and mobile devices. Progressive Web App (PWA) capabilities for offline access and native-like experience.

### 🔄 Automatic Data Synchronization

Client-side data sync every 60 seconds ensures PostgreSQL historical database stays updated with Firebase real-time data. No server-side cron jobs required.

## 🛠️ Tech Stack

### Frontend

- **[Next.js 16.1](https://nextjs.org/)** - React framework with App Router and Server Components
- **[React 19](https://react.dev/)** - Latest React with concurrent features
- **[TypeScript 5](https://www.typescriptlang.org/)** - Type-safe development
- **[Tailwind CSS 4](https://tailwindcss.com/)** - Utility-first CSS framework
- **[Recharts 3.6](https://recharts.org/)** - Composable charting library
- **[Lucide React](https://lucide.dev/)** - Beautiful, consistent icons

### Backend & Database

- **[Firebase Realtime Database](https://firebase.google.com/)** - Real-time data synchronization
- **[PostgreSQL 16](https://www.postgresql.org/)** - Robust relational database for historical data
- **[node-postgres](https://node-postgres.com/)** - PostgreSQL client for Node.js

### Infrastructure & Deployment

- **[Vercel](https://vercel.com/)** - Serverless deployment platform (recommended)
- **[Neon](https://neon.tech/)** - Serverless PostgreSQL (recommended)
- **Edge Functions** - Globally distributed API routes

### Development Tools

- **ESLint 9** - Code linting
- **PostCSS** - CSS processing
- **Git** - Version control

## 🚀 Quick Start

### Prerequisites

Before you begin, ensure you have the following installed and configured:

- **Node.js** 18.x or higher ([Download](https://nodejs.org/))
- **npm** 9.x or higher (included with Node.js)
- **PostgreSQL** 14+ ([Install locally](https://www.postgresql.org/download/) or use [Neon](https://neon.tech/))
- **Firebase project** with Realtime Database enabled ([Create project](https://console.firebase.google.com/))
- **Git** for version control

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

3. **Configure environment variables**

   Copy the example environment file and fill in your credentials:

   ```bash
   cp .env.local.example .env.local
   ```

   Edit `.env.local` with your Firebase and PostgreSQL credentials:

   ```env
   # Firebase Configuration
   NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
   NEXT_PUBLIC_FIREBASE_DATABASE_URL=https://your_project.firebaseio.com

   # PostgreSQL Configuration
   DATABASE_URL=postgresql://user:password@host:5432/database
   ```

4. **Initialize the database**

   Create the database and apply the schema:

   ```bash
   # Create database
   createdb ecotrackai

   # Apply schema
   psql -U postgres -d ecotrackai -f database/schema.sql
   ```

5. **Start the development server**

   ```bash
   npm run dev
   ```

6. **Open your browser**

   Navigate to [http://localhost:3000](http://localhost:3000) to see the application.

### Verify Installation

1. Check that the dashboard loads without errors
2. Verify database connection in the Network tab (check `/api/rooms`)
3. Ensure Firebase real-time data appears on the live monitoring page
4. Test the data sync by visiting `/api/sync-firebase`

## 📚 Documentation

Comprehensive documentation is available to help you understand, use, and extend the platform:

| Document                                       | Description                                                                         |
| ---------------------------------------------- | ----------------------------------------------------------------------------------- |
| **[Getting Started](docs/GETTING-STARTED.md)** | **⭐ Start here!** Complete setup guide for new developers (15-20 min)              |
| **[Architecture Guide](docs/ARCHITECTURE.md)** | System architecture, data flow, component hierarchy, and technical design decisions |
| **[API Reference](docs/API.md)**               | Complete API documentation with endpoints, parameters, responses, and code examples |
| **[Component Library](docs/COMPONENTS.md)**    | Reusable component documentation with props, usage examples, and best practices     |
| **[Features Guide](docs/FEATURES.md)**         | Detailed explanation of all features, capabilities, and use cases                   |
| **[Deployment Guide](docs/DEPLOYMENT.md)**     | Step-by-step production deployment instructions for Vercel and other platforms      |
| **[Development Guide](docs/DEVELOPMENT.md)**   | Development workflow, coding standards, testing, and contribution guidelines        |
| **[Project Summary](docs/PROJECT-SUMMARY.md)** | High-level project overview, goals, structure, and current status                   |

### Quick Links

- 🚀 **[Quick Start](docs/GETTING-STARTED.md)** - Get up and running in 15 minutes
- 🏗️ **[System Architecture](docs/ARCHITECTURE.md)** - Understand how the system works
- 🔌 **[API Endpoints](docs/API.md)** - Integrate with the platform
- 🎨 **[UI Components](docs/COMPONENTS.md)** - Build new features
- 🌐 **[Deploy to Production](docs/DEPLOYMENT.md)** - Go live
- 💻 **[Start Contributing](docs/DEVELOPMENT.md)** - Join development

## 🌐 Deployment

### Deploy to Vercel (Recommended)

Vercel provides the best experience for Next.js applications with zero configuration.

#### One-Click Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/ecotrackai-dashboard)

#### Manual Deployment

1. **Install Vercel CLI**

   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel**

   ```bash
   vercel login
   ```

3. **Deploy**
   ```bash
   vercel --prod
   ```

#### Environment Variables

Configure these environment variables in your Vercel project settings:

**Firebase Configuration** (Client-side - NEXT_PUBLIC prefix):

- `NEXT_PUBLIC_FIREBASE_API_KEY`
- `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
- `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
- `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
- `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
- `NEXT_PUBLIC_FIREBASE_APP_ID`
- `NEXT_PUBLIC_FIREBASE_DATABASE_URL`

**Database Configuration** (Server-side):

- `DATABASE_URL` - PostgreSQL connection string
  - Example: `postgresql://user:password@host:5432/database?sslmode=require`

#### Continuous Deployment

Connect your GitHub repository to Vercel for automatic deployments:

- Push to `main` branch → Deploy to production
- Open Pull Request → Deploy preview environment
- Merge PR → Auto-promote to production

### Alternative Platforms

- **[Netlify](docs/DEPLOYMENT.md#netlify)** - See deployment guide
- **[Railway](docs/DEPLOYMENT.md#railway)** - See deployment guide
- **[Digital Ocean](docs/DEPLOYMENT.md#digital-ocean)** - See deployment guide
- **[Self-Hosted](docs/DEPLOYMENT.md#self-hosted)** - Docker & Kubernetes guide

For detailed deployment instructions, see the [Deployment Guide](docs/DEPLOYMENT.md).# Deploy to production
vercel --prod

````

### 3. Setup Database Schema

```bash
# Using Neon dashboard SQL editor or psql
psql $DATABASE_URL -f database/schema.sql
````

See [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md) for complete deployment guide.

## 🏗️ Project Structure

```
ecotrackai-dashboard/
├── app/                      # Next.js 16 App Router
│   ├── (routes)/            # Application pages
│   │   ├── page.tsx         # Dashboard home
│   │   ├── live-monitoring/ # Real-time sensor monitoring
│   │   ├── history/         # Historical data analysis
│   │   ├── analytics/       # Energy analytics & charts
│   │   ├── automation/      # Device control & automation
│   │   ├── insights/        # AI-powered recommendations
│   │   ├── profile/         # User profile management
│   │   └── settings/        # Application settings
│   ├── api/                 # API routes (serverless functions)
│   │   ├── rooms/          # Room management endpoints
│   │   ├── historical-data/ # Historical data queries
│   │   └── sync-firebase/  # Data synchronization
│   ├── layout.tsx          # Root layout with providers
│   └── globals.css         # Global styles
│
├── components/              # Reusable React components
│   ├── automation/         # Automation control panels
│   ├── charts/            # Data visualization components
│   ├── history/           # Historical data views
│   ├── metrics/           # Metric display cards
│   ├── navigation/        # Navigation, sidebar, header
│   ├── providers/         # Context providers
│   ├── recommendations/   # AI insight cards
│   ├── rooms/            # Room status cards
│   └── sensors/          # Live sensor displays
│
├── lib/                    # Utility libraries & helpers
│   ├── database.ts        # PostgreSQL query functions
│   ├── firebase.ts        # Firebase initialization
│   ├── firebase-sensors.ts # Real-time data subscriptions
│   ├── api.ts            # API utility functions
│   ├── constants.ts      # Application constants
│   └── env.ts           # Environment configuration
│
├── types/                 # TypeScript type definitions
├── database/             # Database schemas & migrations
├── docs/                 # Comprehensive documentation
├── public/              # Static assets
└── config files         # Next.js, TypeScript, Tailwind, ESLint
```

## 🔄 Data Flow & Architecture

### Real-Time Data Flow

```
IoT Sensors → Firebase Realtime DB → WebSocket → React Components → UI
                       ↓
              Sync Service (60s interval)
                       ↓
              PostgreSQL (Historical Storage)
```

### Historical Data Flow

```
User Query → API Route → PostgreSQL → Data Processing → Chart Components → UI
```

### Key Architectural Principles

- **Server Components** for initial data fetching
- **Client Components** for interactivity and real-time updates
- **API Routes** as serverless functions
- **Type Safety** with TypeScript throughout
- **Responsive Design** with Tailwind CSS
- **Real-Time Sync** via Firebase SDK
- **Efficient Queries** with PostgreSQL indexes

## 📊 API Reference

### Available Endpoints

| Endpoint               | Method | Description                               | Authentication |
| ---------------------- | ------ | ----------------------------------------- | -------------- |
| `/api/rooms`           | GET    | Retrieve all rooms with metadata          | Public         |
| `/api/historical-data` | GET    | Query historical sensor data with filters | Public         |
| `/api/sync-firebase`   | POST   | Synchronize Firebase data to PostgreSQL   | Public         |
| `/api/sync-firebase`   | GET    | Check database connection status          | Public         |

### Example API Usage

```typescript
// Fetch all rooms
const response = await fetch("/api/rooms");
const { rooms } = await response.json();

// Query historical data
const params = new URLSearchParams({
  startDate: "2025-01-01",
  endDate: "2025-01-31",
  roomIds: "living-room,bedroom",
});
const data = await fetch(`/api/historical-data?${params}`);
const { data: sensorData } = await data.json();

// Trigger data sync
await fetch("/api/sync-firebase", { method: "POST" });
```

For complete API documentation, see [API Reference](docs/API.md).

## 🧪 Testing & Quality Assurance

### Build Verification

```bash
# Run production build
npm run build

# Check for TypeScript errors
npx tsc --noEmit

# Run linting
npm run lint
```

### Code Quality Tools

- **TypeScript** - Type checking and IntelliSense
- **ESLint 9** - Code linting with Next.js rules
- **Prettier** - Code formatting (optional)

### Performance Monitoring

- **Vercel Analytics** - Real-time performance metrics
- **Core Web Vitals** - LCP, FID, CLS tracking
- **Bundle Analysis** - Monitor bundle sizes

## 🔐 Security Best Practices

### Environment Variables

- ✅ Never commit `.env` files to version control
- ✅ Use `NEXT_PUBLIC_` prefix only for client-side variables
- ✅ Keep server-side secrets (database passwords) without prefix
- ✅ Rotate credentials regularly
- ✅ Use different credentials for dev/staging/production

### Database Security

- ✅ Use SSL/TLS for all database connections
- ✅ Implement connection pooling with timeouts
- ✅ Use parameterized queries to prevent SQL injection
- ✅ Apply principle of least privilege for database users

### Firebase Security

- ✅ Configure Firebase Security Rules
- ✅ Enable authentication (coming soon)
- ✅ Restrict database access by authentication status
- ✅ Monitor usage and set quotas

## 🚀 Performance Optimization

### Next.js Optimizations

- **Server Components** - Reduce client-side JavaScript
- **Streaming** - Progressive page rendering
- **Image Optimization** - Automatic image optimization with `next/image`
- **Font Optimization** - Automatic font loading optimization
- **Route Prefetching** - Faster navigation

### Database Optimizations

- **Indexes** - Optimized queries on timestamp and room_id
- **Connection Pooling** - Reuse database connections
- **Materialized Views** - Pre-aggregated hourly and daily data
- **Query Optimization** - Efficient time-range queries

### Frontend Optimizations

- **Code Splitting** - Automatic route-based splitting
- **Tree Shaking** - Remove unused code
- **Lazy Loading** - Load components on demand
- **Memoization** - Prevent unnecessary re-renders

## 🤝 Contributing

We welcome contributions from the community! Here's how you can help:

### Ways to Contribute

- 🐛 Report bugs and issues
- 💡 Suggest new features or improvements
- 📖 Improve documentation
- 🔧 Submit pull requests
- ⭐ Star the repository
- 📢 Share the project

### Development Workflow

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Run tests and linting (`npm run lint`)
5. Commit your changes (`git commit -m 'Add amazing feature'`)
6. Push to your branch (`git push origin feature/amazing-feature`)
7. Open a Pull Request

### Code Standards

- Follow TypeScript best practices
- Use functional components with hooks
- Write clear, descriptive comments
- Maintain consistent code style
- Add types for all function parameters and returns

For detailed contribution guidelines, see [Development Guide](docs/DEVELOPMENT.md).

## 🙏 Acknowledgments

### Technologies

- [Next.js](https://nextjs.org/) - The React Framework for Production
- [Vercel](https://vercel.com/) - Platform for Frontend Developers
- [Firebase](https://firebase.google.com/) - Backend-as-a-Service
- [PostgreSQL](https://www.postgresql.org/) - The World's Most Advanced Open Source Database
- [Tailwind CSS](https://tailwindcss.com/) - Utility-First CSS Framework
- [Recharts](https://recharts.org/) - Redefined Chart Library
- [Lucide](https://lucide.dev/) - Beautiful & Consistent Icons

### Inspiration

Built with ❤️ for smart home enthusiasts and energy-conscious individuals worldwide.

## 📞 Support & Contact

### Getting Help

- 📖 **Documentation**: Browse the [docs](docs/) folder
- 🐛 **Bug Reports**: [Open an issue](https://github.com/yourusername/ecotrackai-dashboard/issues)
- 💬 **Discussions**: [GitHub Discussions](https://github.com/yourusername/ecotrackai-dashboard/discussions)
- 📧 **Email**: support@ecotrack.ai (coming soon)

### Community

- 🌟 **Star this repo** if you find it helpful!
- 🐦 **Follow us** on Twitter: [@EcoTrackAI](https://twitter.com/ecotrack) (coming soon)
- 💼 **LinkedIn**: [EcoTrack AI](https://linkedin.com/company/ecotrack) (coming soon)

---

<div align="center">
  <p><strong>Made with ❤️ and renewable energy</strong></p>
  <p>© 2025 EcoTrack AI. All rights reserved.</p>
  
  <p>
    <a href="https://github.com/yourusername/ecotrackai-dashboard">GitHub</a> •
    <a href="docs/ARCHITECTURE.md">Architecture</a> •
    <a href="docs/API.md">API</a> •
    <a href="docs/DEPLOYMENT.md">Deploy</a>
  </p>
</div>
