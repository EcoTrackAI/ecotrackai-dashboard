# Setting Up Automated Firebase-to-Neon Sync with cron-job.org

This guide explains how to automate syncing your Firebase sensor data to Neon Postgres using cron-job.org and your `/api/sync-firebase` endpoint.

## 1. Prerequisites

- Your app deployed and accessible via HTTPS (e.g., Vercel, Render, etc.)
- The `/api/sync-firebase` endpoint is live and working
- You have a cron-job.org account (free)

## 2. API Endpoint

The endpoint to trigger is:

```
https://<your-app-domain>/api/sync-firebase
```

Use the POST method to trigger the sync.

## 3. Step-by-Step Setup on cron-job.org

### a. Sign Up / Log In

- Go to [cron-job.org](https://cron-job.org/)
- Create an account or log in

### b. Create a New Cron Job

1. Click **Create Cron Job**
2. **URL:** Enter your sync endpoint, e.g.
   ```
   https://your-app.vercel.app/api/sync-firebase
   ```
3. **HTTP Method:** Select `POST`
4. **Schedule:** Set the interval (e.g., every 1 minute, every 5 minutes)
5. **Custom Headers:** (Optional) Add any required headers, e.g. `Authorization` if your endpoint is protected
6. **Active:** Make sure the job is enabled
7. Click **Create Cron Job**

### c. Monitor Results

- cron-job.org will show logs of each run
- Check your app/database to confirm data is syncing

## 4. Troubleshooting

- Ensure your endpoint is publicly accessible
- Check logs on cron-job.org for errors
- Check your app logs for sync errors
- Make sure your database credentials are correct

## 5. Security Tips

- If your endpoint is public, consider adding a secret token or basic auth
- Only allow POST requests for syncing

---

For more details, see [cron-job.org documentation](https://cron-job.org/docs/).
