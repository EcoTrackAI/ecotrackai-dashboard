# LiveSensorCard Component

A production-ready, reusable React component for displaying real-time IoT sensor data with status indicators.

## Features

- 🎯 **Real-time data display** - Optimized for frequent updates
- 🚦 **Status indicators** - Visual feedback with color-coded badges
- ⏱️ **Smart timestamps** - Relative time display (e.g., "2m ago", "Just now")
- ♿ **Accessible** - ARIA labels, keyboard navigation, semantic HTML
- 📱 **Responsive** - Mobile-first design, works on all screen sizes
- 🎨 **Customizable** - Flexible props and optional click handlers
- 🔒 **Type-safe** - Full TypeScript support with strict typing

## Installation

The component is located in the `components/sensors` directory. Import it:

```tsx
import { LiveSensorCard, SensorStatus } from '@/components/sensors';
```

## Props

### LiveSensorCardProps

| Prop           | Type               | Required | Description                                  |
| -------------- | ------------------ | -------- | -------------------------------------------- |
| `sensorName`   | `string`           | ✅       | Display name of the sensor                   |
| `currentValue` | `number \| string` | ✅       | Current sensor reading                       |
| `unit`         | `string`           | ✅       | Unit of measurement (e.g., 'kWh', '°C', '%') |
| `status`       | `SensorStatus`     | ✅       | Current operational status                   |
| `description`  | `string`           | ❌       | Additional context or location               |
| `lastUpdate`   | `Date \| string`   | ❌       | Timestamp of last update                     |
| `onClick`      | `() => void`       | ❌       | Click handler for interactive cards          |
| `className`    | `string`           | ❌       | Custom CSS classes                           |

### SensorStatus Type

```typescript
type SensorStatus = "normal" | "warning" | "critical" | "offline";
```

- **normal**: Operating within acceptable range (green indicator)
- **warning**: Approaching threshold, attention recommended (orange indicator)
- **critical**: Exceeds threshold, immediate attention required (red indicator with pulse)
- **offline**: No connection or data available (gray indicator)

## Basic Usage

### Simple Sensor Card

```tsx
<LiveSensorCard
  sensorName="Living Room Temperature"
  currentValue={22.5}
  unit="°C"
  status="normal"
/>
```

### With Description and Timestamp

```tsx
<LiveSensorCard
  sensorName="Power Consumption"
  currentValue={3.45}
  unit="kW"
  status="warning"
  description="Whole house"
  lastUpdate={new Date()}
/>
```

### Interactive Card with Click Handler

```tsx
<LiveSensorCard
  sensorName="Humidity Sensor"
  currentValue={68}
  unit="%"
  status="normal"
  onClick={() => navigate("/sensors/humidity-01")}
/>
```

### Offline Sensor

```tsx
<LiveSensorCard
  sensorName="Outdoor Temperature"
  currentValue="--"
  unit="°C"
  status="offline"
  lastUpdate={new Date(Date.now() - 3600000)}
/>
```

## Real-time Integration

### Firebase Realtime Database

```tsx
import { useEffect, useState } from "react";
import { ref, onValue } from "firebase/database";
import { database } from "@/lib/firebase";
import { LiveSensorCard, SensorStatus } from '@/components/sensors';

export function TemperatureSensor() {
  const [temperature, setTemperature] = useState<number>(0);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());
  const [status, setStatus] = useState<SensorStatus>("normal");

  useEffect(() => {
    const sensorRef = ref(database, "sensors/temperature/living-room");

    const unsubscribe = onValue(sensorRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setTemperature(data.value);
        setLastUpdate(new Date(data.timestamp));

        // Determine status based on value
        if (data.value > 28) setStatus("critical");
        else if (data.value > 26) setStatus("warning");
        else setStatus("normal");
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <LiveSensorCard
      sensorName="Living Room Temperature"
      currentValue={temperature}
      unit="°C"
      status={status}
      lastUpdate={lastUpdate}
    />
  );
}
```

### REST API Integration

```tsx
import { useEffect, useState } from "react";
import { LiveSensorCard, SensorStatus } from '@/components/sensors';

interface SensorData {
  value: number;
  timestamp: string;
  status: SensorStatus;
}

export function PowerSensor() {
  const [data, setData] = useState<SensorData | null>(null);

  useEffect(() => {
    // Poll API every 5 seconds
    const fetchData = async () => {
      try {
        const response = await fetch("/api/sensors/power");
        const sensorData = await response.json();
        setData(sensorData);
      } catch (error) {
        console.error("Failed to fetch sensor data:", error);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 5000);

    return () => clearInterval(interval);
  }, []);

  if (!data) return <div>Loading...</div>;

  return (
    <LiveSensorCard
      sensorName="Power Consumption"
      currentValue={data.value}
      unit="kW"
      status={data.status}
      lastUpdate={data.timestamp}
    />
  );
}
```

## Layout Examples

### Grid Layout

```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
  <LiveSensorCard {...sensor1Props} />
  <LiveSensorCard {...sensor2Props} />
  <LiveSensorCard {...sensor3Props} />
  <LiveSensorCard {...sensor4Props} />
</div>
```

### Flex Layout

```tsx
<div className="flex flex-wrap gap-4">
  <div className="flex-1 min-w-70">
    <LiveSensorCard {...temperatureProps} />
  </div>
  <div className="flex-1 min-w-70">
    <LiveSensorCard {...humidityProps} />
  </div>
</div>
```

## Styling and Customization

### Custom Styling

```tsx
<LiveSensorCard {...props} className="shadow-lg ring-2 ring-indigo-200" />
```

### Conditional Styling

```tsx
<LiveSensorCard
  {...props}
  className={`
    ${isSelected ? "ring-2 ring-indigo-500" : ""}
    ${isHighlighted ? "bg-indigo-50" : ""}
  `}
/>
```

## Status Logic Examples

### Temperature Thresholds

```typescript
const getTemperatureStatus = (temp: number): SensorStatus => {
  if (temp > 30) return "critical";
  if (temp > 26) return "warning";
  if (temp < 15) return "warning";
  return "normal";
};
```

### Power Consumption Thresholds

```typescript
const getPowerStatus = (power: number, baseline: number): SensorStatus => {
  const ratio = power / baseline;
  if (ratio > 1.5) return "critical";
  if (ratio > 1.2) return "warning";
  return "normal";
};
```

### Connection-based Status

```typescript
const getConnectionStatus = (lastSeen: Date): SensorStatus => {
  const minutesSinceUpdate = (Date.now() - lastSeen.getTime()) / 60000;
  if (minutesSinceUpdate > 5) return "offline";
  if (minutesSinceUpdate > 2) return "warning";
  return "normal";
};
```

## Accessibility

The component includes comprehensive accessibility features:

- **ARIA labels**: Descriptive labels for screen readers
- **Keyboard navigation**: Full keyboard support when interactive
- **Semantic HTML**: Proper use of article, heading, and time elements
- **Color contrast**: WCAG AA compliant color combinations
- **Focus indicators**: Clear visual focus states
- **Role attributes**: Appropriate roles based on interactivity

## Performance Considerations

### Memoization

For large lists of sensors, use memoization:

```tsx
import { memo } from "react";

const MemoizedSensorCard = memo(LiveSensorCard, (prev, next) => {
  return (
    prev.currentValue === next.currentValue &&
    prev.status === next.status &&
    prev.lastUpdate === next.lastUpdate
  );
});
```

### Virtualization

For 50+ sensors, consider virtualization:

```tsx
import { FixedSizeGrid } from "react-window";

<FixedSizeGrid
  columnCount={4}
  columnWidth={300}
  height={800}
  rowCount={Math.ceil(sensors.length / 4)}
  rowHeight={150}
  width={1200}
>
  {({ columnIndex, rowIndex, style }) => {
    const index = rowIndex * 4 + columnIndex;
    const sensor = sensors[index];
    return sensor ? (
      <div style={style}>
        <LiveSensorCard {...sensor} />
      </div>
    ) : null;
  }}
</FixedSizeGrid>;
```

## Design System Compliance

The component adheres to the project's design system:

- **Colors**: Uses specified palette (#6366F1, #16A34A, #FB923C, #DC2626)
- **Typography**: Clear hierarchy with proper font weights
- **Spacing**: Consistent padding and margins using Tailwind scale
- **Borders**: Subtle borders without heavy shadows
- **Transitions**: Smooth 200ms transitions for interactive states

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers (iOS Safari, Chrome Mobile)

## Related Components

- `MetricCard` - For static metric displays
- `RoomStatusCard` - For room-level aggregations
- `AutomationActivityItem` - For automation event tracking

## Changelog

### v1.0.0 (2025-12-24)

- Initial release
- Real-time data display
- Status indicators with four states
- Accessibility features
- TypeScript support
- Responsive design
