# Development Guide

**Version**: 1.1  
**Last Updated**: December 26, 2025  
**Status**: Production Ready

## Overview

This guide is designed for developers who want to contribute to or extend the EcoTrack AI Dashboard. It covers development environment setup, coding standards, workflow guidelines, and best practices.

### For Contributors

Whether you're:

- 🐛 **Fixing bugs** - Report and fix issues
- ✨ **Adding features** - Implement new capabilities
- 📖 **Improving docs** - Enhance documentation
- 🎨 **Refining UI** - Improve user experience
- 🔧 **Optimizing performance** - Make it faster

This guide will help you get started and be productive quickly.

### Development Philosophy

- **Code Quality**: Write clean, maintainable, well-documented code
- **Type Safety**: Leverage TypeScript for reliability
- **Testing**: Ensure code works before committing
- **Collaboration**: Communicate with the team
- **Documentation**: Keep docs up-to-date
- **Performance**: Optimize for speed and efficiency

## Table of Contents

1. [Getting Started](#getting-started)
2. [Development Workflow](#development-workflow)
3. [Code Style](#code-style)
4. [Testing](#testing)
5. [Git Workflow](#git-workflow)
6. [Adding Features](#adding-features)
7. [Debugging](#debugging)
8. [Performance](#performance)

## Getting Started

### Prerequisites

- **Node.js 18+** (LTS recommended)
- **npm 9+** or yarn
- **Git**
- **PostgreSQL** (local or Docker)
- **Firebase account**
- **VS Code** (recommended) with extensions:
  - ESLint
  - Prettier
  - Tailwind CSS IntelliSense
  - TypeScript and JavaScript Language Features

### Initial Setup

```bash
# Clone repository
git clone https://github.com/yourusername/ecotrackai-dashboard.git
cd ecotrackai-dashboard

# Install dependencies
npm install

# Copy environment template
cp .env.local.example .env.local

# Edit .env.local with your credentials
code .env.local

# Setup database
createdb ecotrackai
psql -U postgres -d ecotrackai -f database/schema.sql

# Start development server
npm run dev
```

### Development Server

```bash
# Start Next.js dev server
npm run dev

# Open in browser
open http://localhost:3000

# View in network (for mobile testing)
npm run dev -- --hostname 0.0.0.0
```

## Development Workflow

### Daily Development

1. **Pull latest changes**

   ```bash
   git pull origin main
   ```

2. **Create feature branch**

   ```bash
   git checkout -b feature/your-feature-name
   ```

3. **Make changes**

   - Edit files in `app/`, `components/`, or `lib/`
   - Hot reload automatically updates browser

4. **Test changes**

   ```bash
   npm run lint
   npm run build
   ```

5. **Commit changes**

   ```bash
   git add .
   git commit -m "feat: add new feature"
   git push origin feature/your-feature-name
   ```

6. **Create Pull Request**
   - Open PR on GitHub
   - Request review
   - Merge after approval

### Hot Reload

Next.js dev server includes:

- **Fast Refresh** for React components
- **Auto-rebuild** on file changes
- **Error overlay** in browser
- **TypeScript checking** in real-time

## Code Style

### TypeScript

```typescript
// Use explicit types
export async function getRooms(): Promise<DBRoom[]> {
  const result = await getPool().query("SELECT * FROM rooms");
  return result.rows;
}

// Use interfaces for objects
interface SensorData {
  id: string;
  value: number;
  timestamp: Date;
}

// Use type aliases for unions
type SensorStatus = "normal" | "warning" | "critical" | "offline";

// Avoid any, use unknown if necessary
function processData(data: unknown): void {
  if (isValidData(data)) {
    // TypeScript knows data is valid here
  }
}
```

### React Components

```typescript
// Use functional components
export function MetricCard({ title, value, unit }: MetricCardProps) {
  return (
    <div className="...">
      <h3>{title}</h3>
      <p>
        {value} {unit}
      </p>
    </div>
  );
}

// Use TypeScript for props
interface MetricCardProps {
  title: string;
  value: number;
  unit: string;
  trend?: {
    direction: "up" | "down";
    value: number;
  };
}

// Export types with component
export type { MetricCardProps };
```

### Naming Conventions

| Type             | Convention       | Example           |
| ---------------- | ---------------- | ----------------- |
| Components       | PascalCase       | `MetricCard`      |
| Functions        | camelCase        | `fetchSensorData` |
| Variables        | camelCase        | `sensorData`      |
| Constants        | UPPER_SNAKE_CASE | `SYNC_INTERVAL`   |
| Types/Interfaces | PascalCase       | `SensorData`      |
| Files            | kebab-case       | `metric-card.tsx` |
| Folders          | kebab-case       | `live-monitoring` |

### File Organization

```typescript
// Order of imports
import React from "react"; // 1. React
import { useEffect, useState } from "react"; // 2. React hooks
import Link from "next/link"; // 3. Next.js
import { MetricCard } from "@/components"; // 4. Local components
import { fetchData } from "@/lib/api"; // 5. Local utilities
import type { SensorData } from "@/types"; // 6. Types
import "./styles.css"; // 7. Styles

// Component definition
export function Dashboard() {
  // 1. Hooks
  const [data, setData] = useState<SensorData[]>([]);

  // 2. Effects
  useEffect(() => {
    fetchData().then(setData);
  }, []);

  // 3. Event handlers
  const handleRefresh = () => {
    fetchData().then(setData);
  };

  // 4. Render helpers
  const renderMetrics = () => {
    return data.map((item) => <MetricCard key={item.id} {...item} />);
  };

  // 5. Return JSX
  return <div>{renderMetrics()}</div>;
}
```

### Tailwind CSS

```tsx
// Use semantic class ordering
<div className="
  // Layout
  flex flex-col items-center justify-between
  // Spacing
  p-4 m-2 gap-4
  // Sizing
  w-full h-64
  // Typography
  text-lg font-semibold text-gray-900
  // Visual
  bg-white border border-gray-200 rounded-lg shadow-sm
  // Interactive
  hover:bg-gray-50 focus:ring-2 focus:ring-blue-500
  // Responsive
  sm:p-6 md:flex-row lg:w-1/2
">
  Content
</div>

// Extract repeated patterns to components
<Card className="p-4">Content</Card>
```

## Testing

### Manual Testing

```bash
# Run linter
npm run lint

# Build production bundle
npm run build

# Run production server locally
npm start

# Check TypeScript
npx tsc --noEmit
```

### Test Checklist

Before committing, verify:

- [ ] Code builds without errors
- [ ] TypeScript has no errors
- [ ] ESLint passes
- [ ] All pages load correctly
- [ ] Real-time updates work
- [ ] API endpoints respond
- [ ] Database queries succeed
- [ ] Mobile responsive
- [ ] No console errors

### Browser Testing

Test in multiple browsers:

- Chrome/Edge (Chromium)
- Firefox
- Safari (if on Mac)

Test responsive design:

- Mobile (375px)
- Tablet (768px)
- Desktop (1920px)

## Git Workflow

### Branch Naming

```bash
# Features
git checkout -b feature/sensor-alerts

# Bug fixes
git checkout -b fix/chart-rendering

# Documentation
git checkout -b docs/api-reference

# Refactoring
git checkout -b refactor/database-queries
```

### Commit Messages

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```bash
# Features
git commit -m "feat: add sensor alert notifications"

# Bug fixes
git commit -m "fix: resolve chart rendering issue on mobile"

# Documentation
git commit -m "docs: update API reference"

# Refactoring
git commit -m "refactor: simplify database query logic"

# Performance
git commit -m "perf: optimize sensor data fetching"

# Styling
git commit -m "style: update button colors"

# Chores
git commit -m "chore: update dependencies"
```

### Pull Request Process

1. **Create descriptive PR**

   - Clear title
   - Detailed description
   - Screenshots for UI changes
   - Link related issues

2. **Request review**

   - At least one approver
   - Address feedback
   - Keep PR focused

3. **Merge strategy**
   - Squash and merge for features
   - Rebase for bug fixes
   - Merge commit for releases

## Adding Features

### Adding a New Page

```bash
# 1. Create page file
mkdir app/my-feature
touch app/my-feature/page.tsx

# 2. Add navigation item
# Edit components/navigation/Navigation.tsx
```

```tsx
// app/my-feature/page.tsx
import { Suspense } from "react";

export default function MyFeaturePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">My Feature</h1>

        <Suspense fallback={<div>Loading...</div>}>
          <MyFeatureContent />
        </Suspense>
      </div>
    </div>
  );
}

function MyFeatureContent() {
  // Feature implementation
  return <div>Content</div>;
}
```

### Adding an API Endpoint

```bash
# 1. Create route file
mkdir app/api/my-endpoint
touch app/api/my-endpoint/route.ts
```

```typescript
// app/api/my-endpoint/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getPool } from "@/lib/database";

export async function GET(request: NextRequest) {
  try {
    const pool = getPool();
    const result = await pool.query("SELECT * FROM table");

    return NextResponse.json({
      data: result.rows,
      success: true,
    });
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    // Validate body
    // Process request

    return NextResponse.json({
      success: true,
      message: "Created successfully",
    });
  } catch (error) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
```

### Adding a Component

```bash
# 1. Create component file
mkdir components/my-component
touch components/my-component/MyComponent.tsx
touch components/my-component/index.ts
```

```tsx
// components/my-component/MyComponent.tsx
interface MyComponentProps {
  title: string;
  value: number;
  onAction?: () => void;
}

export function MyComponent({ title, value, onAction }: MyComponentProps) {
  return (
    <div className="p-4 bg-white rounded-lg border">
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="text-2xl">{value}</p>
      {onAction && (
        <button
          onClick={onAction}
          className="mt-2 px-4 py-2 bg-blue-600 text-white rounded"
        >
          Action
        </button>
      )}
    </div>
  );
}
```

```typescript
// components/my-component/index.ts
export { MyComponent } from "./MyComponent";
export type { MyComponentProps } from "./MyComponent";
```

## Debugging

### Browser DevTools

**Console Logging:**

```typescript
console.log("Sensor data:", sensors);
console.error("Failed to fetch:", error);
console.table(data); // Nice table view
```

**React DevTools:**

- Install React DevTools extension
- Inspect component props and state
- Profile component renders
- Identify performance issues

### VS Code Debugging

**launch.json:**

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Next.js: debug server-side",
      "type": "node-terminal",
      "request": "launch",
      "command": "npm run dev"
    },
    {
      "name": "Next.js: debug client-side",
      "type": "chrome",
      "request": "launch",
      "url": "http://localhost:3000"
    }
  ]
}
```

### Common Issues

**Issue: Firebase connection fails**

```typescript
// Check environment variables
console.log("Firebase config:", {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY?.slice(0, 10) + "...",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
});
```

**Issue: Database queries fail**

```typescript
// Test connection
const pool = getPool();
await pool.query("SELECT 1"); // Should not throw
```

**Issue: Build fails**

```bash
# Clear cache
rm -rf .next node_modules
npm install
npm run build
```

## Performance

### Monitoring Performance

```typescript
// Measure component render time
const startTime = performance.now();
// Component render
const endTime = performance.now();
console.log(`Render took ${endTime - startTime}ms`);
```

### Optimization Techniques

**1. Memoization**

```typescript
import { useMemo, useCallback } from "react";

const expensiveValue = useMemo(() => {
  return computeExpensiveValue(data);
}, [data]);

const handleClick = useCallback(() => {
  doSomething();
}, []);
```

**2. Code Splitting**

```typescript
import dynamic from "next/dynamic";

const HeavyComponent = dynamic(() => import("./HeavyComponent"), {
  loading: () => <p>Loading...</p>,
  ssr: false,
});
```

**3. Image Optimization**

```tsx
import Image from "next/image";

<Image
  src="/image.jpg"
  alt="Description"
  width={800}
  height={600}
  loading="lazy"
/>;
```

**4. Database Query Optimization**

```sql
-- Add indexes
CREATE INDEX idx_sensor_data_timestamp ON sensor_data(timestamp DESC);
CREATE INDEX idx_sensor_data_room_id ON sensor_data(room_id);

-- Use EXPLAIN to analyze
EXPLAIN ANALYZE SELECT * FROM sensor_data WHERE room_id = 'living-room';
```

## Environment Management

### Local Development

```env
# .env.local
NEXT_PUBLIC_FIREBASE_API_KEY=dev_key
DATABASE_URL=postgresql://localhost:5432/ecotrackai_dev
NODE_ENV=development
```

### Production

```env
# .env.production (or Vercel env vars)
NEXT_PUBLIC_FIREBASE_API_KEY=prod_key
DATABASE_URL=postgresql://prod-db:5432/ecotrackai_prod
NODE_ENV=production
```

## Scripts

### Useful npm Scripts

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "eslint .",
    "lint:fix": "eslint . --fix",
    "type-check": "tsc --noEmit",
    "clean": "rm -rf .next node_modules",
    "db:setup": "psql -U postgres -d ecotrackai -f database/schema.sql",
    "db:backup": "pg_dump ecotrackai > backup.sql",
    "db:restore": "psql ecotrackai < backup.sql"
  }
}
```

## Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [Firebase Docs](https://firebase.google.com/docs)
- [PostgreSQL Docs](https://www.postgresql.org/docs/)

## Getting Help

- Check existing [GitHub Issues](https://github.com/yourusername/ecotrackai-dashboard/issues)
- Join our [Discord community](#) (coming soon)
- Email: dev@ecotrackai.com
- Read [ARCHITECTURE.md](ARCHITECTURE.md) for system design
