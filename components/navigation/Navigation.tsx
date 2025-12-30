"use client";

import Link from "next/link";
import { APP_CONFIG } from "@/lib/constants";
import { SystemStatusIndicator } from "./SystemStatusIndicator";
import { WeatherSummary } from "./WeatherSummary";
import { NotificationIcon } from "./NotificationIcon";
import { UserProfileDropdown } from "./UserProfileDropdown";
import Image from "next/image";

export function Navigation({
  systemStatus = "online",
  weather = {
    temperature: 22,
    condition: "sunny",
    location: "Home",
  },
  user = {
    id: "guest",
    name: "Guest User",
    email: "guest@example.com",
    role: "User",
  },
  notifications = [],
  onNotificationClick,
  onSignOut,
  className = "",
}: NavigationProps) {
  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200 ${className}`}
      role="navigation"
      aria-label="Main navigation"
    >
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left: Logo and Title */}
          <div className="flex items-center gap-3 shrink-0">
            <Link
              href="/"
              className="flex items-center gap-3 focus:outline-none focus:ring-2 focus:ring-transparent focus:ring-offset-2 px-2 py-1 -mx-2"
              aria-label={`${APP_CONFIG.name} home`}
            >
              <Image
                src="/logo.png"
                alt={APP_CONFIG.name}
                width={32}
                height={32}
                className="h-8 w-8 object-contain"
              />
              <div className="hidden sm:flex flex-col">
                <span className="text-base font-bold text-gray-900 leading-tight">
                  {APP_CONFIG.name}
                </span>
                <span className="text-xs text-gray-500 leading-tight">
                  {APP_CONFIG.description}
                </span>
              </div>
            </Link>
          </div>

          {/* Right: Status, Weather, Notifications, Profile */}
          <div className="flex items-center gap-3 sm:gap-4 lg:gap-6">
            {/* System Status */}
            <SystemStatusIndicator status={systemStatus} />

            {/* Divider */}
            <div
              className="hidden sm:block h-6 w-px bg-gray-200"
              aria-hidden="true"
            />

            {/* Weather */}
            <WeatherSummary weather={weather} className="hidden sm:flex" />

            {/* Divider */}
            <div
              className="hidden md:block h-6 w-px bg-gray-200"
              aria-hidden="true"
            />

            {/* Notifications */}
            <NotificationIcon
              notifications={notifications}
              onNotificationClick={onNotificationClick}
            />

            {/* User Profile */}
            <UserProfileDropdown user={user} onSignOut={onSignOut} />
          </div>
        </div>
      </div>
    </nav>
  );
}
