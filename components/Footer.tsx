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
    <footer className="mt-12 border-t border-gray-200 pt-6 pb-8">
      <div className="flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0 text-sm text-gray-600">
        <div className="flex items-center space-x-2">
          <svg
            className="w-4 h-4"
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
          <span>
            Last updated:{" "}
            <span className="font-medium text-gray-900">
              {formatTimestamp(lastUpdated)}
            </span>
          </span>
        </div>

        <div className="flex items-center space-x-2">
          <div
            className={`w-2 h-2 rounded-full ${
              isConnected ? "bg-green-500" : "bg-red-500"
            }`}
          />
          <span>
            Device Status:{" "}
            <span className="font-medium text-gray-900">
              {isConnected ? "Connected" : "Disconnected"}
            </span>
          </span>
        </div>

        <div className="text-gray-500">© 2025 EcoTrack AI</div>
      </div>
    </footer>
  );
}
