CREATE TABLE
  IF NOT EXISTS rooms (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    floor INTEGER,
    type VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );

CREATE TABLE
  IF NOT EXISTS sensor_data (
    id SERIAL PRIMARY KEY,
    sensor_id VARCHAR(100) NOT NULL,
    sensor_name VARCHAR(255) NOT NULL,
    room_id VARCHAR(50) REFERENCES rooms (id),
    category VARCHAR(50) NOT NULL,
    current_value NUMERIC(10, 2) NOT NULL,
    unit VARCHAR(20) NOT NULL,
    status VARCHAR(20) NOT NULL,
    description TEXT,
    timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );

CREATE INDEX IF NOT EXISTS idx_sensor_data_timestamp ON sensor_data (timestamp DESC);

CREATE INDEX IF NOT EXISTS idx_sensor_data_room_id ON sensor_data (room_id);

CREATE INDEX IF NOT EXISTS idx_sensor_data_category ON sensor_data (category);

CREATE INDEX IF NOT EXISTS idx_sensor_data_sensor_id ON sensor_data (sensor_id);

INSERT INTO
  rooms (id, name, floor, type)
VALUES
  ('unknown', 'Unknown', 0, 'utility'),
  ('bedroom', 'Bedroom', 1, 'residential'),
  ('living_room', 'Living Room', 1, 'residential') ON CONFLICT (id) DO NOTHING;