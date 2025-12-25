"use client";

import React, { useState, useRef, useEffect } from "react";
// RoomOption type is globally available from types/globals.d.ts

interface RoomSelectorProps {
  /**
   * List of available rooms
   */
  rooms: RoomOption[];

  /**
   * Currently selected room IDs (supports multiple selection)
   */
  selectedRoomIds: string[];

  /**
   * Callback when selection changes
   */
  onChange: (roomIds: string[]) => void;

  /**
   * Whether to allow multiple room selection
   * @default true
   */
  multiple?: boolean;

  /**
   * Optional CSS class
   */
  className?: string;

  /**
   * Whether the selector is in a loading state
   * @default false
   */
  isLoading?: boolean;
}

/**
 * RoomSelector Component
 * Dropdown selector for filtering data by room(s)
 */
export const RoomSelector: React.FC<RoomSelectorProps> = ({
  rooms,
  selectedRoomIds,
  onChange,
  multiple = true,
  className = "",
  isLoading = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleRoomToggle = (roomId: string) => {
    if (multiple) {
      if (selectedRoomIds.includes(roomId)) {
        onChange(selectedRoomIds.filter((id) => id !== roomId));
      } else {
        onChange([...selectedRoomIds, roomId]);
      }
    } else {
      onChange([roomId]);
      setIsOpen(false);
    }
  };

  const handleSelectAll = () => {
    if (selectedRoomIds.length === rooms.length) {
      onChange([]);
    } else {
      onChange(rooms.map((room) => room.id));
    }
  };

  const getDisplayText = () => {
    if (selectedRoomIds.length === 0) {
      return "Select rooms";
    }
    if (selectedRoomIds.length === rooms.length) {
      return "All rooms";
    }
    if (selectedRoomIds.length === 1) {
      const room = rooms.find((r) => r.id === selectedRoomIds[0]);
      return room?.name || "1 room selected";
    }
    return `${selectedRoomIds.length} rooms selected`;
  };

  return (
    <div ref={dropdownRef} className={`relative ${className}`}>
      {/* Selector Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        disabled={isLoading || rooms.length === 0}
        className="w-full flex items-center justify-between px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#6366F1] focus:ring-offset-2 disabled:bg-gray-100 disabled:cursor-not-allowed transition-colors"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-label="Select rooms to filter"
      >
        <div className="flex items-center gap-2">
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
              d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
            />
          </svg>
          <span>{isLoading ? "Loading..." : getDisplayText()}</span>
        </div>
        <svg
          className={`w-5 h-5 text-gray-400 transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {/* Dropdown Menu */}
      {isOpen && !isLoading && rooms.length > 0 && (
        <div
          className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-y-auto"
          role="listbox"
        >
          {/* Select All Option (only for multiple mode) */}
          {multiple && (
            <>
              <button
                onClick={handleSelectAll}
                className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 border-b border-gray-200"
                role="option"
                aria-selected={selectedRoomIds.length === rooms.length}
              >
                <div
                  className={`w-4 h-4 border-2 rounded flex items-center justify-center ${
                    selectedRoomIds.length === rooms.length
                      ? "bg-[#6366F1] border-[#6366F1]"
                      : "border-gray-300"
                  }`}
                >
                  {selectedRoomIds.length === rooms.length && (
                    <svg
                      className="w-3 h-3 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={3}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  )}
                </div>
                <span className="font-medium">All Rooms</span>
              </button>
            </>
          )}

          {/* Room Options */}
          {rooms.map((room) => {
            const isSelected = selectedRoomIds.includes(room.id);
            return (
              <button
                key={room.id}
                onClick={() => handleRoomToggle(room.id)}
                className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                role="option"
                aria-selected={isSelected}
              >
                <div
                  className={`w-4 h-4 border-2 rounded flex items-center justify-center ${
                    isSelected
                      ? "bg-[#6366F1] border-[#6366F1]"
                      : "border-gray-300"
                  }`}
                >
                  {isSelected && (
                    <svg
                      className="w-3 h-3 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={3}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  )}
                </div>
                <div className="flex-1 text-left">
                  <div className="font-medium">{room.name}</div>
                  <div className="text-xs text-gray-500">{room.type}</div>
                </div>
              </button>
            );
          })}
        </div>
      )}

      {/* Empty State */}
      {isOpen && !isLoading && rooms.length === 0 && (
        <div className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-md shadow-lg p-4 text-center text-sm text-gray-500">
          No rooms available
        </div>
      )}
    </div>
  );
};
