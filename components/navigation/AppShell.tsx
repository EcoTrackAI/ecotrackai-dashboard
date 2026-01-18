"use client";

import { useState, useEffect } from "react";
import { Navigation } from "./Navigation";
import { Sidebar } from "./Sidebar";
import { subscribeSystemStatus } from "@/lib/firebase-system-status";
import { fetchWeather } from "@/lib/weather";

// AppShellProps is globally available from types/globals.d.ts

export function AppShell({ children }: AppShellProps) {
  const [systemStatus, setSystemStatus] = useState<SystemStatus>("offline");
  const [isInitialized, setIsInitialized] = useState(false);
  const [weather, setWeather] = useState<WeatherData>({
    temperature: 22,
    condition: "sunny",
    location: "Home",
  });

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

  // Fetch weather data on mount and refresh every 10 minutes
  useEffect(() => {
    const loadWeather = async () => {
      const apiKey = process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY;
      if (!apiKey) {
        return;
      }

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          const weatherData = await fetchWeather(apiKey, latitude, longitude);
          if (weatherData) {
            setWeather(weatherData);
          }
        },
        () => {
          // Geolocation not available
          setWeather({
            temperature: 0,
            condition: "not-available",
            location: "Not Available",
          });
        },
      );
    };

    loadWeather();

    // Refresh weather every 10 minutes
    const interval = setInterval(loadWeather, 10 * 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <Navigation systemStatus={systemStatus} weather={weather} />
      <Sidebar systemStatus={systemStatus} />
      <main className="lg:ml-64 pt-16 transition-all duration-300">
        {children}
      </main>
    </>
  );
}
