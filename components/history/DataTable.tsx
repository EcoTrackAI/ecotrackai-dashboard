"use client";

import { useState, useMemo } from "react";

// DataTableProps and all other types are globally available from types/globals.d.ts

/**
 * SortIcon Component - Displays sorting indicator
 */
const SortIcon: React.FC<{
  column: keyof HistoricalDataPoint;
  sortConfig: TableSortConfig;
}> = ({ column, sortConfig }) => {
  if (sortConfig.key !== column) {
    return (
      <svg
        className="w-4 h-4 text-gray-400"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"
        />
      </svg>
    );
  }

  return sortConfig.direction === "asc" ? (
    <svg
      className="w-4 h-4 text-[#6366F1]"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M5 15l7-7 7 7"
      />
    </svg>
  ) : (
    <svg
      className="w-4 h-4 text-[#6366F1]"
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
  );
};

/**
 * DataTable Component
 * Displays historical data in a sortable table with CSV export
 */
export const DataTable: React.FC<DataTableProps> = ({
  data,
  showExport = true,
  className = "",
  isLoading = false,
}) => {
  const [sortConfig, setSortConfig] = useState<TableSortConfig>({
    key: "timestamp",
    direction: "desc",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 50;

  const isDate = (val: unknown): val is Date => val instanceof Date;

  // Sort data
  const sortedData = useMemo(() => {
    const sorted = [...data];
    sorted.sort((a, b) => {
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];

      if (aValue === undefined || bValue === undefined) return 0;

      // Date sorting
      if (isDate(aValue) && isDate(bValue)) {
        const diff = aValue.getTime() - bValue.getTime();
        return sortConfig.direction === "asc" ? diff : -diff;
      }

      // String sorting
      if (typeof aValue === "string" && typeof bValue === "string") {
        return sortConfig.direction === "asc"
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }

      // Number sorting
      if (typeof aValue === "number" && typeof bValue === "number") {
        return sortConfig.direction === "asc"
          ? aValue - bValue
          : bValue - aValue;
      }

      // Boolean sorting
      if (typeof aValue === "boolean" && typeof bValue === "boolean") {
        return sortConfig.direction === "asc"
          ? Number(aValue) - Number(bValue)
          : Number(bValue) - Number(aValue);
      }

      return 0;
    });
    return sorted;
  }, [data, sortConfig]);

  // Paginate data
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return sortedData.slice(startIndex, startIndex + itemsPerPage);
  }, [sortedData, currentPage]);

  const totalPages = Math.ceil(sortedData.length / itemsPerPage);

  const handleSort = (key: keyof HistoricalDataPoint) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc",
    }));
  };

  const exportToCSV = () => {
    // Prepare data for export
    const exportData: Record<string, string | number>[] = sortedData.map(
      (point) => {
        const date = new Date(point.timestamp);
        return {
          Date: date.toLocaleDateString("en-IN", { timeZone: "Asia/Kolkata" }),
          Time: date.toLocaleTimeString("en-IN", { timeZone: "Asia/Kolkata" }),
          Room: point.roomName,
          ...(point.temperature !== undefined && {
            "Temperature (°C)": point.temperature,
          }),
          ...(point.humidity !== undefined && {
            "Humidity (%)": point.humidity,
          }),
          ...(point.light !== undefined && {
            "Light (lux)": point.light,
          }),
          ...(point.motion !== undefined && {
            Motion: point.motion ? "Detected" : "Not detected",
          }),
        };
      },
    );

    // Convert to CSV
    const headers = Object.keys(exportData[0]).join(",");
    const rows = exportData.map((row) => Object.values(row).join(","));
    const csv = [headers, ...rows].join("\n");

    // Download CSV
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `energy-history-${new Date().toISOString().split("T")[0]}.csv`,
    );
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (isLoading) {
    return (
      <div
        className={`bg-white rounded-lg border border-gray-200 p-6 ${className}`}
      >
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#6366F1]"></div>
            <p className="mt-2 text-sm text-gray-600">Loading data...</p>
          </div>
        </div>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div
        className={`bg-white rounded-lg border border-gray-200 p-6 ${className}`}
      >
        <div className="flex items-center justify-center h-64 text-gray-500">
          <div className="text-center">
            <svg
              className="w-12 h-12 mx-auto mb-2 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            <p className="text-sm font-medium">No data available</p>
            <p className="text-xs text-gray-400 mt-1">
              Select a date range and rooms to view data
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-lg border border-gray-200 ${className}`}>
      {/* Header with Export Button */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            Historical Data
          </h3>
          <p className="text-sm text-gray-600">
            {sortedData.length} record{sortedData.length !== 1 ? "s" : ""} found
          </p>
        </div>
        {showExport && (
          <button
            onClick={exportToCSV}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-[#6366F1] rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-[#6366F1] focus:ring-offset-2 transition-colors"
            aria-label="Export data to CSV"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            Export to CSV
          </button>
        )}
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th
                className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                onClick={() => handleSort("timestamp")}
              >
                <div className="flex items-center gap-1">
                  <span>Timestamp</span>
                  <SortIcon column="timestamp" sortConfig={sortConfig} />
                </div>
              </th>
              <th
                className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                onClick={() => handleSort("roomName")}
              >
                <div className="flex items-center gap-1">
                  <span>Room</span>
                  <SortIcon column="roomName" sortConfig={sortConfig} />
                </div>
              </th>
              <th
                className="px-4 py-3 text-right text-xs font-medium text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                onClick={() => handleSort("temperature")}
              >
                <div className="flex items-center justify-end gap-1">
                  <span>Temp (°C)</span>
                  <SortIcon column="temperature" sortConfig={sortConfig} />
                </div>
              </th>
              <th
                className="px-4 py-3 text-right text-xs font-medium text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                onClick={() => handleSort("humidity")}
              >
                <div className="flex items-center justify-end gap-1">
                  <span>Humidity (%)</span>
                  <SortIcon column="humidity" sortConfig={sortConfig} />
                </div>
              </th>
              <th
                className="px-4 py-3 text-right text-xs font-medium text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                onClick={() => handleSort("light")}
              >
                <div className="flex items-center justify-end gap-1">
                  <span>Lighting (lux)</span>
                  <SortIcon column="light" sortConfig={sortConfig} />
                </div>
              </th>
              <th
                className="px-4 py-3 text-right text-xs font-medium text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                onClick={() => handleSort("motion")}
              >
                <div className="flex items-center justify-end gap-1">
                  <span>Motion</span>
                  <SortIcon column="motion" sortConfig={sortConfig} />
                </div>
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {paginatedData.map((row, index) => (
              <tr
                key={`${row.roomId}-${row.timestamp}-${index}`}
                className="hover:bg-gray-50 transition-colors"
              >
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                  {new Date(row.timestamp).toLocaleString("en-IN", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                    timeZone: "Asia/Kolkata",
                  })}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 font-medium">
                  {row.roomName}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 text-right">
                  {row.temperature !== undefined
                    ? row.temperature.toFixed(1)
                    : "-"}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600 text-right">
                  {row.humidity !== undefined ? row.humidity.toFixed(0) : "-"}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600 text-right">
                  {row.light !== undefined ? row.light.toFixed(0) : "-"}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600 text-right">
                  {row.motion !== undefined
                    ? row.motion
                      ? "✓ Detected"
                      : "— None"
                    : "-"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200">
          <div className="text-sm text-gray-700">
            Showing{" "}
            <span className="font-medium">
              {(currentPage - 1) * itemsPerPage + 1}
            </span>{" "}
            to{" "}
            <span className="font-medium">
              {Math.min(currentPage * itemsPerPage, sortedData.length)}
            </span>{" "}
            of <span className="font-medium">{sortedData.length}</span> results
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#6366F1] focus:ring-offset-2 disabled:bg-gray-100 disabled:cursor-not-allowed transition-colors"
              aria-label="Previous page"
            >
              Previous
            </button>
            <span className="text-sm text-gray-700">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() =>
                setCurrentPage((prev) => Math.min(totalPages, prev + 1))
              }
              disabled={currentPage === totalPages}
              className="px-3 py-1 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#6366F1] focus:ring-offset-2 disabled:bg-gray-100 disabled:cursor-not-allowed transition-colors"
              aria-label="Next page"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
