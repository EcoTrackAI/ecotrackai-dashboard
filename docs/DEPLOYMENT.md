# Deployment Guide

**Version**: 1.1  
**Last Updated**: December 26, 2025  
**Status**: Production Ready

## Overview

This comprehensive guide covers deploying the EcoTrack AI Dashboard to production environments. Whether you're deploying to Vercel, Netlify, AWS, or self-hosting, this document provides step-by-step instructions for a successful deployment.

### Supported Platforms

| Platform        | Difficulty | Cost                 | Recommended       |
| --------------- | ---------- | -------------------- | ----------------- |
| **Vercel**      | Easy       | Free tier available  | ✅ Yes            |
| **Netlify**     | Easy       | Free tier available  | ⚠️ Limited        |
| **Railway**     | Medium     | Pay-as-you-go        | ⚠️ Alternative    |
| **AWS/GCP**     | Hard       | Variable             | ❌ Advanced users |
| **Self-Hosted** | Hard       | Infrastructure costs | ❌ Enterprise     |

### Deployment Checklist

Before deploying, ensure you have:

- ✅ Firebase project configured
- ✅ PostgreSQL database provisioned
- ✅ Environment variables documented
- ✅ Build passing locally
- ✅ Git repository set up
- ✅ Domain name (optional)

## Table of Contents

1. [Pre-Deployment Checklist](#pre-deployment-checklist)
2. [Environment Setup](#environment-setup)
3. [Deploy to Vercel](#deploy-to-vercel)
4. [Deploy to Other Platforms](#deploy-to-other-platforms)
5. [Database Setup](#database-setup)
6. [Post-Deployment](#post-deployment)
7. [Monitoring](#monitoring)
8. [Troubleshooting](#troubleshooting)

## Pre-Deployment Checklist

Before deploying, ensure you have:

- [ ] Firebase project created and configured
- [ ] PostgreSQL database provisioned (Neon, Supabase, or self-hosted)
- [ ] Environment variables documented
- [ ] Database schema applied
- [ ] Build passing locally (`npm run build`)
- [ ] Git repository created
- [ ] Domain name (optional)

## Environment Setup

### Required Environment Variables

Create a `.env.production` file or configure in your hosting platform:

```env
# Firebase Configuration (NEXT_PUBLIC_ prefix for client access)
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSy...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abc123
NEXT_PUBLIC_FIREBASE_DATABASE_URL=https://your-project.firebaseio.com

# PostgreSQL Configuration (server-side only)
DATABASE_URL=postgresql://user:password@host:5432/database?sslmode=require
# OR
POSTGRES_URL=postgresql://user:password@host:5432/database?sslmode=require

# Node Environment
NODE_ENV=production
```

### Security Best Practices

1. **Never commit `.env` files** to version control
2. **Rotate secrets regularly** (every 90 days)
3. **Use different credentials** for dev, staging, and production
4. **Enable SSL/TLS** for all database connections
5. **Restrict API access** with CORS and rate limiting

## Deploy to Vercel

Vercel is the recommended platform for Next.js applications.

### Step 1: Install Vercel CLI

```bash
npm install -g vercel
```

### Step 2: Login to Vercel

```bash
vercel login
```

### Step 3: Link Project

```bash
cd ecotrackai-dashboard
vercel link
```

### Step 4: Add Environment Variables

**Option A: Via Vercel CLI**

```bash
vercel env add NEXT_PUBLIC_FIREBASE_API_KEY
# Paste value when prompted
# Repeat for all variables
```

**Option B: Via Vercel Dashboard**

1. Go to your project on vercel.com
2. Navigate to **Settings** > **Environment Variables**
3. Add each variable:
   - Name: `NEXT_PUBLIC_FIREBASE_API_KEY`
   - Value: `AIzaSy...`
   - Environment: Production, Preview, Development

### Step 5: Deploy

```bash
vercel --prod
```

### Step 6: Configure Domain (Optional)

```bash
vercel domains add yourdomain.com
```

Or in Vercel Dashboard:

1. Go to **Settings** > **Domains**
2. Add your custom domain
3. Update DNS records as instructed

### Automatic Deployments

**Configure GitHub Integration:**

1. Push code to GitHub
2. Import project to Vercel from GitHub
3. Vercel auto-deploys on every push to `main`
4. Preview deployments for PRs

```bash
# Push to deploy
git add .
git commit -m "Deploy update"
git push origin main
```

## Deploy to Other Platforms

### Netlify

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login
netlify login

# Initialize
netlify init

# Deploy
netlify deploy --prod
```

**netlify.toml:**

```toml
[build]
  command = "npm run build"
  publish = ".next"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

### AWS (Amplify)

```bash
# Install Amplify CLI
npm install -g @aws-amplify/cli

# Configure
amplify configure

# Initialize
amplify init

# Add hosting
amplify add hosting

# Deploy
amplify publish
```

### Docker

**Dockerfile:**

```dockerfile
FROM node:18-alpine AS base

# Install dependencies
FROM base AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

# Build application
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# Production image
FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000

CMD ["node", "server.js"]
```

**Build and run:**

```bash
docker build -t ecotrackai-dashboard .
docker run -p 3000:3000 --env-file .env.production ecotrackai-dashboard
```

### Self-Hosted (PM2)

```bash
# Install PM2
npm install -g pm2

# Build application
npm run build

# Start with PM2
pm2 start npm --name "ecotrackai" -- start

# Setup auto-restart on reboot
pm2 startup
pm2 save
```

## Database Setup

### Using Neon (Recommended)

Neon provides serverless PostgreSQL perfect for Next.js apps.

**Step 1: Create Neon Project**

1. Go to [console.neon.tech](https://console.neon.tech)
2. Create new project
3. Copy connection string

**Step 2: Apply Schema**

```bash
# Using psql
psql $DATABASE_URL -f database/schema.sql

# OR using Neon Console SQL Editor
# Paste schema.sql content and run
```

**Step 3: Verify Connection**

```bash
curl https://your-app.vercel.app/api/sync-firebase
```

### Using Supabase

```bash
# Install Supabase CLI
npm install -g supabase

# Login
supabase login

# Create project
supabase projects create ecotrackai

# Get connection string
supabase db get-connection-string

# Run migrations
psql "$CONNECTION_STRING" -f database/schema.sql
```

### Using AWS RDS

1. Create RDS PostgreSQL instance
2. Configure security group (allow port 5432)
3. Note endpoint and credentials
4. Apply schema via psql
5. Add connection string to environment variables

### Self-Hosted PostgreSQL

```bash
# Install PostgreSQL
sudo apt update
sudo apt install postgresql postgresql-contrib

# Create database
sudo -u postgres createdb ecotrackai

# Create user
sudo -u postgres createuser --interactive --pwprompt

# Apply schema
sudo -u postgres psql ecotrackai -f database/schema.sql

# Configure pg_hba.conf for remote access
sudo nano /etc/postgresql/14/main/pg_hba.conf
# Add: host all all 0.0.0.0/0 md5

# Restart PostgreSQL
sudo systemctl restart postgresql
```

## Post-Deployment

### 1. Verify Deployment

```bash
# Check homepage
curl https://your-app.vercel.app

# Check API endpoints
curl https://your-app.vercel.app/api/rooms
curl https://your-app.vercel.app/api/sync-firebase

# Check database connection
curl -X POST https://your-app.vercel.app/api/sync-firebase
```

### 2. Test Firebase Connection

1. Open browser dev tools
2. Navigate to live monitoring page
3. Verify real-time data appears
4. Check console for connection errors

### 3. Trigger Initial Sync

```bash
curl -X POST https://your-app.vercel.app/api/sync-firebase
```

### 4. Monitor Logs

**Vercel:**

```bash
vercel logs --follow
```

**AWS CloudWatch:**

- Navigate to CloudWatch Logs
- Filter by application name

**Self-hosted (PM2):**

```bash
pm2 logs ecotrackai
```

### 5. Set Up Monitoring

- Enable Vercel Analytics
- Configure error tracking (Sentry)
- Set up uptime monitoring (UptimeRobot)
- Create alerting rules

## Monitoring

### Vercel Analytics

Enable in Vercel Dashboard:

1. Go to **Analytics** tab
2. Enable Web Analytics
3. View real-time metrics

### Application Performance

Monitor:

- Page load times
- API response times
- Database query performance
- Firebase read/write operations
- Error rates

### Database Monitoring

**Neon Dashboard:**

- Connection count
- Query performance
- Storage usage
- Branch activity

**Custom Queries:**

```sql
-- Check table sizes
SELECT
  schemaname,
  tablename,
  pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS size
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;

-- Check record counts
SELECT
  'sensor_data' as table_name,
  COUNT(*) as record_count
FROM sensor_data
UNION ALL
SELECT
  'rooms' as table_name,
  COUNT(*) as record_count
FROM rooms;
```

### Firebase Monitoring

Firebase Console:

- Realtime Database usage
- Bandwidth consumption
- Concurrent connections
- Read/write operations

## Troubleshooting

### Build Failures

**Error: Module not found**

```bash
# Clear cache and reinstall
rm -rf node_modules .next
npm install
npm run build
```

**Error: TypeScript errors**

```bash
# Check types
npm run lint
# Fix issues before deploying
```

### Database Connection Issues

**Error: Connection timeout**

```bash
# Check firewall rules
# Verify SSL mode
# Test connection string locally
psql "$DATABASE_URL" -c "SELECT 1"
```

**Error: Too many connections**

```typescript
// Adjust pool size in lib/database.ts
const pool = new Pool({
  connectionString,
  max: 10, // Reduce from 20
});
```

### Firebase Issues

**Error: Permission denied**

- Check Firebase Realtime Database rules
- Verify API key is correct
- Ensure database URL is accurate

**Error: Quota exceeded**

- Check Firebase usage dashboard
- Upgrade plan if needed
- Optimize read/write operations

### Performance Issues

**Slow page loads**

- Enable static page generation where possible
- Implement caching strategies
- Optimize images with next/image
- Reduce JavaScript bundle size

**Slow API responses**

- Add database indexes
- Implement query caching
- Use connection pooling
- Optimize SQL queries

### Sync Not Working

**Data not syncing**

```bash
# Check sync endpoint manually
curl -X POST https://your-app.vercel.app/api/sync-firebase

# Check logs for errors
vercel logs --follow

# Verify DataSyncProvider is mounted
# Check browser console for errors
```

## Rollback Strategy

### Vercel Rollback

```bash
# List deployments
vercel ls

# Promote previous deployment
vercel promote <deployment-url>
```

Or in Vercel Dashboard:

1. Go to **Deployments**
2. Find stable deployment
3. Click **Promote to Production**

### Database Rollback

```bash
# Backup current data
pg_dump $DATABASE_URL > backup_$(date +%Y%m%d).sql

# Restore from backup
psql $DATABASE_URL < backup_20250126.sql
```

## Security Checklist

- [ ] HTTPS enabled (automatic on Vercel)
- [ ] Environment variables secured
- [ ] Database SSL/TLS enabled
- [ ] Firebase security rules configured
- [ ] Rate limiting enabled
- [ ] CORS properly configured
- [ ] SQL injection prevention (using parameterized queries)
- [ ] XSS protection (React default)
- [ ] Regular dependency updates
- [ ] Security headers configured

## Performance Checklist

- [ ] Image optimization enabled
- [ ] Static page generation where possible
- [ ] API response caching
- [ ] Database query optimization
- [ ] Connection pooling configured
- [ ] CDN enabled (automatic on Vercel)
- [ ] Gzip compression enabled
- [ ] Bundle size optimization

## Cost Optimization

### Vercel

- Use **Hobby plan** for personal projects (free)
- Upgrade to **Pro** ($20/mo) for teams
- Monitor bandwidth usage
- Optimize image delivery

### Neon

- Free tier: 512MB storage, 100 hours compute/month
- Pro tier: $19/mo for unlimited
- Use branching for dev/staging
- Regular data cleanup

### Firebase

- Free tier: 10GB storage, 50K simultaneous connections
- Monitor usage dashboard
- Optimize read/write operations
- Consider Firestore for complex queries

## Backup Strategy

### Database Backups

**Automated (Neon):**

- Point-in-time recovery (30 days)
- Automatic daily backups
- Branch-based testing

**Manual:**

```bash
# Daily backup script
#!/bin/bash
DATE=$(date +%Y%m%d)
pg_dump $DATABASE_URL | gzip > backups/ecotrackai_$DATE.sql.gz

# Keep last 30 days
find backups/ -name "*.sql.gz" -mtime +30 -delete
```

### Code Backups

- Git repository (primary)
- Vercel deployment history
- Local backups
- External repository mirror (GitHub + GitLab)

## Scaling Strategy

### Horizontal Scaling

- Vercel scales automatically
- Add more Firebase RTDB instances if needed
- PostgreSQL read replicas for read-heavy workloads

### Vertical Scaling

- Upgrade Vercel plan for more resources
- Increase Neon compute tier
- Optimize database queries before scaling

## Conclusion

Your EcoTrack AI Dashboard is now deployed and ready for production use! Monitor performance, keep dependencies updated, and scale as needed.

For support:

- GitHub Issues: https://github.com/yourusername/ecotrackai-dashboard/issues
- Documentation: https://docs.ecotrackai.com
- Email: support@ecotrackai.com
