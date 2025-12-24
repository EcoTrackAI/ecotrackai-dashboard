/**
 * User Profile Types
 * Type definitions for user profile data and system information
 */

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: "Admin" | "User";
  avatarUrl?: string;
  avatarInitials?: string;
}

export interface SystemInfo {
  connectedDevices: number;
  activeRooms: number;
  lastLogin: Date | string;
}

export interface UserPreferences {
  theme: "light" | "dark";
  notificationsEnabled: boolean;
  automationMode: boolean;
}

export interface ProfileData {
  user: UserProfile;
  systemInfo: SystemInfo;
  preferences: UserPreferences;
}
