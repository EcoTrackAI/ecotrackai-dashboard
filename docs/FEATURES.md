# Features Documentation

**Version**: 1.0.0  
**Last Updated**: December 26, 2025  
**Status**: Production Ready

## Overview

This document provides comprehensive documentation for all features available in the EcoTrack AI Dashboard. Each feature includes detailed descriptions, use cases, technical implementation details, and user interface guidelines.

### Feature Categories

- **Real-Time Monitoring**: Live sensor data visualization
- **Historical Analytics**: Time-series data analysis and reporting
- **Smart Automation**: Intelligent device control and scheduling
- **Energy Insights**: AI-powered recommendations and optimization
- **Data Management**: Synchronization and storage capabilities

### Quick Navigation

Jump to specific features:

- [Real-Time Monitoring](#1-real-time-monitoring) - Live IoT sensor data
- [Historical Analytics](#2-historical-analytics) - Query and analyze past data
- [Smart Automation](#3-smart-automation) - Device control and rules
- [Energy Insights](#4-energy-insights) - AI recommendations
- [Dashboard Overview](#5-dashboard-overview) - Main interface

## 1. Real-Time Monitoring

### Overview

Monitor live sensor data from IoT devices in real-time using Firebase Realtime Database and WebSocket connections.

### Key Capabilities

- Live sensor readings updated every few seconds
- Support for multiple sensor types
- Automatic offline detection
- Connection status indicators
- Stale data warnings

### Sensor Types Supported

| Category    | Description                  | Units  | Typical Range |
| ----------- | ---------------------------- | ------ | ------------- |
| Temperature | Ambient temperature          | °C, °F | 15-30°C       |
| Humidity    | Relative humidity            | %      | 30-70%        |
| Power       | Electrical power consumption | W, kW  | 0-10,000W     |
| Energy      | Cumulative energy usage      | kWh    | 0-1000 kWh    |
| Lighting    | Light intensity              | lux, % | 0-1000 lux    |
| Occupancy   | Motion/presence detection    | binary | 0 or 1        |
| System      | Device status and health     | varies | varies        |

### User Interface

**Dashboard Page** (`/`)

- Compact sensor cards showing current values
- Color-coded status indicators (green=normal, yellow=warning, red=critical, gray=offline)
- Last update timestamps
- Quick glance at all sensors

**Live Monitoring Page** (`/live-monitoring`)

- Full-screen sensor display
- Detailed sensor information
- Real-time connection status
- Category filtering
- Active sensor count
- Auto-refresh indicators

### Status Indicators

- **🟢 Normal**: Sensor operating within normal parameters
- **🟡 Warning**: Value approaching threshold limits
- **🔴 Critical**: Value exceeded safety thresholds
- **⚫ Offline**: No data received for 30+ seconds

### Technical Implementation

```typescript
// Real-time subscription
const unsubscribe = subscribeSensorData((sensors) => {
  // Update UI with latest sensor data
  setSensors(sensors);
});

// Cleanup on unmount
return () => unsubscribe();
```

### Stale Data Detection

Sensors are marked offline if no data received within 30 seconds:

```typescript
const STALE_THRESHOLD = 30000; // 30 seconds

const isSensorStale = (lastUpdate: string): boolean => {
  return Date.now() - new Date(lastUpdate).getTime() >= STALE_THRESHOLD;
};
```

---

## 2. Historical Analytics

### Overview

Query and analyze historical sensor data stored in PostgreSQL with advanced filtering and aggregation.

### Key Capabilities

- Date range selection
- Room-based filtering
- Data aggregation (raw or hourly)
- Interactive charts and graphs
- Data export (coming soon)
- Trend analysis

### User Interface

**History Page** (`/history`)

- Date range picker
- Room selector (multi-select)
- Data table with sortable columns
- Interactive charts
- Download options

**Analytics Page** (`/analytics`)

- Power usage trends
- Energy consumption by appliance
- Cost analysis
- Automation impact comparison
- Peak usage identification

### Query Capabilities

**Time Ranges**

- Last 24 hours
- Last 7 days
- Last 30 days
- Last 3 months
- Custom date range

**Aggregations**

- **Raw**: Every sensor reading
- **Hourly**: Averaged by hour
- **Daily**: Aggregated by day (via SQL view)

**Filters**

- Specific rooms
- Sensor categories
- Time of day
- Day of week

### Chart Types

1. **Line Charts**: Temperature, humidity trends over time
2. **Area Charts**: Power consumption patterns
3. **Bar Charts**: Energy usage by room/appliance
4. **Pie Charts**: Energy distribution
5. **Comparison Charts**: Before/after automation

### Data Export

```typescript
// Export to CSV (coming soon)
const exportData = async (data: HistoricalDataPoint[]) => {
  const csv = convertToCSV(data);
  downloadFile(csv, "sensor-data.csv");
};
```

---

## 3. Smart Automation

### Overview

Control smart home devices automatically based on rules, schedules, and AI recommendations.

### Key Capabilities

- Device control (on/off, dimming, temperature)
- Rule-based automation
- Schedule creation
- Manual overrides
- Power consumption tracking
- Auto/manual mode switching

### Supported Device Types

| Device Type | Controls          | Examples                   |
| ----------- | ----------------- | -------------------------- |
| Lights      | On/Off, Dimming   | Smart bulbs, switches      |
| HVAC        | Temperature, Mode | AC, heater, thermostat     |
| Fans        | On/Off, Speed     | Ceiling fans, exhaust fans |
| Plugs       | On/Off            | Smart plugs, outlets       |
| Other       | Device-specific   | Humidifier, dehumidifier   |

### Automation Rules

**Condition Types**

- Occupancy-based: Turn off when no motion detected
- Time-based: Turn on/off at specific times
- Sensor-based: Adjust based on temperature/humidity
- Energy-based: Reduce consumption during peak hours

**Action Types**

- Turn on/off device
- Set device level (dimming, speed, temperature)
- Send notification
- Trigger multiple devices

**Example Rules**

```typescript
{
  id: 'rule-1',
  applianceId: 'bedroom-ac',
  condition: 'No occupancy for 15 minutes',
  action: 'Turn off AC',
  enabled: true
}
```

### User Interface

**Automation Page** (`/automation`)

- Appliance control cards
- Real-time power consumption
- Auto/manual mode toggle
- Device status indicators
- Quick controls

**Device Control Card**

- Device name and room
- Online/offline status
- Current power draw
- Control mode (auto/manual)
- Quick action buttons

### Activity Feed

Recent automation actions displayed with:

- Action description
- Timestamp
- Status (success/error/warning/info)
- Reason for action

---

## 4. Energy Insights

### Overview

AI-powered recommendations and insights to optimize energy usage and reduce costs.

### Key Capabilities

- Personalized recommendations
- Cost savings estimates
- Peak usage alerts
- Efficiency scoring
- Comparative analysis
- Trend predictions

### Insight Types

**1. Cost Savings**

- Identify high-consumption devices
- Suggest optimal usage times
- Calculate potential savings
- ROI on automation

**2. Efficiency Improvements**

- Device replacement recommendations
- Usage pattern optimization
- Temperature setpoint adjustments
- Scheduling improvements

**3. Anomaly Detection**

- Unusual consumption patterns
- Device malfunctions
- Phantom power draw
- Efficiency degradation

**4. Forecasting**

- Monthly cost projections
- Consumption trends
- Peak demand predictions
- Seasonal adjustments

### User Interface

**Insights Page** (`/insights`)

- ML recommendation cards
- Priority-ordered insights
- Action buttons
- Impact estimates
- Confidence scores

**Recommendation Card**

- Title and description
- Estimated savings
- Implementation difficulty
- Category (cost, comfort, efficiency)
- Action button

### Metrics Calculated

- **Daily Energy**: Total kWh per day
- **Current Power**: Real-time power draw
- **Today's Cost**: Cost in USD based on rates
- **Monthly Savings**: Compared to baseline
- **Efficiency Score**: 0-100 scale
- **Carbon Footprint**: CO2 equivalent

---

## 5. Responsive Design

### Overview

Mobile-first, responsive design that works seamlessly on all devices.

### Breakpoints

```css
/* Tailwind CSS breakpoints */
sm: 640px   /* Small devices (landscape phones) */
md: 768px   /* Medium devices (tablets) */
lg: 1024px  /* Large devices (desktops) */
xl: 1280px  /* Extra large devices */
2xl: 1536px /* Ultra large screens */
```

### Layout Adaptations

**Mobile (< 640px)**

- Single column layout
- Collapsible sidebar
- Stacked metric cards
- Bottom navigation
- Touch-optimized controls

**Tablet (640-1024px)**

- Two-column layout
- Persistent sidebar (collapsible)
- Grid layouts for cards
- Touch and mouse support

**Desktop (> 1024px)**

- Multi-column layouts
- Permanent sidebar
- Advanced visualizations
- Keyboard shortcuts
- Hover interactions

### Accessibility

- ARIA labels on all interactive elements
- Keyboard navigation support
- Screen reader compatible
- High contrast mode ready
- Focus indicators

---

## 6. Auto Data Sync

### Overview

Client-side automatic synchronization replaces server-side cron jobs for Vercel free tier compatibility.

### How It Works

1. **Timer-based**: Runs every 60 seconds
2. **Client-side**: JavaScript `setInterval`
3. **API call**: POST to `/api/sync-firebase`
4. **Batch insert**: All sensors at once
5. **Error handling**: Retries on failure

### Implementation

```typescript
// DataSyncProvider component
const SYNC_INTERVAL = 60 * 1000; // 1 minute

useEffect(() => {
  const syncData = async () => {
    await fetch("/api/sync-firebase", { method: "POST" });
  };

  // Initial sync after 5 seconds
  setTimeout(syncData, 5000);

  // Recurring sync every 60 seconds
  const interval = setInterval(syncData, SYNC_INTERVAL);

  return () => clearInterval(interval);
}, []);
```

### Benefits

- **No cron jobs needed**: Works on Vercel free tier
- **Always running**: As long as someone has the app open
- **Adjustable interval**: Easy to change frequency
- **Low overhead**: Minimal server resources
- **Error recovery**: Automatic retry logic

### Limitations

- Requires active client connection
- Sync stops when all users close app
- Multiple clients may trigger duplicate syncs (handled via concurrency checks)

### Production Considerations

For production deployments with guaranteed sync:

- Upgrade to Vercel Pro for cron jobs
- Use external cron service (EasyCron, Render Cron)
- Implement server-side worker process
- Use message queue for reliable sync

---

## 7. Dashboard Overview

### Overview

Centralized view of all important metrics, sensors, rooms, and recent activity.

### Sections

**1. Metric Cards**

- Current Power Usage
- Daily Energy Consumption
- Today's Cost
- Monthly Savings

**2. Live Sensors**

- 9 most important sensors
- Quick status check
- Link to full monitoring page

**3. Room Status**

- All rooms at a glance
- Occupancy indicators
- Active device counts
- Current power per room
- Temperature displays

**4. Recent Activity**

- Last 5 automation actions
- Timestamps
- Status indicators
- Quick insights

### Refresh Strategy

- **Metrics**: Updated every 60 seconds (from PostgreSQL)
- **Sensors**: Real-time (from Firebase)
- **Rooms**: Calculated from sensor data
- **Activity**: Real-time log stream

---

## 8. Profile & Settings

### Overview

User profile management and application settings.

### Profile Features

**User Information**

- Name and email
- Avatar/initials
- Role (Admin/User)
- Last login

**System Info**

- Connected devices count
- Active rooms count
- Account created date

**Preferences**

- Theme (light/dark)
- Notifications on/off
- Automation mode
- Language (coming soon)

### Settings Categories

**1. Display**

- Theme selection
- Unit preferences (°C/°F, W/kW)
- Date format
- Time format

**2. Notifications**

- Email alerts
- Push notifications (coming soon)
- Alert thresholds
- Quiet hours

**3. Automation**

- Global automation on/off
- Default rules
- Safety limits
- Manual override permissions

**4. Data**

- Data retention period
- Export options
- Backup settings
- Privacy controls

---

## Future Features Roadmap

### Phase 1 (Q1 2026)

- [ ] User authentication (Firebase Auth)
- [ ] Multi-user support
- [ ] Role-based permissions
- [ ] Email notifications

### Phase 2 (Q2 2026)

- [ ] Mobile app (React Native)
- [ ] Advanced ML predictions
- [ ] Voice control integration
- [ ] Weather integration

### Phase 3 (Q3 2026)

- [ ] Solar panel monitoring
- [ ] EV charging optimization
- [ ] Community challenges
- [ ] Carbon offset tracking

### Phase 4 (Q4 2026)

- [ ] Third-party integrations (Alexa, Google Home)
- [ ] Energy marketplace
- [ ] Demand response participation
- [ ] Advanced analytics dashboard
