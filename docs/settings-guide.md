# Settings Page

## Overview

A comprehensive settings management interface for configuring smart home automation parameters, including rooms, appliances, electricity tariff, data sampling, and notifications.

## Features

### 1. Room Configuration

- Add, edit, and delete rooms
- Enable/disable individual rooms
- Track appliance count per room
- Real-time validation

### 2. Appliance Power Ratings

- Configure appliances with power ratings (in Watts)
- Assign appliances to specific rooms
- Enable/disable appliances individually
- Organized grid layout for easy management

### 3. Electricity Tariff

- Set currency and unit price per kWh
- Support for multiple currencies (USD, EUR, GBP, INR, JPY)
- Optional time-based pricing (Peak/Off-Peak rates)
- Configure peak hours for dynamic pricing

### 4. Data Sampling

- Configurable sampling interval (1-3600 seconds)
- Data retention settings (7-365 days)
- Aggregation method selection (average, sum, max, min)
- Storage and performance guidelines

### 5. Notifications

- Email and push notification toggles
- High usage alerts with configurable threshold
- Offline device alerts
- Granular control over notification types

## Design System Compliance

### Colors

- Background: `#F8FAFC`
- Card background: `#FFFFFF`
- Primary accent: `#6366F1` (buttons, active tabs)
- Success: `#16A34A` (save confirmation)
- Error: `#DC2626` (delete actions)
- Text primary: `#111827`
- Text muted: `#6B7280`

### Accessibility

- Semantic HTML with proper heading hierarchy
- ARIA labels for icon buttons
- Focus states on all interactive elements
- Keyboard navigation support
- Proper form labels and descriptions

### Responsive Design

- Mobile-first approach
- Horizontal scrolling tabs on small screens
- Responsive grid layouts
- Touch-friendly tap targets (min 44x44px)

## Data Persistence

Settings are persisted to `localStorage` under the key `systemSettings`:

```typescript
{
  rooms: Room[],
  appliances: Appliance[],
  tariff: TariffSettings,
  dataSampling: DataSamplingSettings,
  notifications: NotificationSettings
}
```

## Form Validation

### Room Configuration

- Room names cannot be empty
- Duplicate room names are allowed but discouraged
- Deleting a room removes all associated appliances

### Appliance Configuration

- Appliances must be assigned to an existing room
- Power rating must be a positive number
- Minimum power rating: 0W

### Tariff Settings

- Unit price must be positive
- Peak hours must be between 0-23
- Peak end hour should be after peak start hour

### Data Sampling

- Interval: 1-3600 seconds
- Retention: 7-365 days
- Aggregation method must be valid

### Notifications

- High usage threshold must be positive
- Threshold only relevant when high usage alerts are enabled

## Usage Example

```typescript
// Access settings in other components
const settings = JSON.parse(localStorage.getItem("systemSettings") || "{}");
const rooms = settings.rooms || DEFAULT_ROOMS;
const tariff = settings.tariff || DEFAULT_TARIFF;

// Calculate energy cost
const energyKwh = (powerWatts * hours) / 1000;
const cost = energyKwh * tariff.unitPrice;
```

## Component Structure

```
SettingsPage
├── Tab Navigation
│   ├── Rooms Tab
│   ├── Appliances Tab
│   ├── Tariff Tab
│   ├── Data Sampling Tab
│   └── Notifications Tab
└── Save Button
```

## State Management

The component uses React's `useState` and `useEffect` hooks:

```typescript
const [rooms, setRooms] = useState<Room[]>([]);
const [appliances, setAppliances] = useState<Appliance[]>([]);
const [tariff, setTariff] = useState<TariffSettings>({});
const [dataSampling, setDataSampling] = useState<DataSamplingSettings>({});
const [notifications, setNotifications] = useState<NotificationSettings>({});
const [activeTab, setActiveTab] = useState("rooms");
const [saveStatus, setSaveStatus] = useState("idle");
```

## Future Enhancements

1. **Backend Integration**: Sync settings with Firebase or PostgreSQL
2. **Import/Export**: Allow users to backup and restore settings
3. **Validation**: Add more robust client-side validation
4. **Bulk Operations**: Multi-select for batch enable/disable
5. **Search/Filter**: Filter appliances by room or name
6. **Usage Statistics**: Show estimated monthly costs based on settings
7. **Templates**: Predefined room/appliance templates (e.g., "Studio Apartment")
8. **Multi-user**: User-specific settings with authentication

## Performance Considerations

- Settings are loaded once on mount
- Changes are kept in memory until "Save" is clicked
- No unnecessary re-renders (optimized state updates)
- Efficient list rendering with React keys

## Browser Compatibility

- Modern browsers (Chrome, Firefox, Safari, Edge)
- localStorage API required
- ES6+ JavaScript features
- CSS Grid and Flexbox support

## Related Files

- `types/settings.ts` - TypeScript type definitions
- `lib/constants.ts` - Design system constants
- `components/navigation/Navigation.tsx` - Navigation integration
