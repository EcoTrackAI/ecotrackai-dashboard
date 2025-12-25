# Energy Analytics Page

A comprehensive analytics dashboard for visualizing energy consumption data, appliance usage patterns, and automation efficiency.

## Features

### 📊 Three Interactive Charts

1. **Power Usage Over Time** (Line Chart)

   - Displays real-time power consumption in watts
   - Shows consumption patterns throughout the day
   - Interactive tooltips with precise values

2. **Energy per Appliance** (Bar Chart)

   - Monthly energy consumption breakdown by device
   - Identifies top energy consumers
   - Easy comparison between appliances

3. **Automation Impact** (Comparison Bar Chart)
   - Before vs after automation comparison
   - Displays monthly energy savings
   - Calculates total savings automatically

### 📈 Summary Metrics

- **Peak Power Usage**: Highlights maximum power consumption
- **Top Consumer**: Identifies the appliance using most energy
- **Automation Efficiency**: Shows percentage savings from automation

## Tech Stack

- **Recharts**: Production-ready charting library
- **React Hooks**: useState and useEffect for data management
- **TypeScript**: Strong typing for all data structures
- **Tailwind CSS**: Responsive styling with design system colors

## API Integration

### Endpoints Configuration

The page fetches data from three REST API endpoints (configured in `lib/constants.ts`):

```typescript
/analytics/eoprw -
  usage / // Power consumption over time
    analytics /
    appliance -
  energy / // Energy per appliance
    analytics /
    automation -
  comparison; // Before/after automation data
```

### Expected API Response Format

All endpoints should return:

```typescript
{
  success: boolean;
  data: T[]; // Array of data points
  timestamp?: string;
  error?: string;
}
```

### Data Type Specifications

#### Power Usage Data

```typescript
{
  timestamp: string; // e.g., "00:00", "12:30"
  power: number; // in watts
}
```

#### Appliance Energy Data

```typescript
{
  appliance: string; // e.g., "HVAC", "Water Heater"
  energy: number; // in kWh
}
```

#### Automation Comparison Data

```typescript
{
  month: string; // e.g., "Jan", "Feb"
  before: number; // energy before automation (kWh)
  after: number; // energy after automation (kWh)
}
```

## Error Handling

- **Graceful Fallback**: Uses mock data if API fails
- **User Feedback**: Displays error messages in user-friendly format
- **Loading States**: Shows skeleton loaders during data fetch
- **Type Safety**: All error cases are properly typed

## Accessibility Features

- Semantic HTML structure
- ARIA labels on interactive elements
- Keyboard navigation support
- High contrast color palette
- Responsive tooltips

## Design System Compliance

### Colors Used

- Primary: `#6366F1` (Indigo) - Charts, primary data
- Secondary: `#16A34A` (Green) - Success, savings
- Warning: `#FB923C` (Orange) - Before automation, alerts
- Text: `#111827` / `#6B7280` - Primary and muted text
- Background: `#F8FAFC` - Page background
- Card: `#FFFFFF` - Card backgrounds

### Typography

- Headers: Bold, clear hierarchy
- Body text: 14px, readable line height
- Muted text: Smaller, gray for secondary info

### Layout

- Responsive grid system
- Mobile-first design
- Proper spacing and padding
- Clean card-based UI

## Component Architecture

```
AnalyticsPage/
├── PowerUsageChart          # Line chart component
├── ApplianceEnergyChart     # Bar chart component
├── AutomationComparisonChart # Comparison bar chart
├── ChartSkeleton            # Loading state component
├── ErrorDisplay             # Error message component
└── CustomTooltip            # Reusable tooltip for charts
```

## Usage Example

```typescript
// The page is a client component that automatically:
// 1. Fetches data from configured API endpoints
// 2. Displays loading skeletons during fetch
// 3. Renders charts with fetched data
// 4. Falls back to mock data on error
// 5. Shows summary metrics

// To use, simply navigate to /analytics
```

## Configuration

### Environment Variables

Set the API base URL in your `.env.local`:

```bash
NEXT_PUBLIC_API_BASE_URL=http://your-api-url.com/api
```

### Customizing Endpoints

Update `lib/constants.ts` to modify API endpoints:

```typescript
export const API_CONFIG = {
  baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3001/api",
  endpoints: {
    powerUsage: "/analytics/power-usage",
    applianceEnergy: "/analytics/appliance-energy",
    automationComparison: "/analytics/automation-comparison",
  },
};
```

## Performance Optimizations

- **Efficient Rendering**: Components only re-render when data changes
- **Proper Hook Usage**: useEffect with empty dependencies for single fetch
- **Responsive Charts**: Charts adapt to container size
- **Lazy Loading**: Client-side rendering for optimal performance

## Future Enhancements

- [ ] Time range selector (day/week/month/year)
- [ ] Export data to CSV/PDF
- [ ] Real-time updates with WebSocket
- [ ] Comparison between multiple time periods
- [ ] Drill-down views for detailed analysis
- [ ] Custom date range picker
- [ ] Data refresh button with timestamp

## Development

```bash
# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

## Testing the Page

1. Start the development server
2. Navigate to `/analytics`
3. Page will use mock data if API is unavailable
4. Check browser console for API errors
5. Verify responsive behavior on different screen sizes

## Troubleshooting

**Charts not rendering?**

- Verify Recharts is installed: `npm install recharts`
- Check browser console for errors
- Ensure data types match expected format

**API errors?**

- Verify API_BASE_URL in environment variables
- Check API endpoint availability
- Review network tab in browser DevTools
- Verify CORS configuration on backend

**Mock data showing?**

- This is expected when API is unavailable
- Check the error message for details
- Verify backend server is running
- Confirm endpoint URLs are correct

## License

Part of EcoTrack AI Dashboard project.
