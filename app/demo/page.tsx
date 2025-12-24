"use client";

import { useState } from "react";
import { Navigation } from "@/components/navigation";

export default function NavigationDemo() {
  const [systemStatus, setSystemStatus] = useState<SystemStatus>("online");

  const [weather] = useState<WeatherData>({
    temperature: 24,
    condition: "partly-cloudy",
    location: "San Francisco",
  });

  const [user] = useState<UserProfile>({
    name: "Sarah Johnson",
    email: "sarah.johnson@example.com",
    role: "Administrator",
  });

  const [notifications, setNotifications] = useState<NotificationItem[]>([
    {
      id: "1",
      title: "High Energy Usage Detected",
      message: "Your HVAC system is consuming 25% more energy than usual.",
      type: "warning",
      timestamp: new Date(Date.now() - 1000 * 60 * 15),
      read: false,
    },
    {
      id: "2",
      title: "Solar Panel Performance",
      message: "Solar panels generated 45kWh today, 10% above forecast.",
      type: "success",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
      read: false,
    },
    {
      id: "3",
      title: "Device Offline",
      message: "Smart thermostat in bedroom lost connection.",
      type: "error",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5),
      read: true,
    },
  ]);

  const handleNotificationClick = (notification: NotificationItem) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === notification.id ? { ...n, read: true } : n))
    );
    console.log("Notification clicked:", notification);
  };

  const handleSignOut = () => {
    console.log("Sign out clicked");
  };

  const handleProfileClick = () => {
    console.log("Profile clicked");
  };

  const handleSettingsClick = () => {
    console.log("Settings clicked");
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

      <main className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Navigation Component Demo
          </h1>
          <p className="text-gray-600 mb-6">
            This is a demonstration of the responsive navigation bar component.
            Try resizing your browser window to see the responsive behavior.
          </p>

          <div className="space-y-4">
            <div className="p-4 bg-gray-50 rounded-lg">
              <h2 className="text-lg font-semibold text-gray-900 mb-3">
                System Status Controls
              </h2>
              <div className="flex gap-2">
                <button
                  onClick={() => setSystemStatus("online")}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    systemStatus === "online"
                      ? "bg-green-600 text-white"
                      : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  Set Online
                </button>
                <button
                  onClick={() => setSystemStatus("warning")}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    systemStatus === "warning"
                      ? "bg-orange-500 text-white"
                      : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  Set Warning
                </button>
                <button
                  onClick={() => setSystemStatus("offline")}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    systemStatus === "offline"
                      ? "bg-red-600 text-white"
                      : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  Set Offline
                </button>
              </div>
            </div>

            <div className="p-4 bg-gray-50 rounded-lg">
              <h2 className="text-lg font-semibold text-gray-900 mb-2">
                Features
              </h2>
              <ul className="list-disc list-inside space-y-2 text-gray-700">
                <li>Sticky navigation that stays at the top when scrolling</li>
                <li>Responsive design with mobile-first approach</li>
                <li>System status indicator with visual feedback</li>
                <li>Weather summary with temperature and conditions</li>
                <li>Notification center with unread count badge</li>
                <li>User profile dropdown with menu options</li>
                <li>Accessible with ARIA labels and keyboard navigation</li>
                <li>Clean, professional design matching your color palette</li>
              </ul>
            </div>

            <div className="p-4 bg-gray-50 rounded-lg">
              <h2 className="text-lg font-semibold text-gray-900 mb-2">
                Component Props
              </h2>
              <p className="text-gray-700 text-sm mb-2">
                The Navigation component accepts the following props:
              </p>
              <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
                <li>
                  <code className="bg-white px-1 py-0.5 rounded">
                    systemStatus
                  </code>
                  : &apos;online&apos; | &apos;offline&apos; |
                  &apos;warning&apos;
                </li>
                <li>
                  <code className="bg-white px-1 py-0.5 rounded">weather</code>:
                  Weather data object
                </li>
                <li>
                  <code className="bg-white px-1 py-0.5 rounded">user</code>:
                  User profile object
                </li>
                <li>
                  <code className="bg-white px-1 py-0.5 rounded">
                    notifications
                  </code>
                  : Array of notification objects
                </li>
                <li>
                  <code className="bg-white px-1 py-0.5 rounded">
                    onNotificationClick
                  </code>
                  : Callback when notification is clicked
                </li>
                <li>
                  <code className="bg-white px-1 py-0.5 rounded">
                    onSignOut
                  </code>
                  : Callback for sign out action
                </li>
                <li>
                  <code className="bg-white px-1 py-0.5 rounded">
                    onProfileClick
                  </code>
                  : Callback for profile view
                </li>
                <li>
                  <code className="bg-white px-1 py-0.5 rounded">
                    onSettingsClick
                  </code>
                  : Callback for settings
                </li>
              </ul>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
