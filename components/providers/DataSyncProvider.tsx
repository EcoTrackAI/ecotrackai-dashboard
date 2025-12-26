"use client";

import { useEffect, useRef } from "react";

const SYNC_INTERVAL = 60 * 1000; // 1 minute

/**
 * DataSyncProvider - Handles automatic Firebase to PostgreSQL data synchronization
 * Runs client-side with a 1-minute interval to replace Vercel cron jobs
 */
export function DataSyncProvider({ children }: { children: React.ReactNode }) {
  const syncTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isSyncingRef = useRef(false);

  useEffect(() => {
    const syncData = async () => {
      // Prevent concurrent syncs
      if (isSyncingRef.current) {
        console.log("⏳ Sync already in progress, skipping...");
        return;
      }

      isSyncingRef.current = true;
      const timestamp = new Date().toISOString();
      console.log(`[${timestamp}] Starting Firebase sync...`);

      try {
        const response = await fetch("/api/sync-firebase", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
        });

        const result = await response.json();

        if (response.ok && !result.error) {
          console.log(
            `✅ Synced ${result.synced} sensors, ${result.rooms} rooms`
          );
        } else {
          console.error(`❌ Sync failed:`, result.error || response.statusText);
        }
      } catch (error) {
        console.error(
          `❌ Sync error:`,
          error instanceof Error ? error.message : "Unknown error"
        );
      } finally {
        isSyncingRef.current = false;
      }
    };

    // Initial sync after a short delay
    const initialTimeout = setTimeout(() => {
      syncData();
    }, 5000); // Wait 5 seconds after page load

    // Schedule recurring syncs
    const scheduleNextSync = () => {
      syncTimeoutRef.current = setTimeout(() => {
        syncData().then(() => {
          scheduleNextSync(); // Schedule next sync after completion
        });
      }, SYNC_INTERVAL);
    };

    scheduleNextSync();

    // Cleanup on unmount
    return () => {
      clearTimeout(initialTimeout);
      if (syncTimeoutRef.current) {
        clearTimeout(syncTimeoutRef.current);
      }
    };
  }, []);

  return <>{children}</>;
}
