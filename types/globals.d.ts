declare global {
  type SensorStatus = "normal" | "warning" | "critical" | "offline";

  interface RoomSensorData {
    temperature: number;
    humidity: number;
    light: number;
    motion: boolean;
    updatedAt: string;
  }

  interface PZEMData {
    current: number;
    energy: number;
    frequency: number;
    pf: number;
    power: number;
    voltage: number;
    updatedAt: string;
  }

  interface RelayState {
    state: boolean;
    updatedAt?: string;
  }

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

  type SensorDataCallback = (sensors: FirebaseSensorData[]) => void;

  type SystemStatus = "online" | "offline" | "warning";
  type SystemStatusCallback = (status: SystemStatus) => void;
  type SensorCategory =
    | "temperature"
    | "humidity"
    | "occupancy"
    | "lighting"
    | "power"
    | "system";
  type ChartType = "line" | "area" | "bar";
  type MetricType = "temperature" | "humidity" | "light" | "motion";

  interface SystemInfo {
    connectedDevices: number;
    activeRooms: number;
    lastLogin: Date | string;
  }

  interface UserProfile {
    id: string;
    name: string;
    email: string;
    role: "Admin" | "User";
    avatarUrl?: string;
    avatarInitials?: string;
    avatar?: string;
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

  interface AppShellProps {
    children: React.ReactNode;
  }

  interface SidebarProps {
    className?: string;
    navigationItems?: NavigationItem[];
    onNavigate?: (href: string) => void;
    defaultCollapsed?: boolean;
    systemStatus?: SystemStatus;
  }

  interface NotificationIconProps {
    notifications: NotificationItem[];
    onNotificationClick?: (notification: NotificationItem) => void;
    className?: string;
  }

  interface NavigationProps {
    currentPath?: string;
    onNavigate?: (path: string) => void;
    systemStatus?: SystemStatus;
    weather?: WeatherData;
    user?: UserProfile;
    notifications?: NotificationItem[];
    onNotificationClick?: (notification: NotificationItem) => void;
    onSignOut?: () => void;
    className?: string;
  }

  interface WeatherData {
    temperature: number;
    condition:
      | "sunny"
      | "cloudy"
      | "rainy"
      | "snowy"
      | "partly-cloudy"
      | "not-available";
    location: string;
  }

  interface OpenWeatherResponse {
    main: {
      temp: number;
    };
    weather: Array<{
      main: string;
    }>;
    name: string;
  }

  interface WeatherSummaryProps {
    weather: WeatherData;
    className?: string;
  }

  interface UserProfileDropdownProps {
    user: UserProfile;
    onSignOut?: () => void;
    className?: string;
  }

  interface SystemStatusIndicatorProps {
    status: SystemStatus;
    className?: string;
  }

  interface MetricCardProps {
    title: string;
    value: string | number;
    unit: string;
    icon: React.ReactNode;
    trend?: {
      direction: "up" | "down";
      value: number;
      isPositive?: boolean;
    };
    className?: string;
  }

  interface PowerUsageDataPoint {
    timestamp: string;
    power: number;
  }

  interface ApplianceEnergyData {
    appliance: string;
    energy: number;
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

  type ApplianceType =
    | "air_conditioner"
    | "fan"
    | "light"
    | "heater"
    | "dehumidifier"
    | "relay"
    | "other";
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
    settings?: ApplianceSettings;
    isOnline: boolean;
    roomId?: string;
    powerRating?: number;
    isEnabled?: boolean;
  }

  interface RelayControl {
    id: string;
    name: string;
    room: string;
    state: boolean;
    isOnline: boolean;
  }

  interface AutomationRule {
    id: string;
    applianceId: string;
    condition: string;
    action: string;
    enabled: boolean;
  }

  interface ApplianceControlCardProps {
    name: string;
    type: "light" | "fan" | "ac" | "other";
    room: "bedroom" | "living_room";
  }

  interface LightControlCardProps {
    appliance: Appliance;
    onStatusChange: (id: string, status: ApplianceStatus) => void;
    onModeChange: (id: string, mode: ControlMode) => void;
  }

  interface FanControlCardProps {
    appliance: Appliance;
    onStatusChange: (id: string, status: ApplianceStatus) => void;
    onFanSpeedChange: (id: string, speed: number) => void;
    onModeChange: (id: string, mode: ControlMode) => void;
  }

  interface ACControlCardProps {
    appliance: Appliance;
    onStatusChange: (id: string, status: ApplianceStatus) => void;
    onACTemperatureChange: (id: string, temperature: number) => void;
    onModeChange: (id: string, mode: ControlMode) => void;
  }

  interface HistoricalDataPoint {
    timestamp: string;
    roomId: string;
    roomName: string;
    temperature?: number;
    humidity?: number;
    light?: number;
    motion?: boolean;
  }

  interface DateRange {
    start: Date;
    end: Date;
    label?: string;
  }

  interface RoomOption {
    id: string;
    name: string;
  }

  type SortDirection = "asc" | "desc";

  interface TableSortConfig {
    key: keyof HistoricalDataPoint;
    direction: SortDirection;
  }

  interface DataTableProps {
    data: HistoricalDataPoint[];
    showExport?: boolean;
    className?: string;
    isLoading?: boolean;
  }

  interface RoomSelectorProps {
    rooms: RoomOption[];
    selectedRoomIds: string[];
    onChange: (roomIds: string[]) => void;
    multiple?: boolean;
    className?: string;
    isLoading?: boolean;
  }

  type PresetOption = {
    label: string;
    getValue: () => DateRange;
  };

  interface DateRangePickerProps {
    value: DateRange;
    onChange: (range: DateRange) => void;
    className?: string;
  }

  interface HistoricalChartProps {
    data: HistoricalDataPoint[];
    chartType?: "line" | "area" | "bar";
    metric?: "temperature" | "humidity" | "light" | "motion";
    title?: string;
    height?: number;
    compareRooms?: boolean;
    showLegend?: boolean;
    className?: string;
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

  interface RoomStatusCardProps {
    roomName: string;
    temperature?: number;
    humidity?: number;
    light?: number;
    motion?: boolean;
    className?: string;
  }

  interface RealtimeLineChartProps {
    data: Record<string, string | number>[];
    dataKey: string;
    color?: string;
    unit?: string;
    height?: number;
    title?: string;
    xAxisKey?: string;
    showGrid?: boolean;
    animate?: boolean;
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
    checked?: boolean;
    enabled?: boolean;
    onChange?: (checked: boolean) => void;
    icon?: React.ReactNode;
  }

  interface MLRecommendation {
    id: string;
    title: string;
    description: string;
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
    | "peak-demand"
    | "ac-optimization";

  type ConfidenceLevel = "low" | "medium" | "high" | "very-high";

  interface MLRecommendationCardProps {
    recommendation: MLRecommendation;
    onApply?: (id: string) => void;
    onIgnore?: (id: string) => void;
    className?: string;
  }

  interface MLModelRecommendation {
    room: string;
    recommended_setpoint: number;
    reasoning: string;
    current_temp: number;
    outdoor_temp: number;
    energy_saving_mode: boolean;
  }

  interface DBRoom {
    id: string;
    name: string;
    floor: number;
    type: string;
    created_at: Date;
    updated_at: Date;
  }

  interface RoomSensorRecord {
    id: number;
    room_id: string;
    room_name?: string;
    temperature?: number;
    humidity?: number;
    light?: number;
    motion?: boolean;
    timestamp: Date;
    created_at: Date;
  }

  interface PZEMRecord {
    id: number;
    current?: number;
    voltage?: number;
    power?: number;
    energy?: number;
    frequency?: number;
    pf?: number;
    timestamp: Date;
    created_at: Date;
  }

  interface RelayStateRecord {
    id: string; // Format: room_light, bedroom_fan
    room_id: string;
    relay_type: string; // light, fan, ac, appliance, etc.
    state: boolean;
    timestamp: Date;
    updated_at: Date;
    created_at: Date;
  }

  interface HistoricalRoomSensorData {
    timestamp: string;
    roomId: string;
    roomName: string;
    temperature?: number;
    humidity?: number;
    light?: number;
    motion?: boolean;
  }

  interface HistoricalPZEMData {
    timestamp: string;
    current?: number;
    voltage?: number;
    power?: number;
    energy?: number;
    frequency?: number;
    pf?: number;
  }

  interface FetchOptions {
    method?: string;
    headers?: Record<string, string>;
    body?: string;
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

  const DEFAULT_ROOMS: Room[];
  const DEFAULT_APPLIANCES: Appliance[];
  const DEFAULT_TARIFF: TariffSettings;
  const DEFAULT_DATA_SAMPLING: DataSamplingSettings;
  const DEFAULT_NOTIFICATIONS: NotificationSettings;
}

export {};
