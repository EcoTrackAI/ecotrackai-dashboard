# Insights - AI-Powered Recommendations

## Overview

The Insights page displays machine learning-generated recommendations to optimize energy usage, improve comfort, and reduce costs based on your usage patterns and environmental data.

## Features

- **Energy Savings** - Reduce consumption through smart suggestions
- **Comfort Optimization** - Maintain comfort while saving energy
- **Predictive Maintenance** - Anticipate device issues
- **Cost Reduction** - Lower energy bills
- **Peak Demand Management** - Avoid peak hour charges

## Recommendation Types

### 1. Energy Savings

Suggestions to reduce overall energy consumption.

**Example:**

- "Reduce AC temperature by 2°C when room is unoccupied"
- "Switch to LED bulbs in frequently used rooms"

### 2. Comfort Optimization

Balance comfort with efficiency.

**Example:**

- "Pre-cool bedroom 30 minutes before bedtime"
- "Adjust humidity levels for better comfort"

### 3. Predictive Maintenance

Anticipate and prevent device failures.

**Example:**

- "AC filter needs cleaning - efficiency decreased 15%"
- "Water heater showing unusual power spikes"

### 4. Cost Reduction

Lower energy bills through smart scheduling.

**Example:**

- "Shift washing machine to off-peak hours to save $5/week"
- "Solar production peak at 2 PM - use high-power devices then"

### 5. Peak Demand Management

Avoid high demand periods.

**Example:**

- "Reduce AC usage during 6-8 PM peak hours"
- "Pre-cool house before peak pricing begins"

## Data Structure

### ML Recommendation Interface

```typescript
interface MLRecommendation {
  id: string;
  title: string;
  description: string;
  confidenceScore: number; // 0-100
  category: RecommendationCategory;
  inputs: {
    weather?: { temperature: number; condition: string };
    occupancy?: { current: number; predicted: number };
    timeOfDay?: { hour: number; period: string };
    historicalPattern?: string;
  };
  action: {
    type: "schedule" | "adjust" | "alert" | "optimize";
    target: string;
    parameters?: Record<string, unknown>;
  };
  potentialSavings?: {
    amount: number;
    unit: "kWh" | "percentage" | "currency";
  };
  timestamp: Date;
}
```

## Confidence Levels

Recommendations are scored based on data quality and pattern confidence:

- **Very High (90-100%)** - Strong pattern, reliable data
- **High (75-89%)** - Good pattern, solid data
- **Medium (50-74%)** - Moderate pattern, adequate data
- **Low (<50%)** - Weak pattern, limited data

## Input Factors

### Weather Data

- Current temperature
- Weather conditions
- Forecast trends
- Seasonal patterns

### Occupancy Patterns

- Current room occupancy
- Historical patterns
- Predicted future occupancy
- Time-of-day trends

### Historical Usage

- Past consumption patterns
- Device usage history
- Energy trends
- Cost history

### Time-Based Factors

- Time of day
- Day of week
- Seasonal variations
- Peak/off-peak periods

## Components

### MLRecommendationCard

Displays individual recommendations.

**Props:**

- `recommendation` - Recommendation object
- `onApply` - Callback when user applies recommendation

**Features:**

- Confidence score badge
- Category icon
- Potential savings display
- Apply button
- Dismiss option

### Usage Example

```tsx
<MLRecommendationCard
  recommendation={{
    id: "rec-1",
    title: "Optimize AC Schedule",
    description: "Turn off AC 30 minutes before leaving",
    confidenceScore: 85,
    category: "energy-savings",
    potentialSavings: { amount: 2.5, unit: "kWh" },
    action: { type: "schedule", target: "ac-1" },
  }}
  onApply={(id) => applyRecommendation(id)}
/>
```

## Applying Recommendations

### Manual Application

User reviews and applies recommendations manually:

```typescript
async function applyRecommendation(recommendationId: string) {
  const rec = recommendations.find((r) => r.id === recommendationId);

  if (rec.action.type === "schedule") {
    // Create automation rule
    await createAutomationRule(rec.action);
  } else if (rec.action.type === "adjust") {
    // Adjust device settings
    await updateDeviceSettings(rec.action);
  }
}
```

### Auto-Apply

For high-confidence recommendations:

```typescript
// Auto-apply recommendations with >90% confidence
const highConfidence = recommendations.filter((r) => r.confidenceScore > 90);
highConfidence.forEach((rec) => {
  if (userSettings.autoApplyHighConfidence) {
    applyRecommendation(rec.id);
  }
});
```

## Generating Recommendations

### ML Algorithm Flow

```
1. Collect Data
   ├─ Sensor readings
   ├─ Weather data
   ├─ Occupancy patterns
   └─ Historical usage

2. Analyze Patterns
   ├─ Time-based trends
   ├─ Weather correlations
   ├─ Occupancy impact
   └─ Device efficiency

3. Generate Insights
   ├─ Calculate potential savings
   ├─ Assess confidence level
   ├─ Define action plan
   └─ Estimate impact

4. Rank & Filter
   ├─ Sort by savings potential
   ├─ Remove low-confidence items
   ├─ Avoid conflicts
   └─ Prioritize by impact
```

## Best Practices

1. **Start Conservative** - Begin with high-confidence recommendations
2. **Monitor Results** - Track actual vs predicted savings
3. **Adjust Gradually** - Make incremental changes
4. **User Feedback** - Allow users to rate recommendations
5. **Seasonal Adaptation** - Update models based on seasons

## Example Recommendations

### Summer Cooling

```typescript
{
  title: "Optimize AC Usage",
  description: "Based on weather forecast, pre-cool house at 2 PM instead of 4 PM to take advantage of solar production",
  confidenceScore: 88,
  category: "energy-savings",
  potentialSavings: { amount: 3.2, unit: "kWh" },
  inputs: {
    weather: { temperature: 35, condition: "sunny" },
    timeOfDay: { hour: 14, period: "afternoon" }
  }
}
```

### Off-Peak Shifting

```typescript
{
  title: "Shift Water Heater Schedule",
  description: "Heat water during off-peak hours (10 PM - 6 AM) to save on electricity costs",
  confidenceScore: 92,
  category: "cost-reduction",
  potentialSavings: { amount: 15, unit: "percentage" },
  action: { type: "schedule", target: "water-heater-1" }
}
```

### Predictive Maintenance

```typescript
{
  title: "AC Filter Maintenance",
  description: "AC efficiency dropped 12% over past 2 weeks. Clean or replace filter",
  confidenceScore: 95,
  category: "predictive-maintenance",
  action: { type: "alert", target: "ac-1" }
}
```

## Troubleshooting

**No recommendations appearing**

- Check if sufficient historical data exists
- Verify sensor data is being collected
- Ensure ML models are loaded

**Low confidence scores**

- Need more historical data
- Inconsistent usage patterns
- External factors affecting predictions

**Inaccurate savings estimates**

- Calibrate models with actual data
- Update baseline consumption
- Adjust for seasonal variations

## Configuration

### Recommendation Settings

Edit user preferences in settings:

```typescript
interface RecommendationSettings {
  autoApplyHighConfidence: boolean;
  minConfidenceScore: number;
  enabledCategories: RecommendationCategory[];
  notificationFrequency: "immediate" | "daily" | "weekly";
}
```

## Related

- [Automation Guide](./automation.md)
- [Analytics Guide](./analytics-guide.md)
- [Settings Configuration](./settings-guide.md)
