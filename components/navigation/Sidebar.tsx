"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  HomeIcon,
  ActivityIcon,
  SlidersIcon,
  BarChart3Icon,
  BrainIcon,
  ClockIcon,
  ChevronLeftIcon,
  MenuIcon,
  XIcon,
} from "lucide-react";

const navigationItems: NavigationItem[] = [
  {
    name: "Overview",
    href: "/",
    icon: HomeIcon,
    description: "Dashboard overview and summary",
  },
  {
    name: "Live Monitoring",
    href: "/live-monitoring",
    icon: ActivityIcon,
    description: "Real-time energy monitoring",
  },
  {
    name: "Automation Control",
    href: "/automation",
    icon: SlidersIcon,
    description: "Device automation and control",
  },
  {
    name: "Energy Analytics",
    href: "/analytics",
    icon: BarChart3Icon,
    description: "Historical data and trends",
  },
  {
    name: "ML Insights",
    href: "/insights",
    icon: BrainIcon,
    description: "AI-powered predictions",
  },
  {
    name: "History",
    href: "/history",
    icon: ClockIcon,
    description: "Historical records and logs",
  },
];

export function Sidebar({ className = "", systemStatus = "offline" }: SidebarProps) {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const isActiveRoute = (href: string) => href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <>
      <button
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        className={`lg:hidden fixed top-20 z-50 p-2 rounded-r-lg bg-white shadow-md border border-l-0 border-gray-200 hover:bg-gray-50 transition-all duration-300 ${
          isMobileOpen ? "left-64" : "left-0"
        }`}
        aria-label={isMobileOpen ? "Close menu" : "Open menu"}
      >
        {isMobileOpen ? <XIcon className="w-6 h-6" /> : <MenuIcon className="w-6 h-6" />}
      </button>

      {isMobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-gray-900 bg-opacity-50 z-40"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      <aside
        className={`fixed top-16 left-0 h-[calc(100vh-4rem)] bg-white border-r border-gray-200 z-40 transition-all duration-300 ${
          isCollapsed ? "w-20" : "w-64"
        } ${isMobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"} ${className}`}
      >
        <div className="flex flex-col h-full">
          <nav className="flex-1 overflow-y-auto py-2 px-2">
            <div className="hidden lg:block mb-2 px-1">
              <button
                onClick={() => setIsCollapsed(!isCollapsed)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors ${
                  isCollapsed ? "justify-center" : ""
                }`}
                aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
              >
                <ChevronLeftIcon
                  className={`w-5 h-5 shrink-0 text-gray-500 transition-transform duration-300 ${
                    isCollapsed ? "rotate-180" : ""
                  }`}
                  aria-hidden="true"
                />
                {!isCollapsed && (
                  <span className="text-sm">Collapse sidebar</span>
                )}
              </button>
            </div>

            <ul className="space-y-1" role="list">
              {navigationItems.map((item) => {
                const isActive = isActiveRoute(item.href);
                const Icon = item.icon;

                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={closeMobileMenu}
                      className={`
                        flex items-center gap-3 px-3 py-2.5 rounded-lg
                        transition-all duration-200
                        focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2
                        ${
                          isActive
                            ? "bg-indigo-50 text-indigo-700 font-medium"
                            : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                        }
                        ${isCollapsed ? "justify-center" : ""}
                      `}
                      aria-label={item.name}
                      aria-current={isActive ? "page" : undefined}
                      title={isCollapsed ? item.name : undefined}
                    >
                      <Icon
                        className={`w-5 h-5 shrink-0 ${
                          isActive ? "text-indigo-600" : "text-gray-500"
                        }`}
                        aria-hidden="true"
                      />
                      {!isCollapsed && (
                        <div className="flex flex-col min-w-0 flex-1">
                          <span className="text-sm truncate">{item.name}</span>
                          {!isActive && (
                            <span className="text-xs text-gray-500 truncate">
                              {item.description}
                            </span>
                          )}
                        </div>
                      )}
                      {isActive && !isCollapsed && (
                        <div
                          className="w-1 h-6 bg-indigo-600 rounded-full"
                          aria-hidden="true"
                        />
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Footer */}
          <div className="border-t border-gray-200 p-4">
            {!isCollapsed ? (
              <div className="text-xs text-gray-500 space-y-1">
                <p className="font-medium text-gray-700">System Status</p>
                <div className="flex items-center gap-2">
                  <div
                    className={`w-2 h-2 rounded-full ${
                      systemStatus === "online"
                        ? "bg-green-500 animate-pulse"
                        : systemStatus === "warning"
                        ? "bg-yellow-500 animate-pulse"
                        : "bg-red-500"
                    }`}
                  />
                  <span>
                    {systemStatus === "online"
                      ? "All systems operational"
                      : systemStatus === "warning"
                      ? "System warnings detected"
                      : "System offline"}
                  </span>
                </div>
              </div>
            ) : (
              <div className="flex justify-center">
                <div
                  className={`w-2 h-2 rounded-full ${
                    systemStatus === "online"
                      ? "bg-green-500 animate-pulse"
                      : systemStatus === "warning"
                      ? "bg-yellow-500 animate-pulse"
                      : "bg-red-500"
                  }`}
                  aria-label={`System ${systemStatus}`}
                  title={`System ${systemStatus}`}
                />
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* Spacer for desktop layout */}
      <div
        className={`hidden lg:block transition-all duration-300 ${
          isCollapsed ? "w-20" : "w-64"
        }`}
        aria-hidden="true"
      />
    </>
  );
}
