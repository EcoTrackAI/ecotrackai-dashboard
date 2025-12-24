/**
 * Global Type Definitions
 * These types are available throughout the application without importing
 */

declare global {
  type SystemStatus = "online" | "offline" | "warning";

  interface WeatherData {
    temperature: number;
    condition: "sunny" | "cloudy" | "rainy" | "snowy" | "partly-cloudy";
    location: string;
  }

  interface UserProfile {
    name: string;
    email: string;
    avatar?: string;
    role?: string;
  }

  interface NotificationItem {
    id: string;
    title: string;
    message: string;
    type: "info" | "warning" | "error" | "success";
    timestamp: Date;
    read: boolean;
  }

  /**
   * Navigation item configuration
   */
  interface NavigationItem {
    /** Display name of the navigation item */
    name: string;

    /** Route path for Next.js navigation */
    href: string;

    /** Lucide React icon component */
    icon: React.ComponentType<{ className?: string }>;

    /** Short description shown when sidebar is expanded */
    description: string;

    /** Optional badge count (for notifications, etc.) */
    badge?: number;

    /** Whether this item is disabled */
    disabled?: boolean;
  }

  /**
   * Sidebar component props
   */
  interface SidebarProps {
    /** Additional CSS classes to apply to the sidebar */
    className?: string;

    /** Optional custom navigation items (overrides default) */
    navigationItems?: NavigationItem[];

    /** Optional callback when navigation item is clicked */
    onNavigate?: (href: string) => void;

    /** Whether the sidebar should start collapsed (desktop only) */
    defaultCollapsed?: boolean;
  }

  /**
   * Sidebar state
   */
  interface SidebarState {
    /** Whether the sidebar is collapsed on desktop */
    isCollapsed: boolean;

    /** Whether the mobile menu is open */
    isMobileOpen: boolean;
  }

  /**
   * Sidebar configuration
   */
  interface SidebarConfig {
    /** Width when expanded (in pixels or tailwind class) */
    expandedWidth: string;

    /** Width when collapsed (in pixels or tailwind class) */
    collapsedWidth: string;

    /** Breakpoint for mobile/desktop switch */
    mobileBreakpoint: string;

    /** Animation duration in milliseconds */
    transitionDuration: number;
  }

  /**
   * Navigation group (for future nested navigation)
   */
  interface NavigationGroup {
    /** Group label */
    label: string;

    /** Items in this group */
    items: NavigationItem[];

    /** Whether the group is collapsible */
    collapsible?: boolean;

    /** Whether the group starts expanded */
    defaultExpanded?: boolean;
  }
}

export {};
