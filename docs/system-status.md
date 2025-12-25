# System Status Integration

This document explains how the system status feature is integrated with Firebase and displayed in the Navigation and Sidebar components.

## 🎯 Overview

The system status feature monitors the Firebase connection state and displays the current system health in:
- **Navigation bar** (top of the page) - via SystemStatusIndicator component
- **Sidebar footer** (bottom of sidebar) - with detailed status message

## 🏗️ Architecture

### Components Involved

1. **AppShell** (`components/navigation/AppShell.tsx`)
   - Wraps the entire application
   - Manages Firebase connection and system status state
   - Passes `systemStatus` prop to Navigation and Sidebar

2. **Navigation** (`components/navigation/Navigation.tsx`)
   - Receives `systemStatus` prop
   - Displays status via SystemStatusIndicator component

3. **Sidebar** (`components/navigation/Sidebar.tsx`)
   - Receives `systemStatus` prop
   - Shows dynamic status indicator in footer
   - Displays status-specific messages

4. **Firebase System Status** (`lib/firebase-system-status.ts`)
   - Monitors Firebase connection state (`.info/connected`)
   - Subscribes to `system/status` path in Firebase
   - Determines overall system status

## 📊 System Status Types

```typescript
type SystemStatus = "online" | "offline" | "warning";
```

- **online**: All systems operational (🟢 green indicator, pulsing)
- **warning**: System warnings detected (🟡 yellow indicator, pulsing)
- **offline**: System offline (🔴 red indicator, no pulse)

## 🔄 How It Works

### 1. AppShell Initialization

When the app loads, `AppShell` component:
```typescript
useEffect(() => {
  const unsubscribe = subscribeSystemStatus((status) => {
    setSystemStatus(status);
  });
  return () => unsubscribe();
}, []);
```

### 2. Firebase Connection Monitoring

The `subscribeSystemStatus` function monitors two things:
- Firebase connection state: `.info/connected`
- System health status: `system/status`

```typescript
// Connection state
const connectedRef = ref(database, ".info/connected");

// System health
const systemStatusRef = ref(database, "system/status");
```

### 3. Status Determination Logic

```typescript
if (!connectionStatus) {
  // If Firebase is disconnected → offline
  callback("offline");
} else {
  // If connected → use system health status (online/warning)
  callback(systemHealth);
}
```

### 4. UI Updates

Status propagates to components:
```
AppShell → [Navigation, Sidebar]
           ↓           ↓
   SystemStatusIndicator  Footer Status
```

## 🎨 Visual Indicators

### Navigation Bar
```tsx
<SystemStatusIndicator status={systemStatus} />
```
- Shows colored dot (🟢/🟡/🔴)
- Shows status text: "Online" / "Warning" / "Offline"
- Pulses when online or warning

### Sidebar Footer

**Expanded View:**
```
System Status
🟢 All systems operational
```

**Collapsed View:**
```
🟢 (centered dot indicator)
```

**Status Messages:**
- `online`: "All systems operational"
- `warning`: "System warnings detected"
- `offline`: "System offline"

## 🔧 Firebase Setup

### 1. Database Structure

```json
{
  "system": {
    "status": "online"  // or "warning" or "offline"
  },
  "sensors": { ... }
}
```

### 2. Security Rules

Add these rules to Firebase Realtime Database:
```json
{
  "rules": {
    "system": {
      ".read": true,
      ".write": true
    },
    ".info": {
      ".read": true
    }
  }
}
```

### 3. Set Initial Status

Use the provided script:
```bash
# Set to online
node scripts/set-system-status.js online

# Set to warning
node scripts/set-system-status.js warning

# Set to offline
node scripts/set-system-status.js offline
```

## 📝 Code Examples

### Using System Status in a Component

```tsx
"use client";

import { useState, useEffect } from "react";
import { subscribeSystemStatus } from "@/lib/firebase-system-status";

export function MyComponent() {
  const [status, setStatus] = useState<SystemStatus>("offline");

  useEffect(() => {
    const unsubscribe = subscribeSystemStatus((newStatus) => {
      setStatus(newStatus);
    });
    return () => unsubscribe();
  }, []);

  return (
    <div>
      System is: {status}
    </div>
  );
}
```

### Programmatically Setting Status

```typescript
import { setSystemStatus } from "@/lib/firebase-system-status";

// Set status to warning
await setSystemStatus("warning");
```

## 🧪 Testing

### Test Online Status
```bash
# 1. Set status to online
node scripts/set-system-status.js online

# 2. Run dev server
npm run dev

# 3. Check navigation bar and sidebar footer
# Should show: 🟢 "All systems operational"
```

### Test Warning Status
```bash
# 1. Set status to warning
node scripts/set-system-status.js warning

# 2. Refresh browser
# Should show: 🟡 "System warnings detected"
```

### Test Offline Status
```bash
# 1. Set status to offline
node scripts/set-system-status.js offline

# 2. Refresh browser
# Should show: 🔴 "System offline"
```

### Test Connection Loss
```bash
# 1. Disconnect from internet
# 2. Status should automatically change to offline
# 3. Reconnect
# 4. Status should restore to previous state
```

## 🐛 Troubleshooting

### Status Always Shows "Offline"

**Possible causes:**
- Firebase not connected
- Missing environment variables
- Incorrect Firebase database URL

**Solutions:**
1. Check `.env.local` file has all Firebase config
2. Run connection test: `node scripts/test-firebase-connection.js`
3. Verify Firebase Realtime Database is enabled

### Status Doesn't Update

**Possible causes:**
- Security rules not set correctly
- Cache issue

**Solutions:**
1. Check Firebase security rules allow read on `system/status`
2. Hard refresh browser (Ctrl+Shift+R)
3. Check browser console for errors

### Script Fails to Set Status

**Error:** "Permission denied"

**Solution:**
Update Firebase security rules to allow write on `system/status`:
```json
{
  "rules": {
    "system": {
      ".read": true,
      ".write": true
    }
  }
}
```

## 🔒 Security Considerations

### Production Setup

For production, restrict write access:
```json
{
  "rules": {
    "system": {
      ".read": true,
      ".write": "auth != null && auth.uid == 'your-admin-uid'"
    }
  }
}
```

### Monitoring Service

Consider implementing a background service that:
- Monitors system health
- Updates Firebase status automatically
- Sends alerts on status changes

## 📚 API Reference

### subscribeSystemStatus

Subscribe to real-time system status updates.

```typescript
function subscribeSystemStatus(
  callback: (status: SystemStatus) => void
): () => void;
```

**Parameters:**
- `callback`: Function called when status changes

**Returns:**
- Unsubscribe function

**Example:**
```typescript
const unsubscribe = subscribeSystemStatus((status) => {
  console.log("Status changed to:", status);
});

// Later:
unsubscribe();
```

### setSystemStatus

Set the system status in Firebase.

```typescript
async function setSystemStatus(
  status: SystemStatus
): Promise<void>;
```

**Parameters:**
- `status`: One of "online", "warning", or "offline"

**Returns:**
- Promise that resolves when status is updated

**Example:**
```typescript
try {
  await setSystemStatus("warning");
  console.log("Status updated successfully");
} catch (error) {
  console.error("Failed to update status:", error);
}
```

## 🔗 Related Files

- [AppShell.tsx](../components/navigation/AppShell.tsx) - Main wrapper component
- [Navigation.tsx](../components/navigation/Navigation.tsx) - Navigation bar
- [Sidebar.tsx](../components/navigation/Sidebar.tsx) - Sidebar with status footer
- [firebase-system-status.ts](../lib/firebase-system-status.ts) - Firebase integration
- [set-system-status.js](../scripts/set-system-status.js) - Status setting script

## 📞 Support

If you encounter issues:
1. Check Firebase Console for connection issues
2. Review browser console for JavaScript errors
3. Verify Firebase security rules
4. Test Firebase connection with test script

---

**Last Updated:** December 25, 2025
