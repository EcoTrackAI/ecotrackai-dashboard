# RealtimeLineChart Component

A reusable, production-ready line chart component designed for real-time IoT sensor data visualization in the EcoTrackAI dashboard.

## Features

- ✅ Real-time data visualization with smooth animations
- ✅ Fully typed with TypeScript
- ✅ Responsive and mobile-friendly
- ✅ Customizable colors, units, and styling
- ✅ Accessible and follows design system guidelines
- ✅ Clean, minimalist design
- ✅ Custom tooltip with formatted values

## Installation

The component uses Recharts:

```bash
npm install recharts @types/recharts
```

## Usage

### Basic Example

```tsx
import { RealtimeLineChart } from "@/components/charts";

const data = [
  { timestamp: "10:00", power: 450 },
  { timestamp: "10:01", power: 470 },
  { timestamp: "10:02", power: 430 },
  { timestamp: "10:03", power: 490 },
  { timestamp: "10:04", power: 510 },
];

function MyComponent() {
  return (
    <RealtimeLineChart
      data={data}
      dataKey="power"
      color="#16A34A"
      unit="W"
      title="Real-time Power Consumption"
    />
  );
}
```

### Temperature Monitoring

```tsx
<RealtimeLineChart
  data={temperatureData}
  dataKey="temperature"
  color="#FB923C"
  unit="°C"
  title="Room Temperature"
  height={250}
/>
```

### Energy Usage Over Time

```tsx
<RealtimeLineChart
  data={energyData}
  dataKey="consumption"
  color="#6366F1"
  unit="kWh"
  title="Energy Consumption"
  showGrid={true}
  animate={true}
/>
```

## Props

| Prop       | Type                    | Default       | Description                          |
| ---------- | ----------------------- | ------------- | ------------------------------------ |
| `data`     | `Record<string, any>[]` | **Required**  | Array of data points to visualize    |
| `dataKey`  | `string`                | **Required**  | Key in data object for Y-axis values |
| `color`    | `string`                | `#6366F1`     | Line color (hex code)                |
| `unit`     | `string`                | `''`          | Unit label (e.g., 'W', 'kWh', '°C')  |
| `height`   | `number`                | `300`         | Chart height in pixels               |
| `title`    | `string`                | `undefined`   | Optional chart title                 |
| `xAxisKey` | `string`                | `'timestamp'` | Key for X-axis values                |
| `showGrid` | `boolean`               | `true`        | Show/hide grid lines                 |
| `animate`  | `boolean`               | `true`        | Enable/disable animations            |

## Data Format

The component expects data in the following format:

```typescript
interface DataPoint {
  timestamp: string; // or your xAxisKey
  [dataKey: string]: number | string;
}
```

Example:

```typescript
[
  { timestamp: "10:00", power: 450, voltage: 230 },
  { timestamp: "10:01", power: 470, voltage: 232 },
  // ...
];
```

## Color Guidelines

Use semantic colors from the design system:

- **Primary/Default**: `#6366F1` (Indigo)
- **Success/Savings**: `#16A34A` (Green)
- **Warning/High Usage**: `#FB923C` (Orange)
- **Error/Critical**: `#DC2626` (Red)

## Integration with Live Data

### With Firebase Realtime Database

```tsx
"use client";

import { useState, useEffect } from "react";
import { ref, onValue } from "firebase/database";
import { database } from "@/lib/firebase";
import { RealtimeLineChart } from "@/components/charts";

export default function LiveMonitoring() {
  const [data, setData] = useState([]);

  useEffect(() => {
    const sensorRef = ref(database, "sensors/power");

    const unsubscribe = onValue(sensorRef, (snapshot) => {
      const value = snapshot.val();
      const timestamp = new Date().toLocaleTimeString();

      setData((prev) => [
        ...prev.slice(-50), // Keep last 50 points
        { timestamp, power: value },
      ]);
    });

    return () => unsubscribe();
  }, []);

  return (
    <RealtimeLineChart
      data={data}
      dataKey="power"
      color="#16A34A"
      unit="W"
      title="Live Power Consumption"
    />
  );
}
```

### With API Polling

```tsx
"use client";

import { useState, useEffect } from "react";
import { RealtimeLineChart } from "@/components/charts";

export default function EnergyChart() {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch("/api/energy/current");
      const newPoint = await response.json();

      setData((prev) => [
        ...prev.slice(-100),
        {
          timestamp: new Date(newPoint.timestamp).toLocaleTimeString(),
          consumption: newPoint.value,
        },
      ]);
    };

    const interval = setInterval(fetchData, 5000); // Poll every 5s
    fetchData(); // Initial fetch

    return () => clearInterval(interval);
  }, []);

  return (
    <RealtimeLineChart
      data={data}
      dataKey="consumption"
      color="#6366F1"
      unit="kWh"
      title="Energy Consumption"
    />
  );
}
```

## Accessibility

The component follows accessibility best practices:

- Semantic color usage with sufficient contrast
- Readable font sizes (12px minimum)
- Clear visual hierarchy
- Responsive design for all screen sizes

## Performance

- Efficient re-rendering with React
- Smooth animations (300ms duration)
- Optimized for real-time updates
- Recommends limiting data points to 50-100 for best performance

## Styling

The component uses Tailwind CSS and follows the EcoTrackAI design system:

- Clean, minimalist aesthetic
- Light background (`#F8FAFC`)
- White card backgrounds
- Subtle borders and shadows
- Professional, academic look

## Browser Support

Works on all modern browsers supporting ES6+ and SVG rendering.
