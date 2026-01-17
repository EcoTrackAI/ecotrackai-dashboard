-- ============================================================================
-- Rooms Table
-- ============================================================================
CREATE TABLE
  IF NOT EXISTS rooms (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    floor INTEGER,
    type VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );

-- ============================================================================
-- Room Sensors Data Table
-- Stores environmental sensor readings (temperature, humidity, light, motion)
-- ============================================================================
CREATE TABLE
  IF NOT EXISTS room_sensors (
    id SERIAL PRIMARY KEY,
    room_id VARCHAR(50) NOT NULL REFERENCES rooms (id),
    temperature NUMERIC(5, 2), -- Temperature in Celsius
    humidity NUMERIC(5, 2), -- Relative humidity percentage (0-100%)
    light NUMERIC(8, 2), -- Light intensity in lux (supports decimal values)
    motion BOOLEAN, -- Motion detection state
    timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );

-- ============================================================================
-- PZEM Power Meter Data Table
-- Stores electrical power metrics from PZEM sensors
-- ============================================================================
CREATE TABLE
  IF NOT EXISTS pzem_data (
    id SERIAL PRIMARY KEY,
    current NUMERIC(10, 3), -- Current in Amperes (A)
    voltage NUMERIC(10, 2), -- Voltage in Volts (V)
    power NUMERIC(10, 2), -- Real-time power in Watts (W)
    energy NUMERIC(12, 3), -- Total energy consumed in kWh
    frequency NUMERIC(5, 2), -- AC frequency in Hz
    pf NUMERIC(4, 3), -- Power factor (0.0-1.0)
    timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );

-- ============================================================================
-- Indexes for Room Sensors
-- ============================================================================
CREATE INDEX IF NOT EXISTS idx_room_sensors_timestamp ON room_sensors (timestamp DESC);

CREATE INDEX IF NOT EXISTS idx_room_sensors_room_id ON room_sensors (room_id);

CREATE INDEX IF NOT EXISTS idx_room_sensors_room_timestamp ON room_sensors (room_id, timestamp DESC);

-- ============================================================================
-- Indexes for PZEM Data
-- ============================================================================
CREATE INDEX IF NOT EXISTS idx_pzem_data_timestamp ON pzem_data (timestamp DESC);

INSERT INTO
  rooms (id, name, floor, type)
VALUES
  ('unknown', 'Unknown', 0, 'utility'),
  ('bedroom', 'Bedroom', 1, 'residential'),
  ('living_room', 'Living Room', 1, 'residential') ON CONFLICT (id) DO NOTHING;