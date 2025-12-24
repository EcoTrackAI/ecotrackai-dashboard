# MetricCard Component

A reusable, accessible metric card component for the EcoTrack AI energy dashboard.

## Features

- ✅ **TypeScript**: Fully typed props and interfaces
- ✅ **Accessible**: ARIA labels, semantic HTML, keyboard navigation
- ✅ **Responsive**: Mobile-first design with Tailwind CSS
- ✅ **Flexible**: Customizable icons, trends, and styling
- ✅ **Smart Trends**: Automatic color coding based on trend direction
- ✅ **Performance**: Optimized rendering with minimal re-renders

## Props

| Prop        | Type               | Required | Description                                  |
| ----------- | ------------------ | -------- | -------------------------------------------- |
| `title`     | `string`           | ✅       | The metric title/label                       |
| `value`     | `string \| number` | ✅       | The main metric value                        |
| `unit`      | `string`           | ✅       | Unit of measurement (e.g., "kW", "kWh", "%") |
| `icon`      | `React.ReactNode`  | ✅       | Icon component (typically SVG)               |
| `trend`     | `TrendObject`      | ❌       | Optional trend indicator                     |
| `className` | `string`           | ❌       | Additional CSS classes                       |

### Trend Object

```typescript
{
  direction: 'up' | 'down';   // Arrow direction
  value: number;               // Percentage change
  isPositive?: boolean;        // Explicitly mark as good/bad
}
```

## Usage

### Basic Example

```tsx
import { MetricCard } from "@/components/metrics";

<MetricCard
  title="Current Power Usage"
  value="4.2"
  unit="kW"
  icon={
    <svg
      className="w-6 h-6"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M13 10V3L4 14h7v7l9-11h-7z"
      />
    </svg>
  }
  trend={{
    direction: "up",
    value: 8.3,
  }}
/>;
```

### With Explicit Trend Sentiment

```tsx
// Cost savings increasing (good, even though up)
<MetricCard
  title="Cost Savings"
  value="$248"
  unit="this month"
  icon={<DollarIcon />}
  trend={{
    direction: "up",
    value: 15.7,
    isPositive: true, // Override default (up = warning)
  }}
/>
```

### Without Trend

```tsx
<MetricCard
  title="Active Devices"
  value="24"
  unit="devices"
  icon={<DeviceIcon />}
/>
```

## Color Semantics

The component automatically applies semantic colors based on trends:

### Default Behavior

- **Down trend**: Green (#16A34A) — energy savings
- **Up trend**: Orange (#FB923C) — high consumption warning

### Override with `isPositive`

- `isPositive: true` → Green (success)
- `isPositive: false` → Red (error)

## Design System Compliance

- Background: White (#FFFFFF)
- Border: Gray-200
- Text: Primary (#111827) and gray variants
- Accent: Indigo (#6366F1) for icons
- Hover: Subtle shadow transition
- Typography: Tabular numbers for metrics

## Accessibility

- Semantic HTML (`<article>` role)
- ARIA labels for screen readers
- Keyboard navigable
- Sufficient color contrast (WCAG AA)
- Icons marked with `aria-hidden`
- Status updates announced with `role="status"`

## Responsive Behavior

- Mobile-first design
- Scales gracefully on all screen sizes
- Recommended grid: `grid-cols-1 md:grid-cols-2 lg:grid-cols-3`

## Examples

See [MetricCardExamples.tsx](./MetricCardExamples.tsx) for comprehensive usage examples.

## Integration

```tsx
// In your dashboard page
import { MetricCard } from "@/components/MetricCard";

export default function Dashboard() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <MetricCard
        title="Current Power"
        value={liveData.power}
        unit="kW"
        icon={<PowerIcon />}
        trend={{
          direction: liveData.trend > 0 ? "up" : "down",
          value: Math.abs(liveData.trend),
        }}
      />
      {/* More cards... */}
    </div>
  );
}
```

## Performance Tips

- Use `React.memo()` if parent re-renders frequently
- Pass stable icon references (memoize or use constants)
- Avoid inline object creation for `trend` prop

## Customization

Add custom classes via `className` prop:

```tsx
<MetricCard {...props} className="shadow-lg border-2 border-indigo-200" />
```

---

**Component Location**: `components/MetricCard.tsx`  
**Examples**: `components/MetricCardExamples.tsx`
