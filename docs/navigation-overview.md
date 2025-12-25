# Navigation Component

A responsive, accessible top navigation bar for the EcoTrack AI smart energy dashboard.

## Features

- **Sticky Positioning**: Stays at the top of the page when scrolling
- **System Status Indicator**: Shows online/offline/warning states with visual feedback
- **Weather Summary**: Displays current temperature and weather conditions
- **Notification Center**: Interactive notification dropdown with unread count badge
- **User Profile Dropdown**: User menu with profile, settings, and sign out options
- **Fully Responsive**: Mobile-first design that adapts to all screen sizes
- **Accessible**: ARIA labels, keyboard navigation, and focus management
- **Type Safe**: Full TypeScript support with comprehensive type definitions

## Components

### Navigation (Main Component)

The primary navigation bar that combines all sub-components.

```tsx
import { Navigation } from "@/components/navigation";

<Navigation
  systemStatus="online"
  weather={{
    temperature: 24,
    condition: "sunny",
    location: "Home",
  }}
  user={{
    name: "John Doe",
    email: "john@example.com",
    role: "Admin",
  }}
  notifications={[]}
  onNotificationClick={(notification) => console.log(notification)}
  onSignOut={() => console.log("Sign out")}
  onProfileClick={() => console.log("Profile")}
  onSettingsClick={() => console.log("Settings")}
/>;
```

### SystemStatusIndicator

Displays the current system status with a colored dot indicator.

```tsx
<SystemStatusIndicator status="online" />
```

### WeatherSummary

Shows current weather information with icon and temperature.

```tsx
<WeatherSummary
  weather={{
    temperature: 22,
    condition: "partly-cloudy",
    location: "San Francisco",
  }}
/>
```

### NotificationIcon

Interactive notification center with dropdown.

```tsx
<NotificationIcon
  notifications={notifications}
  onNotificationClick={(n) => handleNotificationClick(n)}
/>
```

### UserProfileDropdown

User profile menu with avatar and action items.

```tsx
<UserProfileDropdown
  user={{ name: "Sarah", email: "sarah@example.com" }}
  onSignOut={() => handleSignOut()}
  onProfileClick={() => handleProfile()}
  onSettingsClick={() => handleSettings()}
/>
```

## Props

### Navigation Props

| Prop                  | Type                                       | Default    | Description                |
| --------------------- | ------------------------------------------ | ---------- | -------------------------- |
| `systemStatus`        | `SystemStatus`                             | `'online'` | Current system status      |
| `weather`             | `WeatherData`                              | See below  | Weather information        |
| `user`                | `UserProfile`                              | See below  | User information           |
| `notifications`       | `NotificationItem[]`                       | `[]`       | Array of notifications     |
| `onNotificationClick` | `(notification: NotificationItem) => void` | -          | Notification click handler |
| `onSignOut`           | `() => void`                               | -          | Sign out handler           |
| `onProfileClick`      | `() => void`                               | -          | Profile click handler      |
| `onSettingsClick`     | `() => void`                               | -          | Settings click handler     |
| `className`           | `string`                                   | `''`       | Additional CSS classes     |

### Global Type Definitions

All types are globally available (defined in `types/globals.d.ts`) - no imports needed!

```typescript
type SystemStatus = "online" | "offline" | "warning";

interface WeatherData {
  temperature: number;
  condition: "sunny" | "cloudy" | "rainy" | "snowy" | "partly-cloudy";
  location: string;
}

interface UserProfile {
  name: string;
  email: string;
  avatar?: string;
  role?: string;
}

interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: "info" | "warning" | "error" | "success";
  timestamp: Date;
  read: boolean;
}
```

## Responsive Behavior

- **Mobile (< 640px)**: Compact layout, hides some text labels
- **Tablet (640px - 1024px)**: Shows status labels, hides weather details
- **Desktop (> 1024px)**: Full layout with all information visible

## Accessibility

- All interactive elements are keyboard accessible
- ARIA labels for screen readers
- Focus management for dropdowns
- High contrast for visibility
- Semantic HTML structure

## Color Palette

The component uses the EcoTrack AI design system colors:

- Background: `#F8FAFC`
- Primary: `#6366F1` (Indigo)
- Success: `#16A34A` (Green)
- Warning: `#FB923C` (Orange)
- Error: `#DC2626` (Red)

## Demo

Visit `/demo` to see the navigation component in action with interactive controls.

## Integration with Firebase & API

To integrate with live data sources:

```tsx
"use client";

import { useEffect, useState } from "react";
import { Navigation } from "@/components/navigation";
import { ref, onValue } from "firebase/database";
import { database } from "@/lib/firebase";

export default function DashboardLayout({ children }) {
  const [systemStatus, setSystemStatus] = useState("online");
  const [weather, setWeather] = useState(null);

  // Listen to Firebase for real-time system status
  useEffect(() => {
    const statusRef = ref(database, "system/status");
    const unsubscribe = onValue(statusRef, (snapshot) => {
      setSystemStatus(snapshot.val());
    });
    return () => unsubscribe();
  }, []);

  // Fetch weather from API
  useEffect(() => {
    fetch("/api/weather")
      .then((res) => res.json())
      .then((data) => setWeather(data));
  }, []);

  return (
    <>
      <Navigation
        systemStatus={systemStatus}
        weather={weather}
        {...otherProps}
      />
      {children}
    </>
  );
}
```

## Performance

- Uses 'use client' directive only where needed
- Optimized re-renders with proper React hooks
- Lazy loading for dropdown menus
- No unnecessary dependencies

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## License

Part of the EcoTrack AI Dashboard project.
