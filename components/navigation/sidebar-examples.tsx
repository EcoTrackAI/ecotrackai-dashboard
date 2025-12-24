/**
 * Sidebar Navigation Component - Usage Examples
 *
 * This file demonstrates various ways to use the Sidebar component
 * in your EcoTrack AI dashboard pages.
 */

import { Sidebar } from "@/components/navigation";

/**
 * Example 1: Basic Page Layout
 *
 * The most common usage pattern - sidebar with main content area
 */
export function BasicPageExample() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />

      <main className="lg:ml-64 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1>Your Page Content</h1>
        </div>
      </main>
    </div>
  );
}

/**
 * Example 2: Dashboard with Metrics Cards
 *
 * Overview page with sidebar and metric cards
 */
export function DashboardExample() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />

      <main className="lg:ml-64 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-600 mt-2">
              Monitor your energy consumption in real-time
            </p>
          </div>

          {/* Metrics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-sm font-medium text-gray-600 mb-2">
                Current Usage
              </h3>
              <p className="text-3xl font-bold text-gray-900">2.4 kW</p>
              <p className="text-sm text-green-600 mt-1">↓ 12% lower</p>
            </div>

            {/* Add more metric cards */}
          </div>
        </div>
      </main>
    </div>
  );
}

/**
 * Example 3: Full-Width Content
 *
 * For pages that need more horizontal space
 */
export function FullWidthExample() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />

      <main className="lg:ml-64 transition-all duration-300">
        <div className="px-4 sm:px-6 lg:px-8 py-8">
          {/* Full width content without max-width constraint */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h1>Full Width Chart</h1>
            {/* Chart component */}
          </div>
        </div>
      </main>
    </div>
  );
}

/**
 * Example 4: Nested Layout
 *
 * Page with sidebar and nested navigation or tabs
 */
export function NestedLayoutExample() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />

      <main className="lg:ml-64 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Analytics</h1>
          </div>

          {/* Secondary Navigation (Tabs) */}
          <div className="border-b border-gray-200 mb-6">
            <nav className="flex gap-4">
              <button className="px-4 py-2 border-b-2 border-indigo-600 text-indigo-700 font-medium">
                Overview
              </button>
              <button className="px-4 py-2 text-gray-600 hover:text-gray-900">
                Trends
              </button>
              <button className="px-4 py-2 text-gray-600 hover:text-gray-900">
                Reports
              </button>
            </nav>
          </div>

          {/* Tab Content */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <p>Tab content goes here</p>
          </div>
        </div>
      </main>
    </div>
  );
}

/**
 * Example 5: Settings Page with Sidebar
 *
 * Settings page layout with sections
 */
export function SettingsPageExample() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />

      <main className="lg:ml-64 transition-all duration-300">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
            <p className="text-gray-600 mt-2">
              Manage your preferences and account settings
            </p>
          </div>

          {/* Settings Sections */}
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Account Settings
              </h2>
              {/* Settings form */}
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Notifications
              </h2>
              {/* Notification settings */}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

/**
 * Example 6: Custom Styling
 *
 * Adding custom classes to the sidebar
 */
export function CustomStyledExample() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar className="shadow-lg" />

      <main className="lg:ml-64 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1>Content with custom sidebar styling</h1>
        </div>
      </main>
    </div>
  );
}

/**
 * Notes:
 *
 * 1. Always wrap your page in a container with min-h-screen
 * 2. Use "lg:ml-64" on main to account for sidebar width on desktop
 * 3. Add "transition-all duration-300" for smooth transitions when sidebar collapses
 * 4. Use consistent padding: px-4 sm:px-6 lg:px-8 py-8
 * 5. Set max-width on content containers: max-w-7xl or max-w-4xl
 * 6. Background should be bg-gray-50 for consistency
 *
 * Responsive Behavior:
 * - Mobile: Sidebar hidden, hamburger menu visible
 * - Desktop: Sidebar visible, collapsible with toggle button
 *
 * Active Route:
 * - Sidebar automatically detects current route via usePathname()
 * - Active item is highlighted with indigo background
 */
