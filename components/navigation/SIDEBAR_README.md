# Sidebar Navigation Component

A professional, collapsible sidebar navigation component built for the EcoTrack AI energy dashboard.

## Features

### Core Functionality

- **Collapsible Design**: Desktop sidebar can toggle between expanded (256px) and collapsed (80px) states
- **Mobile Responsive**: Full-screen overlay menu on mobile with hamburger toggle button
- **Active Route Highlighting**: Automatically detects and highlights the current page
- **Smooth Animations**: CSS transitions for all state changes and hover effects
- **Persistent Layout**: Sidebar remains fixed while content scrolls

### Accessibility

- **ARIA Labels**: Proper labeling for screen readers
- **Keyboard Navigation**: Full keyboard support with focus management
- **Focus Indicators**: Visible focus rings for keyboard navigation
- **Semantic HTML**: Uses proper `nav`, `ul`, `li` structure

### Visual Design

- Clean, minimalist aesthetic matching the design system
- Indigo accent color for active states (#6366F1)
- Subtle hover effects on navigation items
- System status indicator in footer
- Icons from lucide-react library

## Navigation Items

| Page               | Route              | Icon      | Description                    |
| ------------------ | ------------------ | --------- | ------------------------------ |
| Overview           | `/`                | Home      | Dashboard overview and summary |
| Live Monitoring    | `/live-monitoring` | Activity  | Real-time energy monitoring    |
| Automation Control | `/automation`      | Sliders   | Device automation and control  |
| Energy Analytics   | `/analytics`       | BarChart3 | Historical data and trends     |
| ML Insights        | `/insights`        | Brain     | AI-powered predictions         |
| History            | `/history`         | Clock     | Historical records and logs    |
| Settings           | `/settings`        | Settings  | App settings and preferences   |

## Usage

### Basic Implementation

```tsx
import { Sidebar } from "@/components/navigation";

export default function MyPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />

      <main className="lg:ml-64 transition-all duration-300">
        {/* Your page content */}
      </main>
    </div>
  );
}
```

### Layout Integration

The sidebar automatically manages spacing for desktop layouts. Use the `lg:ml-64` class on your main content area to account for the expanded sidebar width.

```tsx
<main className="lg:ml-64 transition-all duration-300">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    {/* Content */}
  </div>
</main>
```

## Component API

### Props

```typescript
interface SidebarProps {
  className?: string; // Additional CSS classes
}
```

### State Management

The component manages three internal states:

- `isCollapsed`: Desktop collapsed state
- `isMobileOpen`: Mobile menu visibility
- Current route detection via `usePathname()`

## Responsive Behavior

### Desktop (lg breakpoint and above)

- Sidebar is always visible
- Toggle button collapses sidebar width
- Smooth width transition
- Hover effects on all items

### Mobile (below lg breakpoint)

- Sidebar hidden by default
- Hamburger menu button in top-left corner
- Full overlay when opened
- Backdrop click closes menu
- Smooth slide-in animation

## Styling

### Color System

- **Background**: White (#FFFFFF)
- **Border**: Gray-200 (#E5E7EB)
- **Active Background**: Indigo-50
- **Active Text**: Indigo-700
- **Active Icon**: Indigo-600
- **Inactive Text**: Gray-700
- **Inactive Icon**: Gray-500
- **Hover Background**: Gray-50

### Spacing

- Sidebar width (expanded): 256px (16rem)
- Sidebar width (collapsed): 80px (5rem)
- Header height: 64px (4rem)
- Item padding: 10px vertical, 12px horizontal
- Gap between items: 4px

## Browser Support

- Modern browsers with CSS Grid and Flexbox support
- Tailwind CSS v4 required
- React 19+ with Next.js 16+ App Router

## Dependencies

```json
{
  "lucide-react": "latest",
  "next": "^16.0.0",
  "react": "^19.0.0"
}
```

## Accessibility Checklist

- ✅ ARIA labels on all interactive elements
- ✅ `aria-current="page"` on active links
- ✅ `aria-expanded` on toggle buttons
- ✅ Proper focus management
- ✅ Keyboard navigation support
- ✅ Screen reader friendly
- ✅ High contrast ratios for text
- ✅ Touch targets 44x44px minimum

## Performance

- Client-side component with minimal JavaScript
- CSS transitions (GPU accelerated)
- No external API calls
- Lightweight icon library
- Optimized re-renders with React hooks

## Customization

### Adding New Navigation Items

Edit the `navigationItems` array in [Sidebar.tsx](Sidebar.tsx):

```typescript
const navigationItems: NavigationItem[] = [
  {
    name: "My Page",
    href: "/my-page",
    icon: MyIcon,
    description: "Page description",
  },
  // ...
];
```

### Changing Collapse Width

Modify the width classes in the component:

```tsx
className={`
  ${isCollapsed ? "w-20" : "w-64"}  // Change these values
`}
```

### Updating Colors

Update the Tailwind classes for active states:

```tsx
className={`
  ${isActive
    ? "bg-indigo-50 text-indigo-700"  // Change active colors
    : "text-gray-700 hover:bg-gray-50"
  }
`}
```

## Testing Recommendations

### Manual Testing

1. Test collapse/expand on desktop
2. Test mobile menu open/close
3. Navigate between all pages
4. Test keyboard navigation (Tab, Enter)
5. Test with screen reader
6. Test on various viewport sizes

### Automated Testing

```typescript
// Example test cases
- Renders all navigation items
- Highlights active route correctly
- Toggles collapsed state
- Opens/closes mobile menu
- Maintains accessibility attributes
```

## Future Enhancements

Potential improvements:

- Nested navigation items
- Collapsible sections
- Search functionality
- User-customizable order
- Keyboard shortcuts
- Badge notifications on items
- Dark mode support

## License

Part of the EcoTrack AI dashboard project.
