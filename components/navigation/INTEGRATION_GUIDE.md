# Sidebar Integration Guide

## Quick Start

### 1. Import the Component

```tsx
import { Sidebar } from "@/components/navigation";
```

### 2. Add to Your Page

```tsx
export default function MyPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />

      <main className="lg:ml-64 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Your content here */}
        </div>
      </main>
    </div>
  );
}
```

### 3. Test Navigation

Visit the following routes to see the sidebar in action:

- http://localhost:3000/ - Overview
- http://localhost:3000/live-monitoring - Live Monitoring
- http://localhost:3000/automation - Automation Control
- http://localhost:3000/analytics - Energy Analytics
- http://localhost:3000/insights - ML Insights
- http://localhost:3000/history - History
- http://localhost:3000/settings - Settings
- http://localhost:3000/sidebar-demo - Demo Page

## Layout Structure

### Required Classes on Main Content

```tsx
<main className="lg:ml-64 transition-all duration-300">
```

- `lg:ml-64`: Adds left margin on desktop to account for sidebar width
- `transition-all`: Smooth transition when sidebar collapses
- `duration-300`: 300ms transition duration

### Content Container

```tsx
<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
  {/* Content */}
</div>
```

- `max-w-7xl`: Maximum width constraint
- `mx-auto`: Center the content
- Responsive padding for all screen sizes

## Mobile Considerations

### Mobile Menu Button

- Fixed position in top-left corner
- Appears only on screens smaller than `lg` breakpoint
- Z-index of 50 to stay above content

### Overlay

- Semi-transparent backdrop when menu is open
- Clicking overlay closes the menu
- Z-index of 40

### Sidebar on Mobile

- Slides in from left when opened
- Full height overlay
- Hidden by default with `-translate-x-full`

## Desktop Behavior

### Collapse Toggle

- Button appears in sidebar header
- Icon rotates when toggled
- Smooth width transition

### Width States

- **Expanded**: 256px (w-64)
- **Collapsed**: 80px (w-20)

### Content Visibility

- When collapsed:
  - Logo text hidden
  - Navigation descriptions hidden
  - Only icons visible
  - Tooltip titles on hover

## Active Route Detection

The sidebar uses Next.js `usePathname()` hook to detect the current route:

```typescript
const pathname = usePathname();

const isActiveRoute = (href: string) => {
  if (href === "/") {
    return pathname === "/";
  }
  return pathname.startsWith(href);
};
```

### Active State Styling

- Indigo background (`bg-indigo-50`)
- Indigo text (`text-indigo-700`)
- Bold font weight
- Indigo icon color
- Active indicator bar on the right

## Customization Options

### Adding New Navigation Items

Edit `navigationItems` array in [Sidebar.tsx](./Sidebar.tsx):

```typescript
const navigationItems: NavigationItem[] = [
  // Existing items...
  {
    name: "Reports",
    href: "/reports",
    icon: FileTextIcon,
    description: "Generate and view reports",
  },
];
```

### Changing Colors

Update Tailwind classes:

```tsx
// Active state
className={`bg-indigo-50 text-indigo-700`}

// Change to different color (e.g., purple)
className={`bg-purple-50 text-purple-700`}
```

### Adjusting Widths

Modify width classes:

```tsx
${isCollapsed ? "w-20" : "w-64"}  // Change to w-72 for wider
```

### Custom Icons

Import from lucide-react:

```typescript
import { CustomIcon } from "lucide-react";
```

Browse available icons: https://lucide.dev/icons/

## Integration with Existing Navigation

If you already have a top navigation bar (like the existing `Navigation` component), you can use both together:

```tsx
import { Navigation, Sidebar } from "@/components/navigation";

export default function Page() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <Sidebar />

      <main className="lg:ml-64 pt-16 transition-all duration-300">
        {/* pt-16 accounts for top nav height */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Content */}
        </div>
      </main>
    </div>
  );
}
```

## Accessibility

### Keyboard Navigation

- Press `Tab` to navigate through sidebar items
- Press `Enter` or `Space` to activate links
- Press `Escape` to close mobile menu (to be implemented)

### Screen Readers

- Proper ARIA labels on all interactive elements
- `aria-current="page"` on active navigation item
- `aria-expanded` on collapse button
- Semantic HTML structure

### Focus Management

- Visible focus rings (ring-2 ring-indigo-500)
- Focus offset for better visibility
- Logical tab order

## Performance Tips

1. **Minimize Re-renders**: Sidebar uses `useState` internally and only re-renders when state changes

2. **CSS Transitions**: All animations use CSS transitions (GPU-accelerated)

3. **Code Splitting**: Component is marked with "use client" for client-side rendering

4. **Icon Optimization**: lucide-react icons are tree-shakeable

## Common Issues

### Issue: Sidebar Overlaps Content

**Solution**: Make sure your main element has `lg:ml-64` class

### Issue: Mobile Menu Doesn't Close

**Solution**: The `closeMobileMenu` function is called on navigation. Ensure links use Next.js `<Link>` component

### Issue: Active Route Not Highlighting

**Solution**: Verify the route matches the `href` in navigationItems array

### Issue: Icons Not Showing

**Solution**: Check that lucide-react is installed: `npm install lucide-react`

## Testing Checklist

- [ ] Desktop: Sidebar collapses and expands smoothly
- [ ] Desktop: Active route is highlighted correctly
- [ ] Desktop: Hover states work on all items
- [ ] Mobile: Hamburger button appears
- [ ] Mobile: Menu slides in when opened
- [ ] Mobile: Clicking backdrop closes menu
- [ ] Mobile: Navigation items work correctly
- [ ] All routes navigate correctly
- [ ] Keyboard navigation works (Tab, Enter)
- [ ] Focus indicators are visible
- [ ] Screen reader announces items correctly

## Next Steps

1. Add user authentication state
2. Implement role-based navigation visibility
3. Add notification badges to items
4. Create nested navigation groups
5. Add keyboard shortcut support
6. Implement dark mode
7. Add custom theming support

## Support

For questions or issues:

1. Check the [README](./SIDEBAR_README.md)
2. Review [usage examples](./sidebar-examples.tsx)
3. Check [type definitions](./types.ts)

---

**Component Version**: 1.0.0  
**Last Updated**: December 24, 2025  
**Maintainer**: EcoTrack AI Team
