# History Page Setup Guide

## Quick Start

The History & Comparison page is now fully implemented and ready to use!

## What's Been Created

### 1. Types (`types/history.ts`)

- `HistoricalDataPoint` - Data structure for historical records
- `DateRange` - Date range selection type
- `RoomOption` - Room filter option
- `ExportDataRow` - CSV export format
- `TableSortConfig` - Table sorting configuration

### 2. Components (`components/history/`)

- `DateRangePicker` - Date range selection with presets
- `RoomSelector` - Multi-select room filter dropdown
- `HistoricalChart` - Recharts-based visualization component
- `DataTable` - Sortable table with CSV export
- `index.ts` - Export barrel file

### 3. API Functions (`lib/api.ts`)

- `fetchHistoricalData()` - Fetch data from backend API
- `fetchRooms()` - Fetch available rooms
- `generateMockHistoricalData()` - Development mock data
- `generateMockRooms()` - Development mock rooms

### 4. Page (`app/history/page.tsx`)

Complete history page with all features integrated.

### 5. Documentation

- `app/history/README.md` - Comprehensive documentation

## Current State

✅ **Working Features:**

- Date range picker with presets (Today, Yesterday, Last 7 Days, etc.)
- Custom date range selection
- Multi-room selection filter
- Three chart types (Line, Area, Bar)
- Four metrics (Energy, Power, Temperature, Humidity)
- Room comparison mode
- Sortable data table
- Pagination (50 records per page)
- CSV export
- Mock data for development
- Responsive design
- Full accessibility support
- Error handling

## Testing the Page

1. **Navigate to the page:**

   ```
   http://localhost:3000/history
   ```

2. **Try the features:**
   - Select different date ranges
   - Toggle room selections
   - Switch between chart types
   - Change metrics
   - Enable room comparison (select 2+ rooms)
   - Sort table columns
   - Export to CSV
   - Test pagination

## Backend Integration

### Step 1: Update API Base URL

Edit `lib/constants.ts`:

```typescript
export const API_CONFIG = {
  baseUrl: "https://your-backend-api.com/api", // Update this
  // ...
};
```

### Step 2: Backend API Requirements

Your backend needs to implement these endpoints:

#### GET /api/history/energy

**Query Parameters:**

- `start` (ISO date string) - Start date
- `end` (ISO date string) - End date
- `rooms` (optional, comma-separated) - Room IDs to filter

**Response:**

```json
{
  "success": true,
  "data": [
    {
      "timestamp": "2025-12-24T10:00:00Z",
      "roomId": "living-room",
      "roomName": "Living Room",
      "power": 450.5,
      "energy": 0.45,
      "temperature": 22.5,
      "humidity": 45
    }
  ],
  "count": 1,
  "dateRange": {
    "start": "2025-12-24T00:00:00Z",
    "end": "2025-12-24T23:59:59Z"
  }
}
```

#### GET /api/rooms

**Response:**

```json
{
  "success": true,
  "data": [
    {
      "id": "living-room",
      "name": "Living Room",
      "type": "Common Area"
    }
  ]
}
```

### Step 3: Remove Mock Data

Once your backend is ready, remove the mock data fallback in `app/history/page.tsx`:

**Current (with mock data):**

```typescript
try {
  data = await fetchHistoricalData(
    dateRange.start,
    dateRange.end,
    selectedRoomIds
  );
} catch (apiError) {
  console.warn("API not available, using mock data");
  data = generateMockHistoricalData(
    dateRange.start,
    dateRange.end,
    selectedRooms
  );
}
```

**Production (no mock data):**

```typescript
data = await fetchHistoricalData(
  dateRange.start,
  dateRange.end,
  selectedRoomIds
);
```

## Navigation Integration

Add the history page to your navigation component:

```tsx
// In your navigation component
const navItems = [
  // ... other items
  {
    name: "History",
    href: "/history",
    icon: HistoryIcon, // Your icon component
  },
];
```

## Dependencies

Make sure these packages are installed:

```bash
npm install recharts
```

Already in your project (verify in package.json):

- react
- next
- typescript
- tailwindcss

## Customization

### Adjust Items Per Page

In `components/history/DataTable.tsx`:

```typescript
const itemsPerPage = 50; // Change this value
```

### Adjust Chart Height

In `app/history/page.tsx`:

```typescript
<HistoricalChart
  // ...
  height={400} // Change this value
/>
```

### Add More Date Presets

In `components/history/DateRangePicker.tsx`, add to `DATE_PRESETS` array:

```typescript
{
  label: "Last 90 Days",
  getValue: () => {
    const end = new Date();
    const start = new Date();
    start.setDate(start.getDate() - 90);
    return { start, end, label: "Last 90 Days" };
  },
}
```

### Customize Colors

Room colors are defined in `components/history/HistoricalChart.tsx`:

```typescript
const ROOM_COLORS = [
  "#6366F1", // Change these
  "#16A34A",
  // ... add more
];
```

## Troubleshooting

### Issue: "No data available"

**Solution:** Check that:

1. Date range is selected
2. At least one room is selected
3. Backend API is returning data
4. Data format matches `HistoricalDataPoint` type

### Issue: Chart not rendering

**Solution:**

1. Verify recharts is installed: `npm list recharts`
2. Check browser console for errors
3. Ensure data array is not empty

### Issue: CSV export not working

**Solution:**

1. Check browser allows downloads
2. Verify data is populated
3. Check browser console for errors

## Performance Tips

1. **Limit Date Range:** Large date ranges can slow down rendering
2. **Pagination:** Already implemented to handle large datasets
3. **Room Selection:** Limit to 5-6 rooms for comparison mode
4. **API Caching:** Consider implementing caching on the backend

## Security Considerations

1. **API Authentication:** Add authentication headers in `lib/api.ts`
2. **Rate Limiting:** Implement on backend to prevent abuse
3. **Data Validation:** Validate date ranges before API calls
4. **CORS:** Ensure backend allows requests from your domain

## Next Steps

1. ✅ Test the page with mock data
2. ⏳ Connect to your backend API
3. ⏳ Remove mock data fallbacks
4. ⏳ Add to navigation
5. ⏳ Deploy and test in production

## Support

For issues or questions, refer to:

- Main documentation: `app/history/README.md`
- Component-specific docs in component files
- Design system: `master-prompt.txt`

## Files Modified/Created

```
New Files:
- types/history.ts
- components/history/DateRangePicker.tsx
- components/history/RoomSelector.tsx
- components/history/HistoricalChart.tsx
- components/history/DataTable.tsx
- components/history/index.ts
- app/history/README.md
- app/history/SETUP.md

Modified Files:
- lib/api.ts (added history API functions)
- app/history/page.tsx (complete rewrite)
```

---

**Status:** ✅ Ready for testing with mock data  
**Next Action:** Test the page, then connect to backend API
