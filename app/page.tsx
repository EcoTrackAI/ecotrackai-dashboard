export default function Home() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Overview</h1>
        <p className="text-gray-600">
          Dashboard overview and energy consumption summary.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Sample metric cards */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-600">Current Usage</h3>
            <span className="text-xs text-gray-500">Live</span>
          </div>
          <p className="text-3xl font-bold text-gray-900">2.4 kW</p>
          <p className="text-sm text-green-600 mt-1">↓ 12% from yesterday</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-600">Today's Cost</h3>
            <span className="text-xs text-gray-500">Updated</span>
          </div>
          <p className="text-3xl font-bold text-gray-900">$12.45</p>
          <p className="text-sm text-green-600 mt-1">↓ $1.20 saved</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-600">
              Active Devices
            </h3>
            <span className="text-xs text-gray-500">Online</span>
          </div>
          <p className="text-3xl font-bold text-gray-900">8</p>
          <p className="text-sm text-gray-600 mt-1">of 12 devices</p>
        </div>
      </div>
    </div>
  );
}
