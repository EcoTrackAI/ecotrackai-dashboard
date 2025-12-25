const cron = require("node-cron");

// Sync every 5 minutes
cron.schedule("* * * * *", async () => {
  try {
    console.log("Running Firebase sync...");
    const response = await fetch("http://localhost:3000/api/sync-firebase", {
      method: "POST",
    });
    const result = await response.json();
    console.log("Sync completed:", result);
  } catch (error) {
    console.error("Sync failed:", error);
  }
});

console.log("Sync scheduler started");
