"use client";

import { useState, useEffect } from "react";
import { Navigation } from "./Navigation";
import { Sidebar } from "./Sidebar";
import { subscribeSystemStatus } from "@/lib/firebase-system-status";

interface AppShellProps {
  children: React.ReactNode;
}

/**
 * App Shell component that wraps the entire application
 * Manages Firebase connection and passes system status to Navigation and Sidebar
 */
export function AppShell({ children }: AppShellProps) {
  const [systemStatus, setSystemStatus] = useState<SystemStatus>("offline");
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    // Subscribe to system status updates from Firebase
    const unsubscribe = subscribeSystemStatus((status) => {
      setSystemStatus(status);
      if (!isInitialized) {
        setIsInitialized(true);
      }
    });

    // Cleanup on unmount
    return () => {
      unsubscribe();
    };
  }, [isInitialized]);

  return (
    <>
      <Navigation systemStatus={systemStatus} />
      <Sidebar systemStatus={systemStatus} />
      <main className="lg:ml-64 pt-16 transition-all duration-300">
        {children}
      </main>
    </>
  );
}
