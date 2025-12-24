# History & Comparison Page

## Overview

The History & Comparison page provides comprehensive historical energy consumption data analysis with advanced filtering, visualization, and export capabilities.

## Features

### 1. Date Range Selection

- **Quick Presets**: Today, Yesterday, Last 7 Days, Last 30 Days, This Month, Last Month
- **Custom Range**: Select any custom date range
- **Visual Feedback**: Clear display of selected date range

### 2. Room Filtering

- **Multi-Select**: Filter data by one or multiple rooms
- **Select All**: Quick toggle to select/deselect all rooms
- **Room Details**: Display room name and type
- **Visual Checkboxes**: Clear indication of selected rooms

### 3. Data Visualization

- **Chart Types**:
  - Line chart for trends
  - Area chart for cumulative view
  - Bar chart for comparisons
- **Metrics**:
  - Energy consumption (kWh)
  - Power usage (W)
  - Temperature (°C)
  - Humidity (%)
- **Room Comparison**: Compare multiple rooms side-by-side
- **Interactive Tooltips**: Hover to see detailed values

### 4. Data Table

- **Sortable Columns**: Click column headers to sort
- **Pagination**: Navigate through large datasets (50 records per page)
- **Responsive Design**: Works on mobile and desktop
- **CSV Export**: Download data for external analysis

### 5. Error Handling

- Graceful fallback to mock data when API is unavailable
- User-friendly error messages
- Loading states for better UX

## Components

### DateRangePicker

**Location**: `components/history/DateRangePicker.tsx`

Allows users to select date ranges with preset options or custom dates.

**Props**:

- `value`: Currently selected date range
- `onChange`: Callback when selection changes
- `className`: Optional CSS classes

### RoomSelector

**Location**: `components/history/RoomSelector.tsx`

Multi-select dropdown for filtering by room(s).

**Props**:

- `rooms`: Array of available rooms
- `selectedRoomIds`: Currently selected room IDs
- `onChange`: Callback when selection changes
- `multiple`: Enable multi-selection (default: true)
- `isLoading`: Loading state
- `className`: Optional CSS classes

### HistoricalChart

**Location**: `components/history/HistoricalChart.tsx`

Recharts-based visualization component.

**Props**:

- `data`: Historical data points
- `chartType`: 'line' | 'area' | 'bar'
- `metric`: 'power' | 'energy' | 'temperature' | 'humidity'
- `title`: Chart title
- `height`: Chart height in pixels (default: 400)
- `compareRooms`: Enable room comparison
- `className`: Optional CSS classes

### DataTable

**Location**: `components/history/DataTable.tsx`

Sortable, paginated table with CSV export.

**Props**:

- `data`: Historical data points
- `showExport`: Show export button (default: true)
- `isLoading`: Loading state
- `className`: Optional CSS classes

## API Integration

### Endpoints

#### Fetch Historical Data

```typescript
GET /api/history/energy?start={ISO_DATE}&end={ISO_DATE}&rooms={ROOM_IDS}
```

**Response**:

```typescript
{
  success: boolean;
  data: HistoricalDataPoint[];
  count: number;
  dateRange: {
    start: string;
    end: string;
  };
}
```

#### Fetch Available Rooms

```typescript
GET / api / rooms;
```

**Response**:

```typescript
{
  success: boolean;
  data: RoomOption[];
}
```

### Mock Data

The implementation includes mock data generators for development:

- `generateMockHistoricalData()`: Generates realistic historical data
- `generateMockRooms()`: Generates sample room list

Remove these when connecting to your backend API.

## Usage Example

```tsx
import { HistoryPage } from "@/app/history/page";

// The page is self-contained and manages its own state
<HistoryPage />;
```

## Types

### HistoricalDataPoint

```typescript
interface HistoricalDataPoint {
  timestamp: string;
  roomId: string;
  roomName: string;
  power: number; // in watts
  energy: number; // in kWh
  temperature?: number;
  humidity?: number;
}
```

### DateRange

```typescript
interface DateRange {
  start: Date;
  end: Date;
  label?: string;
}
```

### RoomOption

```typescript
interface RoomOption {
  id: string;
  name: string;
  type: string;
}
```

## Styling

The page follows the design system with:

- Clean, minimalist layouts
- Proper spacing and typography
- Accessible color contrasts
- Consistent use of the color palette
- Responsive grid layouts

### Color Usage

- **Primary (#6366F1)**: Buttons, active states, chart lines
- **Green (#16A34A)**: Success states, energy savings
- **Orange (#FB923C)**: Warnings
- **Red (#DC2626)**: Errors, critical states
- **Gray shades**: Text, borders, backgrounds

## Accessibility

- **ARIA Labels**: All interactive elements have descriptive labels
- **Keyboard Navigation**: Full keyboard support
- **Focus Indicators**: Clear focus states
- **Screen Readers**: Proper semantic HTML and ARIA attributes
- **Color Contrast**: WCAG AA compliant

## Performance Considerations

- **Pagination**: Limits rendered table rows
- **Memoization**: useMemo for expensive computations
- **Efficient Rendering**: Minimal re-renders
- **Data Aggregation**: Smart data grouping for charts

## Future Enhancements

1. **Advanced Filters**: Filter by energy threshold, temperature range
2. **Comparisons**: Compare different time periods
3. **Predictions**: ML-based forecasting
4. **Saved Views**: Save and load filter configurations
5. **Scheduled Reports**: Automated email reports
6. **Data Aggregation**: Daily, weekly, monthly summaries

## Backend Integration

Replace the mock data functions in `lib/api.ts` with real API calls:

```typescript
export async function fetchHistoricalData(
  startDate: Date,
  endDate: Date,
  roomIds?: string[]
): Promise<HistoricalDataPoint[]> {
  const params = new URLSearchParams({
    start: startDate.toISOString(),
    end: endDate.toISOString(),
  });

  if (roomIds && roomIds.length > 0) {
    params.append("rooms", roomIds.join(","));
  }

  const response = await fetch(
    `${API_CONFIG.baseUrl}/history/energy?${params.toString()}`
  );

  const result = await response.json();
  return result.data;
}
```

## Testing

To test the page:

1. **Mock Data Mode**: The page works out-of-the-box with mock data
2. **Select Date Range**: Try different presets and custom ranges
3. **Select Rooms**: Test single and multiple room selection
4. **Chart Options**: Switch between chart types and metrics
5. **Room Comparison**: Enable comparison with 2+ rooms selected
6. **Export CSV**: Download and verify exported data
7. **Sorting**: Click table headers to sort
8. **Pagination**: Navigate through multiple pages

## Dependencies

- React 18+
- Next.js 14+ (App Router)
- TypeScript
- Tailwind CSS
- Recharts (for charts)

## License

Part of the EcoTrack AI Dashboard project.
