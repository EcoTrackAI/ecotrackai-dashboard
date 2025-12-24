import { Sidebar } from "@/components/navigation";

export default function SidebarDemo() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />

      <main className="lg:ml-64 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Sidebar Navigation Demo
            </h1>
            <p className="text-gray-600 mb-6">
              This is a demonstration of the collapsible sidebar navigation
              component.
            </p>

            <div className="space-y-4">
              <div className="bg-gray-50 rounded-lg p-4">
                <h2 className="text-lg font-semibold text-gray-900 mb-2">
                  Features
                </h2>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li>
                    Collapsible sidebar for desktop (click the arrow icon)
                  </li>
                  <li>Mobile-responsive with hamburger menu</li>
                  <li>Active route highlighting with visual indicators</li>
                  <li>Smooth animations and transitions</li>
                  <li>Accessible with ARIA labels and keyboard navigation</li>
                  <li>Icons from lucide-react library</li>
                  <li>System status indicator in footer</li>
                  <li>Item descriptions shown when expanded</li>
                </ul>
              </div>

              <div className="bg-indigo-50 rounded-lg p-4">
                <h2 className="text-lg font-semibold text-indigo-900 mb-2">
                  Navigation Items
                </h2>
                <ul className="space-y-2 text-indigo-700">
                  <li>✓ Overview - Dashboard overview and summary</li>
                  <li>✓ Live Monitoring - Real-time energy monitoring</li>
                  <li>✓ Automation Control - Device automation and control</li>
                  <li>✓ Energy Analytics - Historical data and trends</li>
                  <li>✓ ML Insights - AI-powered predictions</li>
                  <li>✓ History - Historical records and logs</li>
                  <li>✓ Settings - App settings and preferences</li>
                </ul>
              </div>

              <div className="bg-green-50 rounded-lg p-4">
                <h2 className="text-lg font-semibold text-green-900 mb-2">
                  Design System
                </h2>
                <ul className="list-disc list-inside space-y-2 text-green-700">
                  <li>Clean, minimalist design with high readability</li>
                  <li>Primary accent color: Indigo (#6366F1)</li>
                  <li>Consistent spacing and typography</li>
                  <li>Smooth hover and focus states</li>
                  <li>Professional and academic aesthetic</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
