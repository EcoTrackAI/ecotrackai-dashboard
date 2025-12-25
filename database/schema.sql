-- EcoTrackAI Historical Data Schema
-- PostgreSQL Database Schema for storing sensor data from Firebase

-- Create the database (run this separately if needed)
-- CREATE DATABASE ecotrackai;

-- Rooms table (to store room information)
CREATE TABLE IF NOT EXISTS rooms (
  id VARCHAR(50) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  floor INTEGER,
  type VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Sensor historical data table
CREATE TABLE IF NOT EXISTS sensor_data (
  id SERIAL PRIMARY KEY,
  sensor_id VARCHAR(100) NOT NULL,
  sensor_name VARCHAR(255) NOT NULL,
  room_id VARCHAR(50) REFERENCES rooms(id),
  category VARCHAR(50) NOT NULL, -- temperature, humidity, occupancy, lighting, power, system
  current_value NUMERIC(10, 2) NOT NULL,
  unit VARCHAR(20) NOT NULL,
  status VARCHAR(20) NOT NULL, -- normal, warning, critical, offline
  description TEXT,
  timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_sensor_data_timestamp ON sensor_data(timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_sensor_data_room_id ON sensor_data(room_id);
CREATE INDEX IF NOT EXISTS idx_sensor_data_category ON sensor_data(category);
CREATE INDEX IF NOT EXISTS idx_sensor_data_sensor_id ON sensor_data(sensor_id);
CREATE INDEX IF NOT EXISTS idx_sensor_data_room_timestamp ON sensor_data(room_id, timestamp DESC);

-- Create a composite index for common queries
CREATE INDEX IF NOT EXISTS idx_sensor_data_room_category_timestamp 
  ON sensor_data(room_id, category, timestamp DESC);

-- Insert sample rooms
INSERT INTO rooms (id, name, floor, type) VALUES
  ('living-room', 'Living Room', 1, 'residential'),
  ('bedroom', 'Master Bedroom', 2, 'residential'),
  ('kitchen', 'Kitchen', 1, 'residential'),
  ('office', 'Home Office', 2, 'residential'),
  ('garage', 'Garage', 0, 'utility')
ON CONFLICT (id) DO NOTHING;

-- View for aggregated data (useful for analytics)
CREATE OR REPLACE VIEW sensor_data_hourly AS
SELECT 
  sensor_id,
  sensor_name,
  room_id,
  category,
  DATE_TRUNC('hour', timestamp) as hour,
  AVG(current_value) as avg_value,
  MIN(current_value) as min_value,
  MAX(current_value) as max_value,
  COUNT(*) as reading_count,
  unit,
  status
FROM sensor_data
GROUP BY sensor_id, sensor_name, room_id, category, DATE_TRUNC('hour', timestamp), unit, status;

-- View for daily aggregated data
CREATE OR REPLACE VIEW sensor_data_daily AS
SELECT 
  sensor_id,
  sensor_name,
  room_id,
  category,
  DATE_TRUNC('day', timestamp) as day,
  AVG(current_value) as avg_value,
  MIN(current_value) as min_value,
  MAX(current_value) as max_value,
  SUM(CASE WHEN category = 'power' OR category = 'energy' THEN current_value ELSE 0 END) as total_energy,
  COUNT(*) as reading_count,
  unit
FROM sensor_data
GROUP BY sensor_id, sensor_name, room_id, category, DATE_TRUNC('day', timestamp), unit;

-- Function to clean up old data (optional - for data retention)
CREATE OR REPLACE FUNCTION cleanup_old_sensor_data(days_to_keep INTEGER DEFAULT 90)
RETURNS INTEGER AS $$
DECLARE
  deleted_count INTEGER;
BEGIN
  DELETE FROM sensor_data
  WHERE timestamp < NOW() - (days_to_keep || ' days')::INTERVAL;
  
  GET DIAGNOSTICS deleted_count = ROW_COUNT;
  RETURN deleted_count;
END;
$$ LANGUAGE plpgsql;

-- Comments for documentation
COMMENT ON TABLE rooms IS 'Stores room/location information for the building';
COMMENT ON TABLE sensor_data IS 'Stores historical sensor readings with timestamp';
COMMENT ON COLUMN sensor_data.sensor_id IS 'Unique identifier for the sensor from Firebase';
COMMENT ON COLUMN sensor_data.category IS 'Type of sensor: temperature, humidity, occupancy, lighting, power, system';
COMMENT ON COLUMN sensor_data.status IS 'Sensor status: normal, warning, critical, offline';
COMMENT ON FUNCTION cleanup_old_sensor_data IS 'Deletes sensor data older than specified days (default 90)';
