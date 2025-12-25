# MLRecommendationCard Component

A professional, accessible component for displaying AI-generated energy optimization recommendations with decision transparency.

## Features

- **Confidence Scoring**: Visual confidence indicator with percentage and color-coded badges
- **Decision Transparency**: Expandable section showing ML model inputs (weather, occupancy, time, historical patterns)
- **Action Buttons**: Apply or ignore recommendations with loading states
- **Potential Savings**: Display estimated energy/cost savings
- **Category Icons**: Visual categorization of recommendation types
- **Accessibility**: Full ARIA support and keyboard navigation
- **Responsive Design**: Mobile-first, adapts to all screen sizes

## Usage

```tsx
import { MLRecommendationCard } from "@/components/recommendations";
import { MLRecommendation } from "@/types/recommendations";

const recommendation: MLRecommendation = {
  id: "rec-001",
  title: "Reduce AC Temperature",
  description:
    "Based on current weather and occupancy patterns, reducing AC temperature by 2°C will save energy without compromising comfort.",
  confidenceScore: 0.89,
  inputs: {
    weather: {
      temperature: 28,
      condition: "Partly Cloudy",
    },
    occupancy: {
      current: 2,
      predicted: 1,
    },
    timeOfDay: {
      hour: 14,
      period: "afternoon",
    },
    historicalPattern: "Low activity period",
  },
  action: {
    type: "adjust",
    target: "Living Room AC",
    parameters: { temperature: 24 },
  },
  timestamp: new Date(),
  category: "energy-savings",
  potentialSavings: {
    amount: 3.5,
    unit: "kWh",
  },
};

function RecommendationsPage() {
  const handleApply = async (id: string) => {
    // Apply recommendation logic
    await applyRecommendation(id);
  };

  const handleIgnore = async (id: string) => {
    // Ignore recommendation logic
    await ignoreRecommendation(id);
  };

  return (
    <MLRecommendationCard
      recommendation={recommendation}
      onApply={handleApply}
      onIgnore={handleIgnore}
    />
  );
}
```

## Props

| Prop             | Type                                    | Required | Description                            |
| ---------------- | --------------------------------------- | -------- | -------------------------------------- |
| `recommendation` | `MLRecommendation`                      | Yes      | The recommendation data object         |
| `onApply`        | `(id: string) => void \| Promise<void>` | No       | Callback when Apply button is clicked  |
| `onIgnore`       | `(id: string) => void \| Promise<void>` | No       | Callback when Ignore button is clicked |
| `className`      | `string`                                | No       | Additional CSS classes                 |

## Confidence Levels

Confidence scores are automatically categorized:

- **90-100%**: Very High (green badge)
- **75-89%**: High (green badge)
- **50-74%**: Medium (orange badge)
- **0-49%**: Low (red badge)

## Recommendation Categories

- `energy-savings` ⚡ - Energy optimization recommendations
- `comfort-optimization` 🌡️ - Comfort-related adjustments
- `predictive-maintenance` 🔧 - Maintenance alerts
- `cost-reduction` 💰 - Cost-saving opportunities
- `peak-demand` 📊 - Peak demand management

## Decision Transparency

The expandable "Decision Inputs" section shows:

- **Weather**: Current temperature and conditions
- **Occupancy**: Current and predicted occupancy levels
- **Time**: Hour and time period (morning/afternoon/evening/night)
- **Historical Pattern**: Relevant historical usage patterns

## Accessibility

- Semantic HTML with proper heading hierarchy
- ARIA labels and roles for screen readers
- Keyboard navigation support
- Focus indicators on interactive elements
- Color-blind friendly confidence indicators

## Styling

Follows the project's design system:

- Clean, minimalist card design
- Professional color palette
- Subtle hover effects
- Responsive typography
- Mobile-first layout

## Example Scenarios

### Energy Savings Recommendation

```tsx
{
  category: 'energy-savings',
  title: 'Shift Load to Off-Peak Hours',
  description: 'Run dishwasher during off-peak hours (10 PM - 6 AM) to reduce electricity costs.',
  confidenceScore: 0.92,
  potentialSavings: { amount: 15, unit: 'percentage' }
}
```

### Comfort Optimization

```tsx
{
  category: 'comfort-optimization',
  title: 'Pre-cool Before Peak Hours',
  description: 'Lower temperature before afternoon peak to maintain comfort with less energy.',
  confidenceScore: 0.78,
  potentialSavings: { amount: 2.8, unit: 'kWh' }
}
```

### Predictive Maintenance

```tsx
{
  category: 'predictive-maintenance',
  title: 'Schedule HVAC Filter Replacement',
  description: 'Air filter efficiency has decreased. Schedule replacement to maintain optimal performance.',
  confidenceScore: 0.85,
  potentialSavings: { amount: 10, unit: 'percentage' }
}
```

## Integration with Firebase & API

The component is data-source agnostic. Connect to your backend:

```tsx
// Fetch from API
const fetchRecommendations = async () => {
  const response = await fetch("/api/recommendations");
  const data: MLRecommendation[] = await response.json();
  return data;
};

// Or from Firebase
import { ref, onValue } from "firebase/database";

const recommendationsRef = ref(db, "recommendations");
onValue(recommendationsRef, (snapshot) => {
  const data: MLRecommendation[] = snapshot.val();
  // Update state
});
```
