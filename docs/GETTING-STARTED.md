# Getting Started Guide

**Version**: 1.1  
**Last Updated**: December 26, 2025  
**Estimated Setup Time**: 15-20 minutes

## Welcome! 👋

This guide will help you set up the EcoTrack AI Dashboard on your local machine in under 20 minutes. Follow each step carefully for a smooth setup experience.

## Prerequisites Checklist

Before you begin, ensure you have these installed:

- [ ] **Node.js 18+** - [Download here](https://nodejs.org/)
- [ ] **npm 9+** - Included with Node.js
- [ ] **Git** - [Download here](https://git-scm.com/)
- [ ] **PostgreSQL 14+** - [Download here](https://www.postgresql.org/download/)
  - Alternative: Use [Neon](https://neon.tech/) (serverless, free tier)
- [ ] **Firebase Account** - [Create account](https://firebase.google.com/)
- [ ] **Code Editor** - [VS Code recommended](https://code.visualstudio.com/)

### Optional but Recommended

- **VS Code Extensions**:
  - ESLint
  - Tailwind CSS IntelliSense
  - TypeScript and JavaScript Language Features
  - Prettier (for code formatting)

## Step 1: Clone the Repository

```bash
# Using HTTPS
git clone https://github.com/yourusername/ecotrackai-dashboard.git

# Or using SSH
git clone git@github.com:yourusername/ecotrackai-dashboard.git

# Navigate to project directory
cd ecotrackai-dashboard
```

## Step 2: Install Dependencies

```bash
# Install all required packages
npm install

# This may take 2-3 minutes
```

**Expected output**: You should see a list of installed packages with no errors.

## Step 3: Set Up Firebase

### 3.1 Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project"
3. Enter project name: `ecotrackai` (or your preferred name)
4. Disable Google Analytics (optional)
5. Click "Create project"

### 3.2 Enable Realtime Database

1. In your Firebase project, go to **Build** → **Realtime Database**
2. Click "Create Database"
3. Choose location (nearest to your users)
4. Start in **test mode** (we'll secure it later)
5. Click "Enable"

### 3.3 Get Firebase Configuration

1. Go to **Project Settings** (gear icon)
2. Scroll down to "Your apps"
3. Click the **Web** icon (`</>`)
4. Register app name: `ecotrackai-dashboard`
5. Copy the configuration object - you'll need this next!

Example configuration:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyXxXxXxXxXxXxXxXxXxXxXxXxXxXxX",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abc123def456",
  databaseURL: "https://your-project.firebaseio.com",
};
```

## Step 4: Set Up PostgreSQL Database

### Option A: Local PostgreSQL

```bash
# Create database
createdb ecotrackai

# Verify database exists
psql -l | grep ecotrackai

# Apply schema
psql -U postgres -d ecotrackai -f database/schema.sql
```

### Option B: Neon (Serverless)

1. Go to [Neon Console](https://console.neon.tech/)
2. Sign up/login
3. Create new project: `ecotrackai`
4. Copy the connection string (looks like `postgresql://user:pass@host/db`)
5. Use the SQL Editor to run the schema:
   - Open `database/schema.sql` in your editor
   - Copy contents
   - Paste in Neon SQL Editor
   - Click "Run"

## Step 5: Configure Environment Variables

### 5.1 Copy Template

```bash
# Copy the example file
cp .env.local.example .env.local
```

### 5.2 Edit Configuration

Open `.env.local` in your code editor and fill in values:

```env
# Firebase Configuration (from Step 3.3)
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyXxXxXxXxXxXxXxXxXxXxXxXxXxXxX
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789012
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789012:web:abc123def456
NEXT_PUBLIC_FIREBASE_DATABASE_URL=https://your-project.firebaseio.com

# PostgreSQL Configuration
DATABASE_URL=postgresql://user:password@localhost:5432/ecotrackai
# For Neon, use your Neon connection string
```

**Important**:

- Replace all values with your actual credentials
- Don't commit `.env.local` to Git (it's already in `.gitignore`)
- Use `NEXT_PUBLIC_` prefix for client-side variables only

## Step 6: Add Sample Data (Optional)

To see the dashboard in action, add sample sensor data to Firebase:

### Using Firebase Console

1. Go to Firebase Console → Realtime Database
2. Click on the **+** icon at root
3. Add this structure:

```json
{
  "sensors": {
    "living-room": {
      "temperature": 22.5,
      "humidity": 65,
      "power": 850,
      "energy": 12.5,
      "lighting": 80,
      "motion": 1,
      "lastUpdate": "2025-12-26T10:30:00.000Z"
    },
    "bedroom": {
      "temperature": 20.5,
      "humidity": 60,
      "power": 450,
      "energy": 8.2,
      "lighting": 30,
      "motion": 0,
      "lastUpdate": "2025-12-26T10:30:00.000Z"
    }
  },
  "system-status": {
    "online": true,
    "lastSync": "2025-12-26T10:29:00.000Z",
    "activeDevices": 2,
    "errorCount": 0
  }
}
```

## Step 7: Start the Development Server

```bash
# Start Next.js development server
npm run dev
```

**Expected output**:

```
   ▲ Next.js 16.1.1
   - Local:        http://localhost:3000
   - Ready in 2.5s
```

## Step 8: Verify Installation

### 8.1 Open the Application

Open your browser and navigate to: **http://localhost:3000**

You should see the EcoTrack AI Dashboard home page!

### 8.2 Check API Endpoints

Test that all services are working:

1. **Rooms API**: http://localhost:3000/api/rooms
   - Should return: `{"rooms": []}`

2. **Database Connection**: http://localhost:3000/api/sync-firebase
   - Should return: `{"databaseConnected": true, ...}`

3. **Live Monitoring**: http://localhost:3000/live-monitoring
   - Should display your sensor data (if you added sample data)

### 8.3 Sync Data to PostgreSQL

If you added sample Firebase data:

1. Go to: http://localhost:3000/api/sync-firebase
2. Click "POST" in your API testing tool, or run:
   ```bash
   curl -X POST http://localhost:3000/api/sync-firebase
   ```
3. Check response: `{"synced": 2, "rooms": 2, ...}`

## Troubleshooting

### Port 3000 Already in Use

```bash
# Kill the process using port 3000
# Windows:
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# macOS/Linux:
lsof -ti:3000 | xargs kill
```

### Database Connection Failed

**Error**: `Database connection failed`

**Solutions**:

1. Verify PostgreSQL is running: `pg_isready`
2. Check DATABASE_URL in `.env.local`
3. Test connection: `psql $DATABASE_URL`
4. Ensure database exists: `psql -l | grep ecotrackai`

### Firebase Initialization Error

**Error**: `Firebase: Error (auth/invalid-api-key)`

**Solutions**:

1. Double-check all Firebase config values in `.env.local`
2. Ensure `NEXT_PUBLIC_` prefix is used
3. No trailing spaces in values
4. Restart dev server after changing `.env.local`

### Build Errors

**Error**: TypeScript or ESLint errors

**Solutions**:

```bash
# Clear Next.js cache
rm -rf .next

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install

# Rebuild
npm run build
```

### Empty Dashboard

**Issue**: Dashboard shows no data

**Solutions**:

1. Add sample data to Firebase (Step 6)
2. Check browser console for errors (F12)
3. Verify Firebase rules allow read access
4. Check network tab for API failures

## Next Steps

Congratulations! 🎉 Your development environment is ready.

### What to do next:

1. **Explore the Dashboard**
   - Navigate through different pages
   - Check live monitoring
   - View historical data

2. **Read Documentation**
   - [Architecture Guide](ARCHITECTURE.md) - Understand the system
   - [API Reference](API.md) - Learn about endpoints
   - [Component Library](COMPONENTS.md) - Explore UI components
   - [Features Guide](FEATURES.md) - See all capabilities

3. **Start Development**
   - [Development Guide](DEVELOPMENT.md) - Coding standards and workflow
   - Create a feature branch
   - Make your first contribution

4. **Deploy to Production**
   - [Deployment Guide](DEPLOYMENT.md) - Deploy to Vercel

## Need Help?

- 📖 **Documentation**: Check the `/docs` folder
- 🐛 **Bug Reports**: [Open an issue](https://github.com/yourusername/ecotrackai-dashboard/issues)
- 💬 **Questions**: [Start a discussion](https://github.com/yourusername/ecotrackai-dashboard/discussions)
- 📧 **Email**: support@ecotrack.ai

## Quick Reference

### Common Commands

```bash
# Development
npm run dev          # Start dev server
npm run build        # Create production build
npm run start        # Start production server
npm run lint         # Run ESLint

# Database
psql $DATABASE_URL                        # Connect to database
psql -d ecotrackai -f database/schema.sql # Apply schema
pg_dump ecotrackai > backup.sql          # Backup database

# Git
git status          # Check current status
git pull           # Pull latest changes
git checkout -b feature/my-feature  # Create new branch
```

### Important Files

```
ecotrackai-dashboard/
├── .env.local              # Your environment variables (DO NOT COMMIT)
├── app/                    # Next.js pages and API routes
├── components/             # React components
├── lib/                    # Utility functions
├── database/schema.sql     # Database schema
└── docs/                   # Documentation
```

---

**Setup Complete!** 🚀 Happy coding!

For detailed development instructions, see [Development Guide](DEVELOPMENT.md).
