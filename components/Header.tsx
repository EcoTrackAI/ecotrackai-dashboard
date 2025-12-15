interface HeaderProps {
  isOnline: boolean;
}

export default function Header({ isOnline }: HeaderProps) {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-linear-to-br from-green-400 to-blue-500 rounded-lg flex items-center justify-center">
              <svg
                className="w-6 h-6 text-white"
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
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">EcoTrack AI</h1>
              <p className="text-xs text-gray-500">
                Smart Environment Dashboard
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <div
              className={`flex items-center space-x-2 px-3 py-1.5 rounded-full text-sm font-medium ${
                isOnline
                  ? "bg-green-100 text-green-800"
                  : "bg-red-100 text-red-800"
              }`}
            >
              <div
                className={`w-2 h-2 rounded-full ${
                  isOnline ? "bg-green-500" : "bg-red-500"
                } animate-pulse`}
              />
              <span>{isOnline ? "Online" : "Offline"}</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
