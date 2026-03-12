"use client";

import { Info } from "lucide-react";

interface AutomationInfoTooltipProps {
  applianceName: string;
  info?: ApplianceAutomationInfo;
}

export default function AutomationInfoTooltip({
  applianceName,
  info,
}: AutomationInfoTooltipProps) {
  if (!info) return null;

  return (
    <div className="relative group">
      <button
        type="button"
        aria-label={`Show automation info for ${applianceName}`}
        className="inline-flex h-7 w-7 items-center justify-center rounded-full text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-1"
      >
        <Info className="h-4 w-4" />
      </button>

      <div className="pointer-events-none absolute right-0 top-8 z-20 w-72 rounded-lg border border-gray-200 bg-white p-3 text-xs text-gray-600 shadow-lg opacity-0 transition-opacity duration-150 group-hover:opacity-100 group-focus-within:opacity-100">
        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-500">
          Motion Relay Policy
        </p>

        <p className="text-xs text-gray-700">
          Motion from Firebase:{" "}
          <span className="font-semibold">{info.motionFromFirebase}</span>
        </p>
        <p className="mt-1 text-xs text-gray-700">
          Control mode: <span className="font-semibold">{info.controlMode}</span>
        </p>
        <p className="mt-1 text-xs text-gray-700">
          Relay action: <span className="font-semibold">{info.relayAction}</span>
        </p>
        <p className="mt-1 text-xs text-gray-700">
          Relay state snapshot:{" "}
          <span className="font-semibold">{info.relayStateSnapshot}</span>
        </p>
        <p className="mt-1 text-xs text-gray-700">
          Sync status: <span className="font-semibold">{info.syncStatus}</span>
        </p>
        <p className="mt-1 text-xs text-gray-700">
          Last policy update:{" "}
          <span className="font-semibold">{info.lastPolicyUpdate}</span>
        </p>

        {info.error && <p className="mt-2 text-xs text-red-600">{info.error}</p>}
      </div>
    </div>
  );
}
