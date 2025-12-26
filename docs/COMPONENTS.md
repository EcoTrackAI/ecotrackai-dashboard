# Component Library Reference

**Version**: 1.0.0  
**Last Updated**: December 26, 2025  
**Status**: Production Ready

## Overview

This document provides comprehensive documentation for all reusable React components in the EcoTrack AI Dashboard. Each component includes TypeScript interfaces, usage examples, props documentation, and best practices.

### Component Architecture

All components follow these principles:

- **Type-Safe**: Full TypeScript support with strict typing
- **Reusable**: Designed for composition and reuse
- **Accessible**: ARIA attributes and keyboard navigation
- **Responsive**: Mobile-first design approach
- **Performant**: Optimized rendering with React.memo where appropriate

## Table of Contents

1. [Metrics Components](#metrics-components)
2. [Sensor Components](#sensor-components)
3. [Room Components](#room-components)
4. [Chart Components](#chart-components)
5. [Automation Components](#automation-components)
6. [Navigation Components](#navigation-components)
7. [Recommendation Components](#recommendation-components)
8. [Provider Components](#provider-components)
9. [Best Practices](#best-practices)

## Metrics Components

### MetricCard

Display a key metric with value, trend, and icon.

**Location**: `components/metrics/MetricCard.tsx`

**Props:**

```typescript
interface MetricCardProps {
  title: string;
  value: string | number;
  unit: string;
  icon: React.ReactNode;
  trend?: {
    direction: "up" | "down";
    value: number;
    isPositive?: boolean;
  };
  className?: string;
}
```

**Usage:**

```tsx
import { MetricCard } from "@/components/metrics";

<MetricCard
  title="Current Power Usage"
  value={4.2}
  unit="kW"
  icon={<PowerIcon />}
  trend={{
    direction: "up",
    value: 8.3,
    isPositive: false,
  }}
/>;
```

**Features:**

- Responsive design
- Color-coded trends (green=good, red=bad)
- Icon support
- Customizable with className
- Accessible with ARIA labels

---

## Sensor Components

### LiveSensorCard

Display real-time sensor data with status indicators.

**Location**: `components/sensors/LiveSensorCard.tsx`

**Props:**

```typescript
interface LiveSensorCardProps {
  sensorName: string;
  currentValue: number | string;
  unit: string;
  status: "normal" | "warning" | "critical" | "offline";
  description?: string;
  lastUpdate?: Date;
  className?: string;
}
```

**Usage:**

```tsx
import { LiveSensorCard } from "@/components/sensors";

<LiveSensorCard
  sensorName="Living Room Temperature"
  currentValue={22.5}
  unit="°C"
  status="normal"
  description="Main living area"
  lastUpdate={new Date()}
/>;
```

**Status Colors:**

- **Normal**: Green (#10B981)
- **Warning**: Yellow (#F59E0B)
- **Critical**: Red (#EF4444)
- **Offline**: Gray (#6B7280)

**Features:**

- Real-time value updates
- Status badge with color
- Last update timestamp
- Responsive layout
- Hover effects

---

## Room Components

### RoomStatusCard

Display room occupancy, devices, and power consumption.

**Location**: `components/rooms/RoomStatusCard.tsx`

**Props:**

```typescript
interface RoomStatusCardProps {
  roomName: string;
  isOccupied: boolean;
  activeDevices: number;
  totalDevices: number;
  currentPower: number;
  temperature?: number;
  className?: string;
}
```

**Usage:**

```tsx
import { RoomStatusCard } from "@/components/rooms";

<RoomStatusCard
  roomName="Living Room"
  isOccupied={true}
  activeDevices={5}
  totalDevices={8}
  currentPower={850}
  temperature={22}
/>;
```

**Features:**

- Occupancy indicator
- Device count display
- Power consumption
- Optional temperature
- Responsive grid layout

---

## Chart Components

### RealtimeLineChart

Display real-time data as animated line chart.

**Location**: `components/charts/RealtimeLineChart.tsx`

**Props:**

```typescript
interface RealtimeLineChartProps {
  data: Array<{
    timestamp: string;
    value: number;
  }>;
  title?: string;
  color?: string;
  height?: number;
  showGrid?: boolean;
  showTooltip?: boolean;
}
```

**Usage:**

```tsx
import { RealtimeLineChart } from "@/components/charts";

<RealtimeLineChart
  data={powerData}
  title="Power Consumption"
  color="#6366F1"
  height={300}
  showGrid={true}
/>;
```

**Features:**

- Smooth animations
- Responsive sizing
- Customizable colors
- Interactive tooltips
- Grid lines (optional)
- Recharts powered

---

### HistoricalChart

Display historical data with multiple series.

**Location**: `components/history/HistoricalChart.tsx`

**Props:**

```typescript
interface HistoricalChartProps {
  data: HistoricalDataPoint[];
  selectedMetrics: string[];
  chartType?: "line" | "area" | "bar";
}
```

**Usage:**

```tsx
import { HistoricalChart } from "@/components/history";

<HistoricalChart
  data={historicalData}
  selectedMetrics={["power", "temperature"]}
  chartType="area"
/>;
```

---

## Automation Components

### ApplianceControlCard

Control panel for smart home devices.

**Location**: `components/automation/ApplianceControlCard.tsx`

**Props:**

```typescript
interface ApplianceControlCardProps {
  appliance: Appliance;
  onToggle: (id: string) => void;
  onModeChange: (id: string, mode: ControlMode) => void;
  onSettingChange?: (id: string, settings: ApplianceSettings) => void;
}

interface Appliance {
  id: string;
  name: string;
  type: "air_conditioner" | "fan" | "light" | "heater" | "other";
  room: string;
  status: "on" | "off";
  controlMode: "auto" | "manual";
  powerConsumption: number;
  settings?: ApplianceSettings;
  isOnline: boolean;
}
```

**Usage:**

```tsx
import { ApplianceControlCard } from "@/components/automation";

<ApplianceControlCard
  appliance={bedroomAC}
  onToggle={handleToggle}
  onModeChange={handleModeChange}
/>;
```

**Features:**

- On/off toggle
- Auto/manual mode switch
- Device settings control
- Power consumption display
- Online/offline status
- Type-specific controls (temp for AC, speed for fan)

---

### AutomationActivityItem

Display automation activity log entry.

**Location**: `components/automation/AutomationActivityItem.tsx`

**Props:**

```typescript
interface AutomationActivityItemProps {
  title: string;
  description: string;
  timestamp: string;
  status: "success" | "warning" | "error" | "info";
}
```

**Usage:**

```tsx
import { AutomationActivityItem } from "@/components/automation";

<AutomationActivityItem
  title="AC turned off in bedroom"
  description="No occupancy detected for 15 minutes"
  timestamp="2 min ago"
  status="success"
/>;
```

---

## Navigation Components

### Navigation

Main navigation bar with links and user menu.

**Location**: `components/navigation/Navigation.tsx`

**Features:**

- Logo and branding
- Navigation links
- Active link highlighting
- User profile dropdown
- Notification icon
- Weather display
- System status indicator
- Responsive (hamburger menu on mobile)

**Navigation Items:**

```typescript
const navItems = [
  { name: "Dashboard", href: "/", icon: HomeIcon },
  { name: "Live Monitoring", href: "/live-monitoring", icon: ActivityIcon },
  { name: "History", href: "/history", icon: HistoryIcon },
  { name: "Analytics", href: "/analytics", icon: BarChartIcon },
  { name: "Automation", href: "/automation", icon: SettingsIcon },
  { name: "Insights", href: "/insights", icon: LightbulbIcon },
];
```

---

### Sidebar

Collapsible sidebar navigation for desktop.

**Location**: `components/navigation/Sidebar.tsx`

**Props:**

```typescript
interface SidebarProps {
  className?: string;
  navigationItems?: NavigationItem[];
  onNavigate?: (href: string) => void;
  defaultCollapsed?: boolean;
  systemStatus?: SystemStatus;
}
```

**Features:**

- Collapsible/expandable
- Navigation items with icons
- Active route highlighting
- System status at bottom
- Persistent state (localStorage)
- Keyboard accessible

---

### AppShell

Main application layout wrapper.

**Location**: `components/navigation/AppShell.tsx`

**Props:**

```typescript
interface AppShellProps {
  children: React.ReactNode;
}
```

**Usage:**

```tsx
import { AppShell } from "@/components/navigation";

// In app/layout.tsx
export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
```

**Features:**

- Responsive layout
- Sidebar + main content
- Navigation bar
- Footer (optional)
- Data sync provider wrapper

---

## Recommendation Components

### MLRecommendationCard

Display AI-powered recommendations.

**Location**: `components/recommendations/MLRecommendationCard.tsx`

**Props:**

```typescript
interface MLRecommendationCardProps {
  title: string;
  description: string;
  estimatedSavings: number;
  difficulty: "easy" | "medium" | "hard";
  category: "cost" | "comfort" | "efficiency";
  onApply?: () => void;
}
```

**Usage:**

```tsx
import { MLRecommendationCard } from "@/components/recommendations";

<MLRecommendationCard
  title="Adjust AC schedule"
  description="Set temperature to 24°C during sleep hours"
  estimatedSavings={45}
  difficulty="easy"
  category="cost"
  onApply={handleApply}
/>;
```

---

## Provider Components

### DataSyncProvider

Handles automatic Firebase to PostgreSQL synchronization.

**Location**: `components/providers/DataSyncProvider.tsx`

**Props:**

```typescript
interface DataSyncProviderProps {
  children: React.ReactNode;
}
```

**Usage:**

```tsx
import { DataSyncProvider } from "@/components/providers";

// Wrap app in layout
<DataSyncProvider>{children}</DataSyncProvider>;
```

**Features:**

- Auto-sync every 60 seconds
- Prevents concurrent syncs
- Logs sync status to console
- Initial sync after 5 seconds
- Cleanup on unmount

**Configuration:**

```typescript
// Adjust sync interval
const SYNC_INTERVAL = 60 * 1000; // 1 minute
```

---

## Styling Guidelines

All components use Tailwind CSS with consistent design tokens:

### Colors

```css
Primary: #6366F1 (Indigo)
Success: #10B981 (Green)
Warning: #F59E0B (Amber)
Error: #EF4444 (Red)
Gray: #6B7280
Background: #F8FAFC
Text: #111827
```

### Spacing

```css
Gap: 4, 6, 8 (1rem, 1.5rem, 2rem)
Padding: 4, 6, 8
Margin: 4, 6, 8
```

### Typography

```css
Headings: font-bold
Body: font-normal
Small: text-sm
Base: text-base
Large: text-lg
XL: text-xl
```

### Borders

```css
Border: border border-gray-200
Rounded: rounded-lg (0.5rem)
Shadow: shadow-sm
```

---

## Component Patterns

### Loading States

```tsx
export function MyComponent() {
  const [loading, setLoading] = useState(true);

  if (loading) {
    return <div>Loading...</div>;
  }

  return <div>Content</div>;
}
```

### Error Handling

```tsx
export function MyComponent() {
  const [error, setError] = useState<string | null>(null);

  if (error) {
    return <div className="text-red-600">{error}</div>;
  }

  return <div>Content</div>;
}
```

### Empty States

```tsx
if (items.length === 0) {
  return (
    <div className="text-center py-12">
      <p className="text-gray-500">No items found</p>
    </div>
  );
}
```

---

## Accessibility

All components follow WCAG 2.1 Level AA guidelines:

- **Semantic HTML**: Use proper heading hierarchy
- **ARIA labels**: Add aria-label for icons and buttons
- **Keyboard navigation**: All interactive elements accessible via keyboard
- **Focus indicators**: Visible focus states
- **Color contrast**: Minimum 4.5:1 ratio for text
- **Screen reader support**: Descriptive labels

Example:

```tsx
<button
  onClick={handleClick}
  aria-label="Toggle automation"
  className="focus:ring-2 focus:ring-blue-500"
>
  <ToggleIcon />
</button>
```

---

## Creating New Components

### Component Template

```tsx
// components/my-component/MyComponent.tsx
interface MyComponentProps {
  // Required props
  title: string;
  value: number;
  // Optional props
  className?: string;
  onAction?: () => void;
}

export function MyComponent({
  title,
  value,
  className = "",
  onAction,
}: MyComponentProps) {
  return (
    <div className={`p-4 bg-white rounded-lg border ${className}`}>
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="text-2xl">{value}</p>
      {onAction && <button onClick={onAction}>Action</button>}
    </div>
  );
}
```

```typescript
// components/my-component/index.ts
export { MyComponent } from "./MyComponent";
export type { MyComponentProps } from "./MyComponent";
```

---

## Component Library Best Practices

1. **Single Responsibility**: Each component does one thing well
2. **Composability**: Components can be nested and combined
3. **Prop Types**: Always define TypeScript interfaces
4. **Default Props**: Provide sensible defaults
5. **Documentation**: Add JSDoc comments
6. **Examples**: Include usage examples
7. **Testing**: Components should be testable
8. **Accessibility**: Follow WCAG guidelines
9. **Performance**: Use React.memo for expensive components
10. **Styling**: Use Tailwind CSS classes consistently
