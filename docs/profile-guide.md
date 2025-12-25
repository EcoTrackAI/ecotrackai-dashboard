# User Profile Page

Professional user profile layout for the EcoTrackAI Smart Energy Dashboard.

## Features

- **Clean, Academic Design**: Light color scheme with card-based layout
- **Responsive**: Mobile-first design that adapts to tablet and desktop
- **TypeScript**: Fully typed components and data structures
- **Accessible**: Semantic HTML with ARIA labels
- **Modular**: Reusable ProfileCard components

## Components

### ProfileCard

Reusable card component for profile sections with consistent styling.

### ProfileField

Displays label-value pairs with optional icons.

### ToggleField

Shows enabled/disabled status with visual toggle indicator.

## Data Structure

The page accepts `ProfileData` which includes:

- **user**: Name, email, role, avatar
- **systemInfo**: Connected devices, active rooms, last login
- **preferences**: Theme, notifications, automation mode

## Usage

Replace the `mockProfileData` constant with actual data fetching:

```typescript
// Example with API fetch
const fetchProfileData = async (): Promise<ProfileData> => {
  const response = await fetch("/api/profile");
  return response.json();
};
```

## Color Scheme

- Page background: `#F8FAFC`
- Card background: `#FFFFFF`
- Primary accent: `#6366F1` (indigo)
- Success: `#16A34A` (green)
- Warning: `#FB923C` (orange)
- Error: `#DC2626` (red)
- Text: `#111827` (dark gray)

## Customization

To customize the profile page:

1. Update mock data in `page.tsx`
2. Modify ProfileCard components in `components/profile/`
3. Add additional fields using ProfileField or ToggleField
4. Implement actual edit and logout handlers

## Integration

To navigate to the profile page, add a link in your navigation:

```tsx
<Link href="/profile">Profile</Link>
```
