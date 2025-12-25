import React from "react";

export const ProfileCard: React.FC<ProfileCardProps> = ({
  title,
  children,
  className = "",
}) => {
  return (
    <div
      className={`bg-white rounded-lg border border-gray-200 shadow-sm p-6 ${className}`}
    >
      <h2 className="text-lg font-semibold text-gray-900 mb-4">{title}</h2>
      <div className="space-y-4">{children}</div>
    </div>
  );
};

export const ProfileField: React.FC<ProfileFieldProps> = ({
  label,
  value,
  icon,
}) => {
  return (
    <div className="flex items-start justify-between py-2 border-b border-gray-100 last:border-b-0">
      <div className="flex items-center gap-2">
        {icon && <span className="text-gray-500">{icon}</span>}
        <span className="text-sm font-medium text-gray-600">{label}</span>
      </div>
      <span className="text-sm text-gray-900 font-medium">{value}</span>
    </div>
  );
};

export const ToggleField: React.FC<ToggleFieldProps> = ({
  label,
  checked,
  onChange,
}) => {
  return (
    <div className="flex items-center justify-between py-2">
      <span className="text-sm font-medium text-gray-600">{label}</span>
      <button
        onClick={() => onChange(!checked)}
        className={`w-10 h-5 rounded-full transition-colors ${
          checked ? "bg-green-500" : "bg-gray-300"
        }`}
      >
        <div
          className={`w-4 h-4 bg-white rounded-full shadow-sm transition-transform ${
            checked ? "translate-x-5" : "translate-x-0.5"
          } mt-0.5`}
        />
      </button>
    </div>
  );
};
