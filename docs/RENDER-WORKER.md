# Render Background Worker Integration

This guide explains how to set up a standalone background worker on [Render](https://render.com/) to sync Firebase Realtime Database data to Neon Postgres every minute.

## 1. Prerequisites
- A Render account (free tier is sufficient)
- Your Neon Postgres connection string
- Firebase Realtime Database credentials
- This project deployed to a Git repository (GitHub, GitLab, etc.)

## 2. Worker Script Location
The worker script is located at:
```
worker/firebase-to-neon-worker.ts
```
This script fetches sensor data from Firebase and saves it to Neon Postgres every minute.

## 3. Setup Steps

### a. Prepare Your Repository
- Ensure your worker script and all dependencies are committed.
- Your `package.json` should include all required dependencies (`pg`, `firebase`, etc.).

### b. Create a New Background Worker on Render
1. Go to your Render dashboard.
2. Click **New** > **Background Worker**.
3. Connect your Git repository.
4. Set the **Start Command** to:
   ```
   npx ts-node worker/firebase-to-neon-worker.ts
   ```
   Or, if compiled to JS:
   ```
   node worker/firebase-to-neon-worker.js
   ```
5. Set environment variables:
   - `DATABASE_URL` (Neon Postgres connection string)
   - All Firebase credentials (see `.env.production.example`)
6. Choose a region and free plan if desired.
7. Click **Create Worker**.

### c. Environment Variables
Copy the relevant variables from your `.env.production.example`:
```
DATABASE_URL=postgresql://user:password@host.region.neon.tech:5432/ecotrackai?sslmode=require
NEXT_PUBLIC_FIREBASE_API_KEY=...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=...
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
NEXT_PUBLIC_FIREBASE_APP_ID=...
NEXT_PUBLIC_FIREBASE_DATABASE_URL=...
```

### d. Monitoring & Logs
- Render provides logs for your worker. Check logs for sync status and errors.
- The worker runs continuously and syncs every minute.

## 4. Notes
- You can adjust the sync interval in `firebase-to-neon-worker.ts`.
- The worker is independent of your main web app and does not require the site to be running.
- For production, ensure your worker is running in the same environment as your database and Firebase credentials.

## 5. Troubleshooting
- Check logs for connection errors.
- Ensure all environment variables are set correctly.
- Make sure your Neon database allows connections from Render.

---
For more details, see [Render Docs](https://render.com/docs/background-workers).
