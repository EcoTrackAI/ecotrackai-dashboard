import { AutomationControlPanel } from "@/components/automation";

export default function AutomationPage() {
  return (
    <div className="min-h-screen bg-[#F8FAFC] px-4 sm:px-6 lg:px-8 py-8">
      <div className="max-w-7xl mx-auto">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#111827] mb-2">
            Automation Control
          </h1>
          <p className="text-[#6B7280]">
            Manage device automation, monitor power consumption, and control
            smart home appliances.
          </p>
        </div>

        {/* Control Panel */}
        <AutomationControlPanel />
      </div>
    </div>
  );
}
