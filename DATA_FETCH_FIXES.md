# Data Fetching Fixes - Historical Data & Analytics Pages

## Issues Found and Fixed

### 1. **Database Query Issues (lib/database.ts)**

#### Problem with `getHistoricalRoomSensorData()`:
- **Issue**: The function was using aggregate functions (`AVG`, `BOOL_OR`) in the SELECT clause for **all** aggregation types, but only adding a GROUP BY clause when aggregation was "hourly"
- **Result**: For "raw" aggregation, PostgreSQL would fail because aggregate functions require a GROUP BY clause, OR all selected non-aggregated columns must be in GROUP BY
- **Fix**: 
  - For "raw" aggregation: Select raw column values without aggregate functions
  - For "hourly" aggregation: Use AVG() for numeric columns and BOOL_OR() for motion, with proper GROUP BY on DATE_TRUNC

#### Problem with `getHistoricalPZEMData()`:
- **Issue**: Same as above - aggregate functions were always applied regardless of aggregation type
- **Result**: Raw data queries would fail with SQL errors
- **Fix**: Apply conditional aggregate functions based on aggregation type

### 2. **Analytics Page Display Issue (app/analytics/page.tsx)**

#### Problem with timestamp formatting:
- **Issue**: Used `toLocaleTimeString()` which only showed time (HH:MM) without date
- **Result**: Hourly data points appeared identical in the chart, making it unclear which hour each data point represents
- **Fix**: Changed to `toLocaleString()` with date and time format showing "Mon D, HH:MM" format
  - From: `toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })`
  - To: `toLocaleString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })`

#### Added error logging:
- **Issue**: No error feedback when API response was not ok
- **Fix**: Added console.error logging for failed API requests

## Changes Made

### File: `lib/database.ts`

**Function: `getHistoricalRoomSensorData()`**
```typescript
// Before: Always used aggregate functions
${aggFunc}(rs.temperature) as temperature,

// After: Conditional based on aggregation type
${aggregation === "hourly" ? "AVG(rs.temperature)" : "rs.temperature"} as temperature,
```

And only add GROUP BY when aggregation is "hourly":
```typescript
if (aggregation === "hourly") {
  query += `GROUP BY DATE_TRUNC('hour', rs.timestamp), rs.room_id, r.name`;
}
```

**Function: `getHistoricalPZEMData()`**
- Applied same fix as above for conditional aggregate functions
- Only add GROUP BY when aggregation is "hourly"

### File: `app/analytics/page.tsx`

**Timestamp formatting fix:**
```typescript
// Added date to the timestamp display for clarity
time: new Date(item.timestamp).toLocaleString("en-US", {
  month: "short",
  day: "numeric",
  hour: "2-digit",
  minute: "2-digit",
}),
```

**Error handling:**
```typescript
} else {
  console.error("Failed to fetch PZEM data:", response.statusText);
}
```

## How These Fixes Resolve the Problem

1. **Data now fetches correctly**: The SQL queries are valid PostgreSQL syntax and will execute properly
2. **Raw data displays**: Users can now fetch raw sensor readings without aggregation
3. **Hourly data aggregates properly**: When hourly aggregation is requested, data is properly grouped and averaged
4. **Analytics charts show clear timeline**: Timestamps now include date information, making it clear which data points are from which time periods
5. **Better error visibility**: Failed API requests are now logged to the console for debugging

## Testing Recommendations

1. **Test Historical Data Page**:
   - Select different date ranges
   - Select single and multiple rooms
   - Verify data loads and displays in table and charts

2. **Test Analytics Page**:
   - Check that 24-hour historical data loads
   - Verify chart displays hourly data points clearly
   - Check that real-time PZEM data updates

3. **Database Validation**:
   - Verify data exists in both `room_sensors` and `pzem_data` tables
   - Check that database timestamps are in UTC format

## Build Status

✅ Build successful - No TypeScript or build errors
