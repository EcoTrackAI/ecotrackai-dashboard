"use client";

import { useState } from "react";

// DateRangePickerProps, DateRange, and PresetOption are globally available from types/globals.d.ts

const DATE_PRESETS: PresetOption[] = [
  {
    label: "Today",
    getValue: () => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const end = new Date();
      end.setHours(23, 59, 59, 999);
      return { start: today, end, label: "Today" };
    },
  },
  {
    label: "Yesterday",
    getValue: () => {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      yesterday.setHours(0, 0, 0, 0);
      const end = new Date(yesterday);
      end.setHours(23, 59, 59, 999);
      return { start: yesterday, end, label: "Yesterday" };
    },
  },
  {
    label: "Last 7 Days",
    getValue: () => {
      const end = new Date();
      const start = new Date();
      start.setDate(start.getDate() - 7);
      start.setHours(0, 0, 0, 0);
      return { start, end, label: "Last 7 Days" };
    },
  },
  {
    label: "Last 30 Days",
    getValue: () => {
      const end = new Date();
      const start = new Date();
      start.setDate(start.getDate() - 30);
      start.setHours(0, 0, 0, 0);
      return { start, end, label: "Last 30 Days" };
    },
  },
  {
    label: "This Month",
    getValue: () => {
      const start = new Date();
      start.setDate(1);
      start.setHours(0, 0, 0, 0);
      const end = new Date();
      return { start, end, label: "This Month" };
    },
  },
  {
    label: "Last Month",
    getValue: () => {
      const start = new Date();
      start.setMonth(start.getMonth() - 1);
      start.setDate(1);
      start.setHours(0, 0, 0, 0);
      const end = new Date(start);
      end.setMonth(end.getMonth() + 1);
      end.setDate(0);
      end.setHours(23, 59, 59, 999);
      return { start, end, label: "Last Month" };
    },
  },
];

/**
 * DateRangePicker Component
 * Allows users to select a date range with preset options or custom dates
 */
export const DateRangePicker: React.FC<DateRangePickerProps> = ({
  value,
  onChange,
  className = "",
}) => {
  const [showCustom, setShowCustom] = useState(false);
  const [customStart, setCustomStart] = useState(
    value.start.toISOString().split("T")[0],
  );
  const [customEnd, setCustomEnd] = useState(
    value.end.toISOString().split("T")[0],
  );

  const handlePresetClick = (preset: PresetOption) => {
    const range = preset.getValue();
    onChange(range);
    setShowCustom(false);
  };

  const handleCustomApply = () => {
    const start = new Date(customStart);
    const end = new Date(customEnd);
    end.setHours(23, 59, 59, 999);

    if (start <= end) {
      onChange({ start, end, label: "Custom Range" });
      setShowCustom(false);
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className={`relative ${className}`}>
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        {/* Current Selection Display */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Date Range
          </label>
          <div className="flex items-center gap-2 text-sm text-gray-900 bg-gray-50 rounded-md px-3 py-2 border border-gray-200">
            <svg
              className="w-4 h-4 text-gray-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <span className="font-medium">
              {formatDate(value.start)} - {formatDate(value.end)}
            </span>
            {value.label && (
              <span className="text-gray-500">({value.label})</span>
            )}
          </div>
        </div>

        {/* Preset Buttons */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Quick Select
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {DATE_PRESETS.map((preset) => (
              <button
                key={preset.label}
                onClick={() => handlePresetClick(preset)}
                className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 hover:border-[#6366F1] hover:text-[#6366F1] focus:outline-none focus:ring-2 focus:ring-[#6366F1] focus:ring-offset-2 transition-colors"
                aria-label={`Select ${preset.label}`}
              >
                {preset.label}
              </button>
            ))}
          </div>
        </div>

        {/* Custom Range Toggle */}
        <button
          onClick={() => setShowCustom(!showCustom)}
          className="w-full px-3 py-2 text-sm font-medium text-[#6366F1] bg-indigo-50 border border-indigo-200 rounded-md hover:bg-indigo-100 focus:outline-none focus:ring-2 focus:ring-[#6366F1] focus:ring-offset-2 transition-colors"
          aria-expanded={showCustom}
        >
          {showCustom ? "Hide" : "Show"} Custom Range
        </button>

        {/* Custom Date Inputs */}
        {showCustom && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <div>
                <label
                  htmlFor="start-date"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Start Date
                </label>
                <input
                  id="start-date"
                  type="date"
                  value={customStart}
                  onChange={(e) => setCustomStart(e.target.value)}
                  max={customEnd}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#6366F1] focus:border-transparent"
                />
              </div>
              <div>
                <label
                  htmlFor="end-date"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  End Date
                </label>
                <input
                  id="end-date"
                  type="date"
                  value={customEnd}
                  onChange={(e) => setCustomEnd(e.target.value)}
                  min={customStart}
                  max={new Date().toISOString().split("T")[0]}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#6366F1] focus:border-transparent"
                />
              </div>
            </div>
            <button
              onClick={handleCustomApply}
              disabled={!customStart || !customEnd}
              className="w-full px-4 py-2 text-sm font-medium text-white bg-[#6366F1] rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-[#6366F1] focus:ring-offset-2 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
              aria-label="Apply custom date range"
            >
              Apply Custom Range
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
