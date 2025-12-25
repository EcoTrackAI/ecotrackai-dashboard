# Automation - Device Control & Rules

## Overview

The Automation page allows you to control smart home appliances and create automated rules based on conditions like time, occupancy, or energy thresholds.

## Features

- **Device Control** - Manually turn devices on/off
- **Automation Rules** - Create condition-based automation
- **Power Monitoring** - Real-time power consumption
- **Schedule Management** - Time-based device control
- **Control Modes** - Auto vs Manual mode
- **Activity History** - Recent automation actions

## Device Types

### Supported Appliances

- **Air Conditioner** - Temperature control, mode selection
- **Fan** - Speed control
- **Light** - On/off control
- **Heater** - Temperature control
- **Dehumidifier** - Humidity control
- **Other** - Generic appliances

## Data Structure

### Appliance Interface

```typescript
interface Appliance {
  id: string;
  name: string;
  type: ApplianceType;
  room: string;
  status: "on" | "off";
  controlMode: "auto" | "manual";
  powerConsumption: number;
  settings?: {
    fan?: { speed: number };
    ac?: { temperature: number; mode: "cool" | "heat" | "fan" };
  };
  isOnline: boolean;
}
```

### Automation Rule Interface

```typescript
interface AutomationRule {
  id: string;
  applianceId: string;
  condition: string; // "temperature > 26", "time == 22:00"
  action: string; // "turn_off", "set_temp_24"
  enabled: boolean;
}
```

## Components

### ApplianceControlCard

Displays and controls individual appliances.

**Features:**

- Status indicator (on/off)
- Power consumption
- Control mode toggle
- Device-specific settings
- Online/offline status

### AutomationControlPanel

Main control interface for creating and managing automation rules.

**Features:**

- Add/edit rules
- Enable/disable rules
- Condition builder
- Action selector

### AutomationActivityItem

Displays recent automation events.

**Information:**

- Timestamp
- Device name
- Action performed
- Trigger condition

## Creating Automation Rules

### Time-Based Rules

```typescript
{
  id: "rule-1",
  applianceId: "ac-1",
  condition: "time == 22:00",
  action: "turn_off",
  enabled: true
}
```

### Sensor-Based Rules

```typescript
{
  id: "rule-2",
  applianceId: "ac-1",
  condition: "temperature > 26",
  action: "turn_on",
  enabled: true
}
```

### Occupancy-Based Rules

```typescript
{
  id: "rule-3",
  applianceId: "light-1",
  condition: "occupancy == 0 && time > 23:00",
  action: "turn_off",
  enabled: true
}
```

## Control Modes

### Manual Mode

- User has full control
- Automation rules are disabled
- Direct on/off control
- Settings can be adjusted manually

### Auto Mode

- System follows automation rules
- Responds to conditions automatically
- Optimizes energy usage
- Can override temporarily

## API Integration

### Control Appliance

```typescript
async function controlAppliance(applianceId: string, status: "on" | "off") {
  const response = await fetch(`/api/appliances/${applianceId}/control`, {
    method: "POST",
    body: JSON.stringify({ status }),
  });
  return response.json();
}
```

### Update Settings

```typescript
async function updateSettings(
  applianceId: string,
  settings: ApplianceSettings
) {
  const response = await fetch(`/api/appliances/${applianceId}/settings`, {
    method: "PATCH",
    body: JSON.stringify({ settings }),
  });
  return response.json();
}
```

## Best Practices

1. **Safety First** - Set reasonable limits for automation
2. **Manual Override** - Always allow manual control
3. **Conflict Resolution** - Handle rule conflicts properly
4. **Error Recovery** - Gracefully handle offline devices
5. **Activity Logging** - Track all automation actions

## Energy Optimization

### Tips for Automation

1. **Schedule Cooling** - Turn off AC before leaving
2. **Occupancy Detection** - Turn off lights when rooms empty
3. **Temperature Management** - Set comfortable ranges
4. **Load Shifting** - Run high-power devices during off-peak hours

### Example Optimization Rules

```typescript
// Turn off AC when leaving for work
{
  condition: "time == 08:00 && occupancy == 0",
  action: "turn_off"
}

// Pre-cool before arriving home
{
  condition: "time == 17:30",
  action: "turn_on && set_temp_24"
}

// Night mode - reduce power
{
  condition: "time == 23:00",
  action: "turn_off_non_essential"
}
```

## Troubleshooting

**Device not responding**

- Check device online status
- Verify network connection
- Check device power supply

**Rules not triggering**

- Verify rule is enabled
- Check condition syntax
- Review activity log

**Conflicting rules**

- Review rule priorities
- Check for overlapping conditions
- Consider rule sequencing

## Configuration

### Default Settings

Edit `lib/constants.ts`:

```typescript
export const DEFAULT_APPLIANCES: Appliance[] = [
  {
    id: "ac-1",
    name: "Air Conditioner",
    type: "air_conditioner",
    room: "living-room",
    status: "off",
    controlMode: "manual",
    powerConsumption: 0,
    isOnline: true,
  },
  // Add more appliances...
];
```

## Related

- [Live Monitoring](./live-monitoring.md)
- [Energy Analytics](./analytics-guide.md)
- [Settings Configuration](./settings-guide.md)
