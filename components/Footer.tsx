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
    <footer className="px-2 xs:px-3 sm:px-6 md:px-10 border-t border-gray-200 pt-3 xs:pt-4 sm:pt-6 pb-3 xs:pb-4 sm:pb-8 bg-white">
      <div className="flex flex-col sm:flex-row items-center justify-between space-y-2 xs:space-y-3 sm:space-y-0 text-[10px] xs:text-xs sm:text-sm">
        <div className="flex items-center space-x-1.5 xs:space-x-2 sm:space-x-3 bg-gray-50 px-2 xs:px-3 sm:px-4 py-1 xs:py-1.5 sm:py-2 rounded-md">
          <svg
            className="w-3 h-3 xs:w-4 xs:h-4 sm:w-5 sm:h-5 text-gray-600"
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
          <span className="text-gray-700 font-medium text-[9px] xs:text-[10px] sm:text-xs truncate">
            Last updated:{" "}
            <span className="font-semibold text-gray-900">
              {formatTimestamp(lastUpdated)}
            </span>
          </span>
        </div>

        <div
          className={`flex items-center space-x-1.5 xs:space-x-2 sm:space-x-3 px-2 xs:px-3 sm:px-4 py-1 xs:py-1.5 sm:py-2 rounded-md ${
            isConnected ? "bg-gray-50" : "bg-gray-100"
          }`}
        >
          <div
            className={`w-1.5 h-1.5 xs:w-2 xs:h-2 sm:w-2.5 sm:h-2.5 rounded-full ${
              isConnected
                ? "bg-gray-400"
                : "bg-gray-600"
            }`}
          />
          <span className="text-gray-700 font-medium text-[9px] xs:text-[10px] sm:text-xs truncate">
            Status:{" "}
            <span
              className={`font-semibold ${
                isConnected ? "text-gray-900" : "text-gray-700"
              }`}
            >
              {isConnected ? "Connected" : "Disconnected"}
            </span>
          </span>
        </div>

        <div className="text-gray-500 font-medium text-[10px] sm:text-xs md:text-sm">
          © 2025 EcoTrack AI
        </div>
      </div>
    </footer>
  );
}
