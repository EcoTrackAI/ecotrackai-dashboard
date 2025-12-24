/**
 * Example integration of Navigation component in app layout
 *
 * This demonstrates how to use the Navigation component with
 * live data from Firebase and backend API
 */

"use client";

import { useEffect, useState } from "react";
import { Navigation } from "@/components/navigation";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const [systemStatus, setSystemStatus] = useState<SystemStatus>("online");
  const [weather, setWeather] = useState<WeatherData>({
    temperature: 22,
    condition: "sunny",
    location: "Home",
  });
  const [user, setUser] = useState<UserProfile>({
    name: "Guest",
    email: "guest@example.com",
  });
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);

  // Example: Fetch system status from Firebase Realtime Database
  useEffect(() => {
    // Uncomment when Firebase is configured
    /*
    import { ref, onValue } from 'firebase/database';
    import { database } from '@/lib/firebase';
    
    const statusRef = ref(database, 'system/status');
    const unsubscribe = onValue(statusRef, (snapshot) => {
      const status = snapshot.val();
      setSystemStatus(status || 'offline');
    });
    
    return () => unsubscribe();
    */

    // Simulated status check
    const interval = setInterval(() => {
      // Check if devices are responding
      setSystemStatus("online");
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  // Example: Fetch weather from backend API
  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const response = await fetch("/api/weather");
        if (response.ok) {
          const data = await response.json();
          setWeather(data);
        }
      } catch (error) {
        console.error("Failed to fetch weather:", error);
      }
    };

    fetchWeather();
    const interval = setInterval(fetchWeather, 600000); // Update every 10 minutes

    return () => clearInterval(interval);
  }, []);

  // Example: Fetch user profile
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await fetch("/api/user/profile");
        if (response.ok) {
          const data = await response.json();
          setUser(data);
        }
      } catch (error) {
        console.error("Failed to fetch user profile:", error);
      }
    };

    fetchUserProfile();
  }, []);

  // Example: Fetch notifications from Firebase
  useEffect(() => {
    // Uncomment when Firebase is configured
    /*
    import { ref, onValue, query, orderByChild, limitToLast } from 'firebase/database';
    import { database } from '@/lib/firebase';
    
    const notificationsRef = query(
      ref(database, 'notifications'),
      orderByChild('timestamp'),
      limitToLast(10)
    );
    
    const unsubscribe = onValue(notificationsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const notificationsList = Object.entries(data).map(([id, value]: [string, any]) => ({
          id,
          ...value,
          timestamp: new Date(value.timestamp),
        }));
        setNotifications(notificationsList.reverse());
      }
    });
    
    return () => unsubscribe();
    */
  }, []);

  const handleNotificationClick = async (notification: NotificationItem) => {
    // Mark notification as read in database
    try {
      await fetch(`/api/notifications/${notification.id}/read`, {
        method: "PATCH",
      });

      setNotifications((prev) =>
        prev.map((n) => (n.id === notification.id ? { ...n, read: true } : n))
      );
    } catch (error) {
      console.error("Failed to mark notification as read:", error);
    }
  };

  const handleSignOut = async () => {
    try {
      await fetch("/api/auth/signout", { method: "POST" });
      window.location.href = "/login";
    } catch (error) {
      console.error("Failed to sign out:", error);
    }
  };

  const handleProfileClick = () => {
    window.location.href = "/profile";
  };

  const handleSettingsClick = () => {
    window.location.href = "/settings";
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation
        systemStatus={systemStatus}
        weather={weather}
        user={user}
        notifications={notifications}
        onNotificationClick={handleNotificationClick}
        onSignOut={handleSignOut}
        onProfileClick={handleProfileClick}
        onSettingsClick={handleSettingsClick}
      />
      <main>{children}</main>
    </div>
  );
}
