"use client";

interface FooterProps {
  lastUpdated: number | null;
  isConnected: boolean;
}

export default function Footer({ lastUpdated, isConnected }: FooterProps) {
  const formatTimestamp = (timestamp: number | null) => {
    if (!timestamp) return "Never";
    const date = new Date(timestamp);
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  return (
    <footer className="px-4 sm:px-6 lg:px-8 border-t border-gray-200 pt-4 pb-6 bg-white/80 backdrop-blur-sm animate-fadeIn">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between space-y-3 sm:space-y-0 text-xs sm:text-sm">
        <div className="flex items-center space-x-2 bg-gray-50 px-3 py-2 rounded-lg">
          <svg
            className="w-4 h-4 text-gray-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span className="text-gray-600 font-medium text-xs">
            Last updated:{" "}
            <span className="font-semibold text-gray-900">
              {formatTimestamp(lastUpdated)}
            </span>
          </span>
        </div>

        <div
          className={`flex items-center space-x-2 px-3 py-2 rounded-lg ${
            isConnected
              ? "bg-emerald-50"
              : "bg-rose-50"
          }`}
        >
          <div
            className={`w-2 h-2 rounded-full ${
              isConnected
                ? "bg-emerald-500 animate-pulse-subtle"
                : "bg-rose-500"
            }`}
          />
          <span
            className={`text-xs font-medium ${
              isConnected ? "text-emerald-700" : "text-rose-700"
            }`}
          >
            Status:{" "}
            <span className="font-semibold">
              {isConnected ? "Connected" : "Disconnected"}
            </span>
          </span>
        </div>

        <div className="text-gray-500 font-medium text-xs">
          © 2025 EcoTrack AI
        </div>
      </div>
    </footer>
  );
}
