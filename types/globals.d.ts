/**
 * Global Type Definitions
 * All types are available throughout the application without importing
 */

declare global {
  // ============================================================================
  // System & Navigation Types
  // ============================================================================
  
  type SystemStatus = "online" | "offline" | "warning";
  type SystemStatusCallback = (status: SystemStatus) => void;

  interface WeatherData {
    temperature: number;
    condition: "sunny" | "cloudy" | "rainy" | "snowy" | "partly-cloudy";
    location: string;
  }

  interface NotificationItem {
    id: string;
    title: string;
    message: string;
    type: "info" | "warning" | "error" | "success";
    timestamp: Date;
    read: boolean;
  }

  interface NavigationItem {
    name: string;
    href: string;
    icon: React.ComponentType<{ className?: string }>;
    description: string;
    badge?: number;
    disabled?: boolean;
  }

  interface SidebarProps {
    className?: string;
    navigationItems?: NavigationItem[];
    onNavigate?: (href: string) => void;
    defaultCollapsed?: boolean;
  }

  interface SidebarState {
    isCollapsed: boolean;
    isMobileOpen: boolean;
  }

  interface SidebarConfig {
    expandedWidth: string;
    collapsedWidth: string;
    mobileBreakpoint: string;
    transitionDuration: number;
  }

  interface NavigationGroup {
    label: string;
    items: NavigationItem[];
    collapsible?: boolean;
    defaultExpanded?: boolean;
  }

  // ============================================================================
  // User Profile Types
  // ============================================================================

  interface UserProfile {
    id: string;
    name: string;
    email: string;
    role: "Admin" | "User";
    avatarUrl?: string;
    avatarInitials?: string;
    avatar?: string;
  }

  interface SystemInfo {
    connectedDevices: number;
    activeRooms: number;
    lastLogin: Date | string;
  }

  interface UserPreferences {
    theme: "light" | "dark";
    notificationsEnabled: boolean;
    automationMode: boolean;
  }

  interface ProfileData {
    user: UserProfile;
    systemInfo: SystemInfo;
    preferences: UserPreferences;
  }

  // ============================================================================
  // Analytics Types
  // ============================================================================

  interface PowerUsageDataPoint {
    timestamp: string;
    power: number;
    date?: string;
  }

  interface ApplianceEnergyData {
    appliance: string;
    energy: number;
    percentage?: number;
  }

  interface AutomationComparisonData {
    month: string;
    before: number;
    after: number;
    savings?: number;
  }

  interface AnalyticsApiResponse<T> {
    success: boolean;
    data: T;
    timestamp?: string;
    error?: string;
  }

  interface TimeRange {
    start: Date;
    end: Date;
  }

  // ============================================================================
  // Automation Types
  // ============================================================================

  type ApplianceType = "air_conditioner" | "fan" | "light" | "heater" | "dehumidifier" | "other";
  type ControlMode = "auto" | "manual";
  type ApplianceStatus = "on" | "off";

  interface FanSettings {
    speed: number;
  }

  interface ACSettings {
    temperature: number;
    mode: "cool" | "heat" | "fan" | "dry";
  }

  interface ApplianceSettings {
    fan?: FanSettings;
    ac?: ACSettings;
  }

  interface Appliance {
    id: string;
    name: string;
    type: ApplianceType;
    room: string;
    status: ApplianceStatus;
    controlMode: ControlMode;
    powerConsumption: number;
    settings?: ApplianceSettings;
    isOnline: boolean;
    roomId?: string;
    powerRating?: number;
    isEnabled?: boolean;
  }

  interface AutomationRule {
    id: string;
    applianceId: string;
    condition: string;
    action: string;
    enabled: boolean;
  }

  // ============================================================================
  // History & Comparison Types
  // ============================================================================

  interface HistoricalDataPoint {
    timestamp: string;
    roomId: string;
    roomName: string;
    power: number;
    energy: number;
    temperature?: number;
    humidity?: number;
    lighting?: number;
    motion?: number;
  }

  interface DateRange {
    start: Date;
    end: Date;
    label?: string;
  }

  interface RoomOption {
    id: string;
    name: string;
    type: string;
  }

  interface ComparisonData {
    roomId: string;
    roomName: string;
    currentPeriod: {
      energy: number;
      avgPower: number;
      peakPower: number;
    };
    previousPeriod: {
      energy: number;
      avgPower: number;
      peakPower: number;
    };
    change: {
      energy: number;
      avgPower: number;
      peakPower: number;
    };
  }

  interface HistoricalDataApiResponse {
    success: boolean;
    data: HistoricalDataPoint[];
    count: number;
    dateRange: {
      start: string;
      end: string;
    };
    error?: string;
  }

  interface ExportDataRow {
    Date: string;
    Time: string;
    Room: string;
    "Power (W)": number;
    "Energy (kWh)": number;
    "Temperature (°C)"?: number;
    "Humidity (%)"?: number;
  }

  type SortDirection = "asc" | "desc";

  interface TableSortConfig {
    key: keyof HistoricalDataPoint;
    direction: SortDirection;
  }

  // ============================================================================
  // Recommendations Types
  // ============================================================================

  // Sensor Types
  type SensorStatus = "normal" | "warning" | "critical" | "offline";
  type SensorDataCallback = (sensors: FirebaseSensorData[]) => void;

  interface FirebaseSensorData {
    id: string;
    sensorName: string;
    currentValue: number | string;
    unit: string;
    status: SensorStatus;
    description?: string;
    lastUpdate?: string;
    category?: string;
    room?: string;
  }

  interface LiveSensorCardProps {
    sensorName: string;
    currentValue: number | string;
    unit: string;
    status: SensorStatus;
    description?: string;
    lastUpdate?: Date | string;
    onClick?: () => void;
    className?: string;
  }

  // Database Types
  interface DBRoom {
    id: string;
    name: string;
    floor: number;
    type: string;
    created_at: Date;
    updated_at: Date;
  }

  interface SensorDataRecord {
    id: number;
    sensor_id: string;
    sensor_name: string;
    room_id: string;
    category: string;
    current_value: number;
    unit: string;
    status: string;
    description?: string;
    timestamp: Date;
    created_at: Date;
  }

  interface RoomStatusCardProps {
    roomName: string;
    isOccupied: boolean;
    activeDevices: number;
    totalDevices: number;
    currentPower: number;
    temperature?: number;
    className?: string;
  }

  interface ProfileCardProps {
    title: string;
    children: React.ReactNode;
    className?: string;
  }

  interface ProfileFieldProps {
    label: string;
    value: string | number;
    icon?: React.ReactNode;
  }

  interface ToggleFieldProps {
    label: string;
    checked: boolean;
    onChange: (checked: boolean) => void;
  }

  interface MLRecommendationCardProps {
    recommendation: MLRecommendation;
    onApply?: (id: string) => void;
  }

  interface WeatherSummaryProps {
    weather: WeatherData;
  }

  interface UserProfileDropdownProps {
    user: UserProfile;
  }

  interface SystemStatusIndicatorProps {
    status: SystemStatus;
  }

  interface NavigationProps {
    currentPath: string;
    onNavigate?: (path: string) => void;
  }

  // ============================================================================
  // Recommendations Types
  // ============================================================================

  interface MLRecommendation {
    id: string;
    title: string;
    description: string;
    confidenceScore: number;
    inputs: RecommendationInputs;
    action: RecommendationAction;
    timestamp: Date;
    category: RecommendationCategory;
    potentialSavings?: {
      amount: number;
      unit: "kWh" | "percentage" | "currency";
    };
  }

  interface RecommendationInputs {
    weather?: {
      temperature: number;
      condition: string;
    };
    occupancy?: {
      current: number;
      predicted: number;
    };
    timeOfDay?: {
      hour: number;
      period: "morning" | "afternoon" | "evening" | "night";
    };
    historicalPattern?: string;
  }

  interface RecommendationAction {
    type: "schedule" | "adjust" | "alert" | "optimize";
    target: string;
    parameters?: Record<string, unknown>;
  }

  type RecommendationCategory =
    | "energy-savings"
    | "comfort-optimization"
    | "predictive-maintenance"
    | "cost-reduction"
    | "peak-demand";

  type ConfidenceLevel = "low" | "medium" | "high" | "very-high";

  // ============================================================================
  // Settings Types
  // ============================================================================

  interface Room {
    id: string;
    name: string;
    isEnabled: boolean;
    type?: string;
  }

  interface TariffSettings {
    currency: string;
    unitPrice: number;
    timeBasedPricing: boolean;
    peakRate?: number;
    offPeakRate?: number;
    peakStartHour?: number;
    peakEndHour?: number;
  }

  interface DataSamplingSettings {
    interval: number;
    retentionDays: number;
    aggregationMethod: "average" | "sum" | "max" | "min";
  }

  interface NotificationSettings {
    emailNotifications: boolean;
    pushNotifications: boolean;
    highUsageAlert: boolean;
    highUsageThreshold: number;
    offlineDeviceAlert: boolean;
  }

  interface SystemSettings {
    rooms: Room[];
    appliances: Appliance[];
    tariff: TariffSettings;
    dataSampling: DataSamplingSettings;
    notifications: NotificationSettings;
  }

  // Default configurations
  const DEFAULT_ROOMS: Room[];
  const DEFAULT_APPLIANCES: Appliance[];
  const DEFAULT_TARIFF: TariffSettings;
  const DEFAULT_DATA_SAMPLING: DataSamplingSettings;
  const DEFAULT_NOTIFICATIONS: NotificationSettings;
}

export {};
