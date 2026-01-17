"use client";

import { useState } from "react";

export const MLRecommendationCard: React.FC<MLRecommendationCardProps> = ({
  recommendation,
  onApply,
  onIgnore,
  className = "",
}) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const getConfidenceLevel = (score: number): ConfidenceLevel => {
    if (score >= 0.9) return "very-high";
    if (score >= 0.75) return "high";
    if (score >= 0.5) return "medium";
    return "low";
  };

  const getConfidenceColor = (level: ConfidenceLevel): string => {
    const colors = {
      "very-high": "text-[#16A34A]",
      high: "text-[#16A34A]",
      medium: "text-[#FB923C]",
      low: "text-[#DC2626]",
    };
    return colors[level];
  };

  const getConfidenceBackground = (level: ConfidenceLevel): string => {
    const backgrounds = {
      "very-high": "bg-green-50",
      high: "bg-green-50",
      medium: "bg-orange-50",
      low: "bg-red-50",
    };
    return backgrounds[level];
  };

  const getCategoryIcon = (category: string): string => {
    const icons = {
      "energy-savings": "⚡",
      "comfort-optimization": "🌡️",
      "predictive-maintenance": "🔧",
      "cost-reduction": "💰",
      "peak-demand": "📊",
    };
    return icons[category as keyof typeof icons] || "💡";
  };

  const handleApply = async () => {
    if (!onApply || isProcessing) return;

    setIsProcessing(true);
    try {
      await onApply(recommendation.id);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleIgnore = async () => {
    if (!onIgnore || isProcessing) return;

    setIsProcessing(true);
    try {
      await onIgnore(recommendation.id);
    } finally {
      setIsProcessing(false);
    }
  };

  const confidenceLevel = getConfidenceLevel(recommendation.confidenceScore);
  const confidencePercentage = Math.round(recommendation.confidenceScore * 100);

  return (
    <article
      className={`bg-white rounded-lg border border-gray-200 p-5 hover:shadow-md transition-shadow duration-200 ${className}`}
      aria-labelledby={`recommendation-${recommendation.id}-title`}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-2xl" aria-hidden="true">
            {getCategoryIcon(recommendation.category)}
          </span>
          <div>
            <h3
              id={`recommendation-${recommendation.id}-title`}
              className="text-base font-semibold text-[#111827] leading-tight"
            >
              {recommendation.title}
            </h3>
            <p className="text-xs text-gray-500 mt-0.5">
              {recommendation.action.target}
            </p>
          </div>
        </div>

        {/* Confidence Badge */}
        <div
          className={`${getConfidenceBackground(
            confidenceLevel,
          )} px-3 py-1 rounded-full flex items-center gap-1.5`}
          role="status"
          aria-label={`Confidence score: ${confidencePercentage}%`}
        >
          <span
            className={`text-sm font-semibold ${getConfidenceColor(
              confidenceLevel,
            )}`}
          >
            {confidencePercentage}%
          </span>
          <span className="text-xs text-gray-600">confidence</span>
        </div>
      </div>

      {/* Description */}
      <p className="text-sm text-[#111827] leading-relaxed mb-4">
        {recommendation.description}
      </p>

      {/* Potential Savings */}
      {recommendation.potentialSavings && (
        <div className="bg-[#F8FAFC] rounded-md p-3 mb-4 border border-gray-100">
          <div className="flex items-center gap-2">
            <span className="text-[#16A34A] font-semibold text-sm">
              Potential Savings:
            </span>
            <span className="text-[#111827] font-bold text-sm">
              {recommendation.potentialSavings.amount}
              {recommendation.potentialSavings.unit === "kWh" && " kWh"}
              {recommendation.potentialSavings.unit === "percentage" && "%"}
              {recommendation.potentialSavings.unit === "currency" && " USD"}
            </span>
          </div>
        </div>
      )}

      {/* Expandable Inputs Section */}
      <div className="border-t border-gray-100 pt-3 mb-4">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center justify-between w-full text-left group"
          aria-expanded={isExpanded}
          aria-controls={`recommendation-${recommendation.id}-inputs`}
        >
          <span className="text-xs font-medium text-gray-600 uppercase tracking-wide">
            Decision Inputs
          </span>
          <svg
            className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${
              isExpanded ? "rotate-180" : ""
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

        {isExpanded && (
          <div
            id={`recommendation-${recommendation.id}-inputs`}
            className="mt-3 space-y-2"
          >
            <InputsDisplay inputs={recommendation.inputs} />
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2">
        <button
          onClick={handleApply}
          disabled={isProcessing}
          className="flex-1 bg-[#6366F1] text-white px-4 py-2.5 rounded-md text-sm font-medium hover:bg-[#4F46E5] active:bg-[#4338CA] disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-[#6366F1] focus:ring-offset-2"
          aria-label={`Apply recommendation: ${recommendation.title}`}
        >
          {isProcessing ? "Processing..." : "Apply"}
        </button>
        <button
          onClick={handleIgnore}
          disabled={isProcessing}
          className="flex-1 bg-white text-gray-700 px-4 py-2.5 rounded-md text-sm font-medium border border-gray-300 hover:bg-gray-50 active:bg-gray-100 disabled:bg-gray-100 disabled:cursor-not-allowed transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2"
          aria-label={`Ignore recommendation: ${recommendation.title}`}
        >
          Ignore
        </button>
      </div>
    </article>
  );
};

/**
 * InputsDisplay Component
 * Displays the transparent input factors used in ML decision making
 */
const InputsDisplay: React.FC<{ inputs: RecommendationInputs }> = ({
  inputs,
}) => {
  return (
    <dl className="grid grid-cols-1 gap-2">
      {inputs.weather && (
        <div className="bg-blue-50 rounded px-3 py-2">
          <dt className="text-xs font-medium text-gray-600 mb-0.5">Weather</dt>
          <dd className="text-sm text-[#111827]">
            {inputs.weather.temperature}°C, {inputs.weather.condition}
          </dd>
        </div>
      )}

      {inputs.occupancy && (
        <div className="bg-purple-50 rounded px-3 py-2">
          <dt className="text-xs font-medium text-gray-600 mb-0.5">
            Occupancy
          </dt>
          <dd className="text-sm text-[#111827]">
            Current: {inputs.occupancy.current} | Predicted:{" "}
            {inputs.occupancy.predicted}
          </dd>
        </div>
      )}

      {inputs.timeOfDay && (
        <div className="bg-amber-50 rounded px-3 py-2">
          <dt className="text-xs font-medium text-gray-600 mb-0.5">Time</dt>
          <dd className="text-sm text-[#111827] capitalize">
            {inputs.timeOfDay.hour}:00 ({inputs.timeOfDay.period})
          </dd>
        </div>
      )}

      {inputs.historicalPattern && (
        <div className="bg-green-50 rounded px-3 py-2">
          <dt className="text-xs font-medium text-gray-600 mb-0.5">
            Historical Pattern
          </dt>
          <dd className="text-sm text-[#111827]">{inputs.historicalPattern}</dd>
        </div>
      )}
    </dl>
  );
};
