"use client";

import { useState, useEffect } from "react";
import {
  Room,
  Appliance,
  TariffSettings,
  DataSamplingSettings,
  NotificationSettings,
  DEFAULT_ROOMS,
  DEFAULT_APPLIANCES,
  DEFAULT_TARIFF,
  DEFAULT_DATA_SAMPLING,
  DEFAULT_NOTIFICATIONS,
} from "@/types/settings";

export default function SettingsPage() {
  const [rooms, setRooms] = useState<Room[]>(DEFAULT_ROOMS);
  const [appliances, setAppliances] = useState<Appliance[]>(DEFAULT_APPLIANCES);
  const [tariff, setTariff] = useState<TariffSettings>(DEFAULT_TARIFF);
  const [dataSampling, setDataSampling] = useState<DataSamplingSettings>(
    DEFAULT_DATA_SAMPLING
  );
  const [notifications, setNotifications] = useState<NotificationSettings>(
    DEFAULT_NOTIFICATIONS
  );
  const [activeTab, setActiveTab] = useState<
    "rooms" | "appliances" | "tariff" | "sampling" | "notifications"
  >("rooms");
  const [saveStatus, setSaveStatus] = useState<
    "idle" | "saving" | "saved" | "error"
  >("idle");

  // Load settings from localStorage on mount
  useEffect(() => {
    const savedSettings = localStorage.getItem("systemSettings");
    if (savedSettings) {
      const parsed = JSON.parse(savedSettings);
      setRooms(parsed.rooms || DEFAULT_ROOMS);
      setAppliances(parsed.appliances || DEFAULT_APPLIANCES);
      setTariff(parsed.tariff || DEFAULT_TARIFF);
      setDataSampling(parsed.dataSampling || DEFAULT_DATA_SAMPLING);
      setNotifications(parsed.notifications || DEFAULT_NOTIFICATIONS);
    }
  }, []);

  const handleSaveSettings = () => {
    setSaveStatus("saving");
    try {
      const settings = {
        rooms,
        appliances,
        tariff,
        dataSampling,
        notifications,
      };
      localStorage.setItem("systemSettings", JSON.stringify(settings));
      setSaveStatus("saved");
      setTimeout(() => setSaveStatus("idle"), 2000);
    } catch (error) {
      console.error("Error saving settings:", error);
      setSaveStatus("error");
      setTimeout(() => setSaveStatus("idle"), 2000);
    }
  };

  // Room management functions
  const addRoom = () => {
    const newRoom: Room = {
      id: `room-${Date.now()}`,
      name: "New Room",
      isEnabled: true,
    };
    setRooms([...rooms, newRoom]);
  };

  const updateRoom = (id: string, updates: Partial<Room>) => {
    setRooms(
      rooms.map((room) => (room.id === id ? { ...room, ...updates } : room))
    );
  };

  const deleteRoom = (id: string) => {
    setRooms(rooms.filter((room) => room.id !== id));
    setAppliances(appliances.filter((app) => app.roomId !== id));
  };

  // Appliance management functions
  const addAppliance = () => {
    const newAppliance: Appliance = {
      id: `appliance-${Date.now()}`,
      name: "New Appliance",
      roomId: rooms[0]?.id || "",
      powerRating: 100,
      isEnabled: true,
    };
    setAppliances([...appliances, newAppliance]);
  };

  const updateAppliance = (id: string, updates: Partial<Appliance>) => {
    setAppliances(
      appliances.map((app) => (app.id === id ? { ...app, ...updates } : app))
    );
  };

  const deleteAppliance = (id: string) => {
    setAppliances(appliances.filter((app) => app.id !== id));
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] px-4 sm:px-6 lg:px-8 py-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#111827] mb-2">Settings</h1>
          <p className="text-[#6B7280]">
            Configure your smart home system, rooms, appliances, and energy
            preferences
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white rounded-lg border border-gray-200 mb-6">
          <nav className="flex overflow-x-auto" aria-label="Settings tabs">
            {[
              { id: "rooms" as const, label: "Rooms", icon: "🏠" },
              { id: "appliances" as const, label: "Appliances", icon: "⚡" },
              { id: "tariff" as const, label: "Tariff", icon: "💰" },
              { id: "sampling" as const, label: "Data Sampling", icon: "📊" },
              {
                id: "notifications" as const,
                label: "Notifications",
                icon: "🔔",
              },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-4 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                  activeTab === tab.id
                    ? "border-[#6366F1] text-[#6366F1]"
                    : "border-transparent text-[#6B7280] hover:text-[#111827] hover:border-gray-300"
                }`}
                aria-current={activeTab === tab.id ? "page" : undefined}
              >
                <span aria-hidden="true">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Content Area */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          {/* Rooms Tab */}
          {activeTab === "rooms" && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-semibold text-[#111827]">
                    Room Configuration
                  </h2>
                  <p className="text-sm text-[#6B7280] mt-1">
                    Manage the rooms in your smart home
                  </p>
                </div>
                <button
                  onClick={addRoom}
                  className="px-4 py-2 bg-[#6366F1] text-white rounded-lg hover:bg-[#5558E3] transition-colors font-medium"
                >
                  + Add Room
                </button>
              </div>

              <div className="space-y-4">
                {rooms.map((room) => (
                  <div
                    key={room.id}
                    className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors"
                  >
                    <input
                      type="checkbox"
                      checked={room.isEnabled}
                      onChange={(e) =>
                        updateRoom(room.id, { isEnabled: e.target.checked })
                      }
                      className="w-5 h-5 text-[#6366F1] rounded focus:ring-2 focus:ring-[#6366F1] focus:ring-offset-2"
                      aria-label={`Enable ${room.name}`}
                    />
                    <input
                      type="text"
                      value={room.name}
                      onChange={(e) =>
                        updateRoom(room.id, { name: e.target.value })
                      }
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6366F1] focus:border-transparent"
                      placeholder="Room name"
                    />
                    <span className="text-sm text-[#6B7280] w-24">
                      {
                        appliances.filter((app) => app.roomId === room.id)
                          .length
                      }{" "}
                      appliances
                    </span>
                    <button
                      onClick={() => deleteRoom(room.id)}
                      className="px-3 py-2 text-[#DC2626] hover:bg-red-50 rounded-lg transition-colors"
                      aria-label={`Delete ${room.name}`}
                    >
                      Delete
                    </button>
                  </div>
                ))}
                {rooms.length === 0 && (
                  <p className="text-center text-[#6B7280] py-8">
                    No rooms configured. Add a room to get started.
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Appliances Tab */}
          {activeTab === "appliances" && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-semibold text-[#111827]">
                    Appliance Power Ratings
                  </h2>
                  <p className="text-sm text-[#6B7280] mt-1">
                    Configure appliances and their power consumption
                  </p>
                </div>
                <button
                  onClick={addAppliance}
                  className="px-4 py-2 bg-[#6366F1] text-white rounded-lg hover:bg-[#5558E3] transition-colors font-medium"
                  disabled={rooms.length === 0}
                >
                  + Add Appliance
                </button>
              </div>

              <div className="space-y-4">
                {appliances.map((appliance) => (
                  <div
                    key={appliance.id}
                    className="grid grid-cols-1 md:grid-cols-12 gap-4 p-4 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors"
                  >
                    <div className="md:col-span-1 flex items-center">
                      <input
                        type="checkbox"
                        checked={appliance.isEnabled}
                        onChange={(e) =>
                          updateAppliance(appliance.id, {
                            isEnabled: e.target.checked,
                          })
                        }
                        className="w-5 h-5 text-[#6366F1] rounded focus:ring-2 focus:ring-[#6366F1] focus:ring-offset-2"
                        aria-label={`Enable ${appliance.name}`}
                      />
                    </div>
                    <div className="md:col-span-4">
                      <label className="block text-xs text-[#6B7280] mb-1">
                        Appliance Name
                      </label>
                      <input
                        type="text"
                        value={appliance.name}
                        onChange={(e) =>
                          updateAppliance(appliance.id, {
                            name: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6366F1] focus:border-transparent"
                        placeholder="e.g., Air Conditioner"
                      />
                    </div>
                    <div className="md:col-span-3">
                      <label className="block text-xs text-[#6B7280] mb-1">
                        Room
                      </label>
                      <select
                        value={appliance.roomId}
                        onChange={(e) =>
                          updateAppliance(appliance.id, {
                            roomId: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6366F1] focus:border-transparent"
                      >
                        {rooms.map((room) => (
                          <option key={room.id} value={room.id}>
                            {room.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="md:col-span-3">
                      <label className="block text-xs text-[#6B7280] mb-1">
                        Power Rating (W)
                      </label>
                      <input
                        type="number"
                        value={appliance.powerRating}
                        onChange={(e) =>
                          updateAppliance(appliance.id, {
                            powerRating: Number(e.target.value),
                          })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6366F1] focus:border-transparent"
                        min="0"
                        step="10"
                      />
                    </div>
                    <div className="md:col-span-1 flex items-end">
                      <button
                        onClick={() => deleteAppliance(appliance.id)}
                        className="w-full px-3 py-2 text-[#DC2626] hover:bg-red-50 rounded-lg transition-colors"
                        aria-label={`Delete ${appliance.name}`}
                      >
                        ×
                      </button>
                    </div>
                  </div>
                ))}
                {appliances.length === 0 && (
                  <p className="text-center text-[#6B7280] py-8">
                    No appliances configured. Add an appliance to get started.
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Tariff Tab */}
          {activeTab === "tariff" && (
            <div>
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-[#111827]">
                  Electricity Tariff
                </h2>
                <p className="text-sm text-[#6B7280] mt-1">
                  Configure your electricity pricing
                </p>
              </div>

              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label
                      htmlFor="currency"
                      className="block text-sm font-medium text-[#111827] mb-2"
                    >
                      Currency
                    </label>
                    <select
                      id="currency"
                      value={tariff.currency}
                      onChange={(e) =>
                        setTariff({ ...tariff, currency: e.target.value })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6366F1] focus:border-transparent"
                    >
                      <option value="USD">USD ($)</option>
                      <option value="EUR">EUR (€)</option>
                      <option value="GBP">GBP (£)</option>
                      <option value="INR">INR (₹)</option>
                      <option value="JPY">JPY (¥)</option>
                    </select>
                  </div>

                  <div>
                    <label
                      htmlFor="unitPrice"
                      className="block text-sm font-medium text-[#111827] mb-2"
                    >
                      Unit Price (per kWh)
                    </label>
                    <input
                      id="unitPrice"
                      type="number"
                      value={tariff.unitPrice}
                      onChange={(e) =>
                        setTariff({
                          ...tariff,
                          unitPrice: Number(e.target.value),
                        })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6366F1] focus:border-transparent"
                      min="0"
                      step="0.01"
                    />
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-6">
                  <div className="flex items-center gap-3 mb-4">
                    <input
                      id="timeBasedPricing"
                      type="checkbox"
                      checked={tariff.timeBasedPricing}
                      onChange={(e) =>
                        setTariff({
                          ...tariff,
                          timeBasedPricing: e.target.checked,
                        })
                      }
                      className="w-5 h-5 text-[#6366F1] rounded focus:ring-2 focus:ring-[#6366F1] focus:ring-offset-2"
                    />
                    <label
                      htmlFor="timeBasedPricing"
                      className="text-sm font-medium text-[#111827]"
                    >
                      Enable Time-Based Pricing (Peak/Off-Peak)
                    </label>
                  </div>

                  {tariff.timeBasedPricing && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pl-8 border-l-2 border-[#6366F1]">
                      <div>
                        <label
                          htmlFor="peakRate"
                          className="block text-sm font-medium text-[#111827] mb-2"
                        >
                          Peak Rate (per kWh)
                        </label>
                        <input
                          id="peakRate"
                          type="number"
                          value={tariff.peakRate || 0}
                          onChange={(e) =>
                            setTariff({
                              ...tariff,
                              peakRate: Number(e.target.value),
                            })
                          }
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6366F1] focus:border-transparent"
                          min="0"
                          step="0.01"
                        />
                      </div>

                      <div>
                        <label
                          htmlFor="offPeakRate"
                          className="block text-sm font-medium text-[#111827] mb-2"
                        >
                          Off-Peak Rate (per kWh)
                        </label>
                        <input
                          id="offPeakRate"
                          type="number"
                          value={tariff.offPeakRate || 0}
                          onChange={(e) =>
                            setTariff({
                              ...tariff,
                              offPeakRate: Number(e.target.value),
                            })
                          }
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6366F1] focus:border-transparent"
                          min="0"
                          step="0.01"
                        />
                      </div>

                      <div>
                        <label
                          htmlFor="peakStartHour"
                          className="block text-sm font-medium text-[#111827] mb-2"
                        >
                          Peak Start Hour (0-23)
                        </label>
                        <input
                          id="peakStartHour"
                          type="number"
                          value={tariff.peakStartHour || 0}
                          onChange={(e) =>
                            setTariff({
                              ...tariff,
                              peakStartHour: Number(e.target.value),
                            })
                          }
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6366F1] focus:border-transparent"
                          min="0"
                          max="23"
                        />
                      </div>

                      <div>
                        <label
                          htmlFor="peakEndHour"
                          className="block text-sm font-medium text-[#111827] mb-2"
                        >
                          Peak End Hour (0-23)
                        </label>
                        <input
                          id="peakEndHour"
                          type="number"
                          value={tariff.peakEndHour || 0}
                          onChange={(e) =>
                            setTariff({
                              ...tariff,
                              peakEndHour: Number(e.target.value),
                            })
                          }
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6366F1] focus:border-transparent"
                          min="0"
                          max="23"
                        />
                      </div>
                    </div>
                  )}
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-sm text-blue-900">
                    <strong>Tip:</strong> Check your electricity bill for
                    accurate pricing information. Time-based pricing can help
                    you identify cost-saving opportunities.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Data Sampling Tab */}
          {activeTab === "sampling" && (
            <div>
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-[#111827]">
                  Data Sampling Configuration
                </h2>
                <p className="text-sm text-[#6B7280] mt-1">
                  Configure how sensor data is collected and stored
                </p>
              </div>

              <div className="space-y-6">
                <div>
                  <label
                    htmlFor="interval"
                    className="block text-sm font-medium text-[#111827] mb-2"
                  >
                    Sampling Interval (seconds)
                  </label>
                  <input
                    id="interval"
                    type="number"
                    value={dataSampling.interval}
                    onChange={(e) =>
                      setDataSampling({
                        ...dataSampling,
                        interval: Number(e.target.value),
                      })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6366F1] focus:border-transparent"
                    min="1"
                    max="3600"
                  />
                  <p className="text-xs text-[#6B7280] mt-1">
                    How often to collect data from sensors (1-3600 seconds).
                    Lower values provide more detail but use more storage.
                  </p>
                </div>

                <div>
                  <label
                    htmlFor="retentionDays"
                    className="block text-sm font-medium text-[#111827] mb-2"
                  >
                    Data Retention (days)
                  </label>
                  <input
                    id="retentionDays"
                    type="number"
                    value={dataSampling.retentionDays}
                    onChange={(e) =>
                      setDataSampling({
                        ...dataSampling,
                        retentionDays: Number(e.target.value),
                      })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6366F1] focus:border-transparent"
                    min="7"
                    max="365"
                  />
                  <p className="text-xs text-[#6B7280] mt-1">
                    How long to keep historical data (7-365 days). Older data
                    will be automatically deleted.
                  </p>
                </div>

                <div>
                  <label
                    htmlFor="aggregationMethod"
                    className="block text-sm font-medium text-[#111827] mb-2"
                  >
                    Aggregation Method
                  </label>
                  <select
                    id="aggregationMethod"
                    value={dataSampling.aggregationMethod}
                    onChange={(e) =>
                      setDataSampling({
                        ...dataSampling,
                        aggregationMethod: e.target.value as
                          | "average"
                          | "sum"
                          | "max"
                          | "min",
                      })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6366F1] focus:border-transparent"
                  >
                    <option value="average">Average</option>
                    <option value="sum">Sum</option>
                    <option value="max">Maximum</option>
                    <option value="min">Minimum</option>
                  </select>
                  <p className="text-xs text-[#6B7280] mt-1">
                    How to combine multiple data points when displaying charts
                    and analytics.
                  </p>
                </div>

                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <p className="text-sm text-yellow-900">
                    <strong>Note:</strong> Shorter sampling intervals (
                    {dataSampling.interval}s) will increase database storage and
                    network usage. Recommended: 60s for most applications.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Notifications Tab */}
          {activeTab === "notifications" && (
            <div>
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-[#111827]">
                  Notification Preferences
                </h2>
                <p className="text-sm text-[#6B7280] mt-1">
                  Configure alerts and notifications
                </p>
              </div>

              <div className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <input
                      id="emailNotifications"
                      type="checkbox"
                      checked={notifications.emailNotifications}
                      onChange={(e) =>
                        setNotifications({
                          ...notifications,
                          emailNotifications: e.target.checked,
                        })
                      }
                      className="w-5 h-5 mt-0.5 text-[#6366F1] rounded focus:ring-2 focus:ring-[#6366F1] focus:ring-offset-2"
                    />
                    <div>
                      <label
                        htmlFor="emailNotifications"
                        className="text-sm font-medium text-[#111827]"
                      >
                        Email Notifications
                      </label>
                      <p className="text-xs text-[#6B7280] mt-0.5">
                        Receive alerts and updates via email
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <input
                      id="pushNotifications"
                      type="checkbox"
                      checked={notifications.pushNotifications}
                      onChange={(e) =>
                        setNotifications({
                          ...notifications,
                          pushNotifications: e.target.checked,
                        })
                      }
                      className="w-5 h-5 mt-0.5 text-[#6366F1] rounded focus:ring-2 focus:ring-[#6366F1] focus:ring-offset-2"
                    />
                    <div>
                      <label
                        htmlFor="pushNotifications"
                        className="text-sm font-medium text-[#111827]"
                      >
                        Push Notifications
                      </label>
                      <p className="text-xs text-[#6B7280] mt-0.5">
                        Receive real-time browser notifications
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <input
                      id="offlineDeviceAlert"
                      type="checkbox"
                      checked={notifications.offlineDeviceAlert}
                      onChange={(e) =>
                        setNotifications({
                          ...notifications,
                          offlineDeviceAlert: e.target.checked,
                        })
                      }
                      className="w-5 h-5 mt-0.5 text-[#6366F1] rounded focus:ring-2 focus:ring-[#6366F1] focus:ring-offset-2"
                    />
                    <div>
                      <label
                        htmlFor="offlineDeviceAlert"
                        className="text-sm font-medium text-[#111827]"
                      >
                        Offline Device Alerts
                      </label>
                      <p className="text-xs text-[#6B7280] mt-0.5">
                        Get notified when devices go offline
                      </p>
                    </div>
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-6">
                  <div className="flex items-start gap-3 mb-4">
                    <input
                      id="highUsageAlert"
                      type="checkbox"
                      checked={notifications.highUsageAlert}
                      onChange={(e) =>
                        setNotifications({
                          ...notifications,
                          highUsageAlert: e.target.checked,
                        })
                      }
                      className="w-5 h-5 mt-0.5 text-[#6366F1] rounded focus:ring-2 focus:ring-[#6366F1] focus:ring-offset-2"
                    />
                    <div className="flex-1">
                      <label
                        htmlFor="highUsageAlert"
                        className="text-sm font-medium text-[#111827]"
                      >
                        High Usage Alerts
                      </label>
                      <p className="text-xs text-[#6B7280] mt-0.5">
                        Alert when power consumption exceeds threshold
                      </p>
                    </div>
                  </div>

                  {notifications.highUsageAlert && (
                    <div className="pl-8 border-l-2 border-[#6366F1]">
                      <label
                        htmlFor="highUsageThreshold"
                        className="block text-sm font-medium text-[#111827] mb-2"
                      >
                        Threshold (Watts)
                      </label>
                      <input
                        id="highUsageThreshold"
                        type="number"
                        value={notifications.highUsageThreshold}
                        onChange={(e) =>
                          setNotifications({
                            ...notifications,
                            highUsageThreshold: Number(e.target.value),
                          })
                        }
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6366F1] focus:border-transparent"
                        min="0"
                        step="100"
                      />
                      <p className="text-xs text-[#6B7280] mt-1">
                        You'll be alerted when total power usage exceeds this
                        value
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Save Button */}
        <div className="mt-6 flex items-center justify-end gap-4">
          {saveStatus === "saved" && (
            <span className="text-sm text-[#16A34A] font-medium">
              ✓ Settings saved successfully
            </span>
          )}
          {saveStatus === "error" && (
            <span className="text-sm text-[#DC2626] font-medium">
              ✗ Error saving settings
            </span>
          )}
          <button
            onClick={handleSaveSettings}
            disabled={saveStatus === "saving"}
            className="px-6 py-3 bg-[#6366F1] text-white rounded-lg hover:bg-[#5558E3] transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saveStatus === "saving" ? "Saving..." : "Save Settings"}
          </button>
        </div>
      </div>
    </div>
  );
}
