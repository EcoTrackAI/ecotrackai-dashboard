/**
 * User Profile Page
 * Professional profile layout for IoT Smart Energy Dashboard
 */

"use client";

import React, { useState } from "react";
import { ProfileCard, ProfileField, ToggleField } from "@/components/profile";
// ProfileData type is globally available from types/globals.d.ts

// Mock data - replace with actual data fetching
const mockProfileData: ProfileData = {
  user: {
    id: "1",
    name: "Dr. Sarah Mitchell",
    email: "sarah.mitchell@ecotrackai.com",
    role: "Admin",
    avatarInitials: "SM",
  },
  systemInfo: {
    connectedDevices: 24,
    activeRooms: 8,
    lastLogin: new Date("2025-12-24T09:30:00"),
  },
  preferences: {
    theme: "light",
    notificationsEnabled: true,
    automationMode: true,
  },
};

export default function ProfilePage() {
  const [profileData, setProfileData] = useState<ProfileData>(mockProfileData);
  const [isLoading, setIsLoading] = useState(false);

  const handleEditProfile = () => {
    // Handle edit profile action
    console.log("Edit profile clicked");
  };

  const handleLogout = () => {
    // Handle logout action
    console.log("Logout clicked");
  };

  const formatLastLogin = (date: Date | string): string => {
    const loginDate = typeof date === "string" ? new Date(date) : date;
    return loginDate.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center">
        <div className="animate-pulse text-gray-500">Loading profile...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-4 md:p-6 lg:p-8">
      <div className="max-w-5xl mx-auto">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#111827] mb-2">Profile</h1>
          <p className="text-sm text-gray-600">
            Manage your account settings and preferences
          </p>
        </div>

        {/* Profile Avatar Section */}
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6 mb-6">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
            {/* Avatar */}
            <div className="shrink-0">
              {profileData.user.avatarUrl ? (
                <img
                  src={profileData.user.avatarUrl}
                  alt={profileData.user.name}
                  className="w-24 h-24 rounded-full object-cover border-2 border-[#6366F1]"
                />
              ) : (
                <div className="w-24 h-24 rounded-full bg-[#6366F1] flex items-center justify-center border-2 border-[#6366F1]">
                  <span className="text-3xl font-bold text-white">
                    {profileData.user.avatarInitials || "U"}
                  </span>
                </div>
              )}
            </div>

            {/* User Info */}
            <div className="grow text-center md:text-left">
              <h2 className="text-2xl font-bold text-[#111827] mb-1">
                {profileData.user.name}
              </h2>
              <p className="text-gray-600 mb-2">{profileData.user.email}</p>
              <span
                className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                  profileData.user.role === "Admin"
                    ? "bg-[#6366F1] text-white"
                    : "bg-gray-200 text-gray-700"
                }`}
              >
                {profileData.user.role}
              </span>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* User Information Card */}
          <ProfileCard title="User Information">
            <ProfileField
              label="Full Name"
              value={profileData.user.name}
              icon={
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              }
            />
            <ProfileField
              label="Email Address"
              value={profileData.user.email}
              icon={
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
              }
            />
            <ProfileField
              label="Account Role"
              value={profileData.user.role}
              icon={
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  />
                </svg>
              }
            />
          </ProfileCard>

          {/* System Information Card */}
          <ProfileCard title="System Information">
            <ProfileField
              label="Connected Devices"
              value={profileData.systemInfo.connectedDevices}
              icon={
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
              }
            />
            <ProfileField
              label="Active Rooms"
              value={profileData.systemInfo.activeRooms}
              icon={
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                  />
                </svg>
              }
            />
            <ProfileField
              label="Last Login"
              value={formatLastLogin(profileData.systemInfo.lastLogin)}
              icon={
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              }
            />
          </ProfileCard>
        </div>

        {/* Preferences Card */}
        <ProfileCard title="Preferences" className="mb-6">
          <ProfileField
            label="Theme"
            value="Light"
            icon={
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                />
              </svg>
            }
          />
          <ToggleField
            label="Notifications"
            enabled={profileData.preferences.notificationsEnabled}
            icon={
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                />
              </svg>
            }
          />
          <ToggleField
            label="Automation Mode"
            enabled={profileData.preferences.automationMode}
            icon={
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
            }
          />
        </ProfileCard>

        {/* Account Actions */}
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Account Actions
          </h2>
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={handleEditProfile}
              className="flex-1 bg-[#6366F1] hover:bg-[#5558E3] text-white font-medium py-2.5 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
              aria-label="Edit profile"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                />
              </svg>
              Edit Profile
            </button>
            <button
              onClick={handleLogout}
              className="flex-1 bg-white hover:bg-gray-50 text-[#DC2626] font-medium py-2.5 px-4 rounded-lg border border-[#DC2626] transition-colors duration-200 flex items-center justify-center gap-2"
              aria-label="Logout"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                />
              </svg>
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
