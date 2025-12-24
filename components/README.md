# Components Organization

All components are organized into logical folders for better maintainability and scalability.

## Folder Structure

```
components/
├── automation/          # Automation and activity components
│   ├── AutomationActivityItem.tsx
│   └── index.ts
├── metrics/             # Metric and statistics components
│   ├── MetricCard.tsx
│   ├── MetricCard.README.md
│   ├── MetricCardExamples.tsx
│   └── index.ts
├── navigation/          # Navigation and UI shell components
│   ├── Navigation.tsx
│   ├── Sidebar.tsx
│   ├── NotificationIcon.tsx
│   ├── SystemStatusIndicator.tsx
│   ├── UserProfileDropdown.tsx
│   ├── WeatherSummary.tsx
│   └── index.ts
├── rooms/               # Room status and monitoring components
│   ├── RoomStatusCard.tsx
│   └── index.ts
└── sensors/             # Sensor and live data components
    ├── LiveSensorCard.tsx
    ├── LiveSensorCard.README.md
    ├── LiveSensorCardExamples.tsx
    └── index.ts
```

## Import Paths

All components can be imported using their folder paths:

```tsx
// Metrics
import { MetricCard } from '@/components/metrics';

// Sensors
import { LiveSensorCard, SensorStatus } from '@/components/sensors';

// Rooms
import { RoomStatusCard } from '@/components/rooms';

// Automation
import { AutomationActivityItem } from '@/components/automation';

// Navigation
import { Navigation, Sidebar } from '@/components/navigation';
```

## Component Categories

### 📊 Metrics
Components for displaying numerical metrics, statistics, and KPIs.
- `MetricCard` - Display energy metrics with trends and icons

### 🎛️ Sensors
Real-time sensor monitoring and data visualization components.
- `LiveSensorCard` - Display live sensor readings with status indicators

### 🏠 Rooms
Room-level monitoring and status display components.
- `RoomStatusCard` - Show room occupancy, devices, and power usage

### ⚡ Automation
Automation activity and event tracking components.
- `AutomationActivityItem` - Display automation events and notifications

### 🧭 Navigation
Navigation, layout, and UI shell components.
- `Navigation` - Main navigation bar
- `Sidebar` - Collapsible sidebar navigation
- System status and user profile components

## Adding New Components

When adding a new component:

1. **Determine the category** - Choose the most appropriate folder
2. **Create the component** - Add the `.tsx` file in that folder
3. **Export from index** - Update the folder's `index.ts` file
4. **Add documentation** - Create a README if it's a complex component
5. **Add examples** - Create an examples file if needed

Example of updating `index.ts`:

```tsx
// components/sensors/index.ts
export { LiveSensorCard } from './LiveSensorCard';
export { NewSensorComponent } from './NewSensorComponent';
export type { LiveSensorCardProps, SensorStatus } from './LiveSensorCard';
```

## Benefits

✅ **Better organization** - Components are grouped by functionality  
✅ **Easier to find** - Logical folder structure  
✅ **Scalable** - Easy to add new components  
✅ **Clean imports** - Shorter, more readable import statements  
✅ **Encapsulation** - Each category has its own namespace  
