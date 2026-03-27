"use client";

import { useEffect, useMemo, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { TrendingUp, Zap, Gauge, Activity } from "lucide-react";
import { COLORS } from "@/lib/constants";
import { MetricCard } from "@/components/metrics";
import {
  isValidTimestamp,
  getTimestampMs,
  formatTimestamp,
} from "@/lib/timestamp";
import { subscribePZEMData } from "@/lib/firebase-sensors";
import { initializeFirebase } from "@/lib/firebase";

interface ChartData {
  time: string;
  power: number;
  energy: number;
  voltage: number;
  timestamp?: string;
}

interface ParsedPowerPoint {
  timestampMs: number;
  date: Date;
  power: number;
}

interface ComparisonDataPoint {
  label: string;
  first: number | null;
  second: number | null;
}

interface ComparisonChartConfig {
  title: string;
  subtitle: string;
  firstLabel: string;
  secondLabel: string;
  data: ComparisonDataPoint[];
  firstAvgPower: number;
  secondAvgPower: number;
}

type ComparisonMode = "day" | "month" | "year";

interface ComparisonPeriodOption {
  key: string;
  label: string;
}

const CustomTooltip = ({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: Array<{ color: string; name: string; value: number }>;
  label?: string;
}) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-sm">
      <p className="text-sm font-medium text-gray-900 mb-1">{label}</p>
      {payload.map((entry, index: number) => (
        <p key={index} className="text-sm" style={{ color: entry.color }}>
          {entry.name}:{" "}
          {typeof entry.value === "number"
            ? entry.value.toFixed(2)
            : entry.value}
        </p>
      ))}
    </div>
  );
};

const formatNumber = (value: number | null) => {
  if (typeof value !== "number" || Number.isNaN(value)) {
    return "-";
  }
  return value.toFixed(2);
};

const formatComparisonLabel = (
  periodKey: string,
  mode: "day" | "month" | "year",
) => {
  if (mode === "year") {
    return periodKey;
  }

  if (mode === "month") {
    const [yearStr, monthStr] = periodKey.split("-");
    const year = Number(yearStr);
    const month = Number(monthStr) - 1;
    const date = new Date(year, month, 1);

    if (Number.isNaN(date.getTime())) {
      return periodKey;
    }

    return date.toLocaleDateString("en-IN", {
      month: "short",
      year: "numeric",
    });
  }

  const [yearStr, monthStr, dayStr] = periodKey.split("-");
  const year = Number(yearStr);
  const month = Number(monthStr) - 1;
  const day = Number(dayStr);
  const date = new Date(year, month, day);

  if (Number.isNaN(date.getTime())) {
    return periodKey;
  }

  return date.toLocaleDateString("en-IN", {
    month: "short",
    day: "numeric",
  });
};

const getPeriodKey = (date: Date, mode: "day" | "month" | "year") => {
  const year = date.getFullYear();

  if (mode === "year") {
    return String(year);
  }

  const month = String(date.getMonth() + 1).padStart(2, "0");

  if (mode === "month") {
    return `${year}-${month}`;
  }

  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const getAveragePower = (points: ParsedPowerPoint[]) => {
  if (points.length === 0) {
    return 0;
  }

  const sum = points.reduce((acc, point) => acc + point.power, 0);
  return sum / points.length;
};

const buildComparisonChart = (
  points: ParsedPowerPoint[],
  mode: ComparisonMode,
  firstPeriod: string,
  secondPeriod: string,
): ComparisonChartConfig | null => {
  if (points.length < 2) {
    return null;
  }

  const groupedByPeriod = new Map<string, ParsedPowerPoint[]>();

  points.forEach((point) => {
    const key = getPeriodKey(point.date, mode);
    const current = groupedByPeriod.get(key) || [];
    current.push(point);
    groupedByPeriod.set(key, current);
  });

  if (!groupedByPeriod.has(firstPeriod) || !groupedByPeriod.has(secondPeriod)) {
    return null;
  }

  const firstPoints = groupedByPeriod.get(firstPeriod) || [];
  const secondPoints = groupedByPeriod.get(secondPeriod) || [];

  const firstLabel = formatComparisonLabel(firstPeriod, mode);
  const secondLabel = formatComparisonLabel(secondPeriod, mode);

  const bucketCount =
    mode === "day"
      ? 24
      : mode === "month"
        ? Math.max(
            new Date(
              Number(firstPeriod.split("-")[0]),
              Number(firstPeriod.split("-")[1]),
              0,
            ).getDate(),
            new Date(
              Number(secondPeriod.split("-")[0]),
              Number(secondPeriod.split("-")[1]),
              0,
            ).getDate(),
          )
        : 12;

  const firstBuckets = new Map<number, number[]>();
  const secondBuckets = new Map<number, number[]>();

  firstPoints.forEach((point) => {
    const bucketIndex =
      mode === "day"
        ? point.date.getHours()
        : mode === "month"
          ? point.date.getDate() - 1
          : point.date.getMonth();
    const bucket = firstBuckets.get(bucketIndex) || [];
    bucket.push(point.power);
    firstBuckets.set(bucketIndex, bucket);
  });

  secondPoints.forEach((point) => {
    const bucketIndex =
      mode === "day"
        ? point.date.getHours()
        : mode === "month"
          ? point.date.getDate() - 1
          : point.date.getMonth();
    const bucket = secondBuckets.get(bucketIndex) || [];
    bucket.push(point.power);
    secondBuckets.set(bucketIndex, bucket);
  });

  const data = Array.from({ length: bucketCount }, (_, index) => {
    const firstValues = firstBuckets.get(index) || [];
    const secondValues = secondBuckets.get(index) || [];

    const first =
      firstValues.length > 0
        ? firstValues.reduce((acc, value) => acc + value, 0) /
          firstValues.length
        : null;

    const second =
      secondValues.length > 0
        ? secondValues.reduce((acc, value) => acc + value, 0) /
          secondValues.length
        : null;

    const label =
      mode === "day"
        ? `${String(index).padStart(2, "0")}:00`
        : mode === "month"
          ? String(index + 1)
          : new Date(2000, index, 1).toLocaleDateString("en-IN", {
              month: "short",
            });

    return {
      label,
      first,
      second,
    };
  });

  const title =
    mode === "day"
      ? "Day-over-Day Power Usage"
      : mode === "month"
        ? "Month-over-Month Power Usage"
        : "Year-over-Year Power Usage";

  return {
    title,
    subtitle: `${firstLabel} vs ${secondLabel}`,
    firstLabel,
    secondLabel,
    data,
    firstAvgPower: getAveragePower(firstPoints),
    secondAvgPower: getAveragePower(secondPoints),
  };
};

const getComparisonPeriodOptions = (
  points: ParsedPowerPoint[],
  mode: ComparisonMode,
): ComparisonPeriodOption[] => {
  const keys = new Set<string>();

  points.forEach((point) => {
    keys.add(getPeriodKey(point.date, mode));
  });

  return Array.from(keys)
    .sort()
    .map((key) => ({
      key,
      label: formatComparisonLabel(key, mode),
    }));
};

const ComparisonTooltip = ({
  active,
  payload,
  label,
  firstLabel,
  secondLabel,
}: {
  active?: boolean;
  payload?: Array<{ color: string; value: number | null }>;
  label?: string;
  firstLabel: string;
  secondLabel: string;
}) => {
  if (!active || !payload?.length) return null;

  const firstValue = payload[0]?.value ?? null;
  const secondValue = payload[1]?.value ?? null;
  const difference =
    typeof firstValue === "number" && typeof secondValue === "number"
      ? secondValue - firstValue
      : null;

  return (
    <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-sm">
      <p className="text-sm font-medium text-gray-900 mb-1">{label}</p>
      <p
        className="text-sm"
        style={{ color: payload[0]?.color || COLORS.primary }}
      >
        {firstLabel}: {formatNumber(firstValue)} W
      </p>
      <p
        className="text-sm"
        style={{ color: payload[1]?.color || COLORS.secondary }}
      >
        {secondLabel}: {formatNumber(secondValue)} W
      </p>
      <p className="text-sm text-gray-700 mt-1">
        Difference: {formatNumber(difference)} W
      </p>
    </div>
  );
};

const ComparisonChartCard = ({ chart }: { chart: ComparisonChartConfig }) => {
  const diff = chart.secondAvgPower - chart.firstAvgPower;
  const diffPct =
    chart.firstAvgPower > 0 ? (diff / chart.firstAvgPower) * 100 : null;

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <h3 className="text-base font-semibold text-gray-900">{chart.title}</h3>
      <p className="text-sm text-gray-500 mt-1 mb-4">{chart.subtitle}</p>
      <ResponsiveContainer width="100%" height={260}>
        <LineChart
          data={chart.data}
          margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
          <XAxis
            dataKey="label"
            stroke={COLORS.textMuted}
            style={{ fontSize: "12px" }}
          />
          <YAxis stroke={COLORS.textMuted} style={{ fontSize: "12px" }} />
          <Tooltip
            content={
              <ComparisonTooltip
                firstLabel={chart.firstLabel}
                secondLabel={chart.secondLabel}
              />
            }
          />
          <Line
            type="monotone"
            dataKey="first"
            name={chart.firstLabel}
            stroke={COLORS.warning}
            strokeWidth={2}
            dot={false}
            connectNulls
          />
          <Line
            type="monotone"
            dataKey="second"
            name={chart.secondLabel}
            stroke={COLORS.primary}
            strokeWidth={2}
            dot={false}
            connectNulls
          />
        </LineChart>
      </ResponsiveContainer>
      <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
        <div className="bg-gray-50 rounded-md p-3">
          <p className="text-gray-500">{chart.firstLabel} Avg</p>
          <p className="font-semibold text-gray-900">
            {chart.firstAvgPower.toFixed(2)} W
          </p>
        </div>
        <div className="bg-gray-50 rounded-md p-3">
          <p className="text-gray-500">{chart.secondLabel} Avg</p>
          <p className="font-semibold text-gray-900">
            {chart.secondAvgPower.toFixed(2)} W
          </p>
        </div>
        <div className="bg-gray-50 rounded-md p-3">
          <p className="text-gray-500">Difference</p>
          <p
            className={`font-semibold ${
              diff > 0
                ? "text-red-600"
                : diff < 0
                  ? "text-green-600"
                  : "text-gray-900"
            }`}
          >
            {diff.toFixed(2)} W
            {diffPct !== null ? ` (${diffPct.toFixed(1)}%)` : ""}
          </p>
        </div>
      </div>
    </div>
  );
};

export default function AnalyticsPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [powerHistory, setPowerHistory] = useState<ChartData[]>([]);
  const [latestMetrics, setLatestMetrics] = useState<PZEMData | null>(null);
  const [comparisonMode, setComparisonMode] = useState<ComparisonMode>("day");
  const [firstPeriodKey, setFirstPeriodKey] = useState<string>("");
  const [secondPeriodKey, setSecondPeriodKey] = useState<string>("");

  const parsedPowerPoints = useMemo<ParsedPowerPoint[]>(() => {
    return powerHistory
      .map((item) => {
        const timestampMs = getTimestampMs(item.timestamp || "");
        if (!timestampMs) {
          return null;
        }

        return {
          timestampMs,
          date: new Date(timestampMs),
          power: Number(item.power) || 0,
        };
      })
      .filter((point): point is ParsedPowerPoint => point !== null)
      .sort((a, b) => a.timestampMs - b.timestampMs);
  }, [powerHistory]);

  const availablePeriods = useMemo(
    () => getComparisonPeriodOptions(parsedPowerPoints, comparisonMode),
    [parsedPowerPoints, comparisonMode],
  );

  const selectedComparisonChart = useMemo(() => {
    if (
      !firstPeriodKey ||
      !secondPeriodKey ||
      firstPeriodKey === secondPeriodKey
    ) {
      return null;
    }

    return buildComparisonChart(
      parsedPowerPoints,
      comparisonMode,
      firstPeriodKey,
      secondPeriodKey,
    );
  }, [parsedPowerPoints, comparisonMode, firstPeriodKey, secondPeriodKey]);

  useEffect(() => {
    if (availablePeriods.length < 2) {
      setFirstPeriodKey("");
      setSecondPeriodKey("");
      return;
    }

    const firstFallback =
      availablePeriods[availablePeriods.length - 2]?.key ?? "";
    const secondFallback =
      availablePeriods[availablePeriods.length - 1]?.key ?? "";

    const firstExists = availablePeriods.some(
      (period) => period.key === firstPeriodKey,
    );
    const secondExists = availablePeriods.some(
      (period) => period.key === secondPeriodKey,
    );

    const nextFirst = firstExists ? firstPeriodKey : firstFallback;
    let nextSecond = secondExists ? secondPeriodKey : secondFallback;

    if (nextSecond === nextFirst) {
      nextSecond =
        secondFallback === nextFirst ? firstFallback : secondFallback;
    }

    if (nextFirst !== firstPeriodKey) {
      setFirstPeriodKey(nextFirst);
    }

    if (nextSecond !== secondPeriodKey) {
      setSecondPeriodKey(nextSecond);
    }
  }, [availablePeriods, firstPeriodKey, secondPeriodKey]);

  useEffect(() => {
    try {
      initializeFirebase();
    } catch (_err) {
      setTimeout(() => setLoading(false), 0);
      return;
    }

    const unsubscribe = subscribePZEMData((data) => {
      if (data) {
        setLatestMetrics(data);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const fetchHistoricalData = async () => {
      try {
        setError(null);

        const params = new URLSearchParams({
          _t: Date.now().toString(),
        });

        const response = await fetch(`/api/pzem-data?${params}`, {
          cache: "no-store",
          headers: { "Cache-Control": "no-cache" },
        });

        const result = await response.json();

        if (!response.ok) {
          setError(result.error || "Failed to fetch historical data");
          setPowerHistory([]);
          return;
        }

        if (result.data?.length > 0) {
          const formatted = result.data
            .filter((item: { timestamp: string }) => {
              if (!isValidTimestamp(item.timestamp)) {
                return false;
              }
              return true;
            })
            .map((item: HistoricalPZEMData) => ({
              time: formatTimestamp(item.timestamp, "en-IN", {
                month: "short",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              }),
              power: Number(item.power) || 0,
              energy: Number(item.energy) || 0,
              voltage: Number(item.voltage) || 0,
              timestamp: item.timestamp,
            }));

          setPowerHistory(formatted.reverse());
        } else {
          setPowerHistory([]);
        }
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Unknown error while fetching historical data",
        );
        setPowerHistory([]);
      }
    };

    fetchHistoricalData();
    const interval = setInterval(fetchHistoricalData, 10000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (powerHistory.length === 0) return;

    const end = new Date();
    const start = new Date();
    start.setDate(start.getDate() - 7);

    const startMs = start.getTime();
    const endMs = end.getTime();

    const filteredBy7Days = powerHistory.filter((item: ChartData) => {
      const ts = getTimestampMs(item.timestamp || "");
      return ts >= startMs && ts <= endMs;
    });

    if (filteredBy7Days.length !== powerHistory.length) {
      setPowerHistory(filteredBy7Days);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center">
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Power Analytics
          </h1>
          <p className="text-gray-600">Real-time data from Firebase</p>
        </div>

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-sm font-medium text-red-800">Error: {error}</p>
          </div>
        )}

        {latestMetrics && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <MetricCard
              title="Current Power"
              value={latestMetrics.power.toFixed(1)}
              unit="W"
              icon={<Zap className="w-6 h-6" />}
            />
            <MetricCard
              title="Current"
              value={latestMetrics.current.toFixed(2)}
              unit="A"
              icon={<Activity className="w-6 h-6" />}
            />
            <MetricCard
              title="Voltage"
              value={latestMetrics.voltage.toFixed(1)}
              unit="V"
              icon={<Gauge className="w-6 h-6" />}
            />
            <MetricCard
              title="Total Energy"
              value={latestMetrics.energy.toFixed(2)}
              unit="kWh"
              icon={<TrendingUp className="w-6 h-6" />}
            />
          </div>
        )}

        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4 mb-4">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                Power Usage Comparison
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                Select timeline and periods to compare power usage
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full lg:w-auto">
              <label className="flex flex-col text-sm text-gray-700">
                Timeline
                <select
                  className="mt-1 rounded-md border border-gray-300 px-3 py-2 bg-white text-gray-900"
                  value={comparisonMode}
                  onChange={(event) => {
                    setComparisonMode(event.target.value as ComparisonMode);
                  }}
                >
                  <option value="day">Day</option>
                  <option value="month">Month</option>
                  <option value="year">Year</option>
                </select>
              </label>
              <label className="flex flex-col text-sm text-gray-700">
                Period 1
                <select
                  className="mt-1 rounded-md border border-gray-300 px-3 py-2 bg-white text-gray-900"
                  value={firstPeriodKey}
                  onChange={(event) => setFirstPeriodKey(event.target.value)}
                  disabled={availablePeriods.length < 2}
                >
                  {availablePeriods.map((period) => (
                    <option key={period.key} value={period.key}>
                      {period.label}
                    </option>
                  ))}
                </select>
              </label>
              <label className="flex flex-col text-sm text-gray-700">
                Period 2
                <select
                  className="mt-1 rounded-md border border-gray-300 px-3 py-2 bg-white text-gray-900"
                  value={secondPeriodKey}
                  onChange={(event) => setSecondPeriodKey(event.target.value)}
                  disabled={availablePeriods.length < 2}
                >
                  {availablePeriods.map((period) => (
                    <option key={period.key} value={period.key}>
                      {period.label}
                    </option>
                  ))}
                </select>
              </label>
            </div>
          </div>

          {availablePeriods.length < 2 && (
            <p className="text-sm text-gray-500">
              At least two periods are required for comparison in the selected
              timeline.
            </p>
          )}

          {availablePeriods.length >= 2 && !selectedComparisonChart && (
            <p className="text-sm text-gray-500">
              Select two different periods to render the comparison graph.
            </p>
          )}

          {selectedComparisonChart && (
            <ComparisonChartCard chart={selectedComparisonChart} />
          )}
        </div>

        {powerHistory.length > 0 ? (
          <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Power Usage History
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart
                data={powerHistory}
                margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis
                  dataKey="time"
                  stroke={COLORS.textMuted}
                  style={{ fontSize: "12px" }}
                />
                <YAxis stroke={COLORS.textMuted} style={{ fontSize: "12px" }} />
                <Tooltip content={<CustomTooltip />} />
                <Line
                  type="monotone"
                  dataKey="power"
                  name="Power"
                  stroke={COLORS.primary}
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Power Usage History
            </h2>
            <div className="text-center py-12">
              <p className="text-gray-500 mb-2">No PZEM data available</p>
              <p className="text-sm text-gray-400">
                Make sure your external cron job is calling POST
                /api/sync-firebase
                <br />
                Check that Firebase has PZEM data and device status is
                &quot;online&quot;
              </p>
            </div>
          </div>
        )}

        {latestMetrics && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-sm font-medium text-gray-600 mb-4">
                Power Metrics
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Current</span>
                  <span className="font-semibold">
                    {latestMetrics.current.toFixed(2)} A
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Power Factor</span>
                  <span className="font-semibold">
                    {latestMetrics.pf.toFixed(3)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Frequency</span>
                  <span className="font-semibold">
                    {latestMetrics.frequency.toFixed(2)} Hz
                  </span>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-sm font-medium text-gray-600 mb-4">
                Energy Summary
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Energy</span>
                  <span className="font-semibold">
                    {latestMetrics.energy.toFixed(2)} kWh
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Current Power</span>
                  <span className="font-semibold">
                    {latestMetrics.power.toFixed(1)} W
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Voltage</span>
                  <span className="font-semibold">
                    {latestMetrics.voltage.toFixed(1)} V
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
