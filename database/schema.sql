CREATE TABLE
  IF NOT EXISTS rooms (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    floor INT,
    type VARCHAR(100),
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );

CREATE TABLE
  IF NOT EXISTS room_sensors (
    id SERIAL PRIMARY KEY,
    room_id VARCHAR(50) NOT NULL REFERENCES rooms (id),
    temperature NUMERIC(5, 2),
    humidity NUMERIC(5, 2),
    light NUMERIC(8, 2),
    motion BOOLEAN,
    timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
  );

CREATE TABLE
  IF NOT EXISTS pzem_data (
    id SERIAL PRIMARY KEY,
    current NUMERIC(10, 3),
    voltage NUMERIC(10, 2),
    power NUMERIC(10, 2),
    energy NUMERIC(12, 3),
    frequency NUMERIC(5, 2),
    pf NUMERIC(4, 3),
    timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
  );

CREATE TABLE
  IF NOT EXISTS relay_states (
    id VARCHAR(100) PRIMARY KEY,
    room_id VARCHAR(50) NOT NULL REFERENCES rooms (id),
    relay_type VARCHAR(50) NOT NULL,
    state BOOLEAN NOT NULL DEFAULT FALSE,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );

CREATE INDEX IF NOT EXISTS idx_room_sensors_room_timestamp ON room_sensors (room_id, timestamp DESC);

CREATE INDEX IF NOT EXISTS idx_pzem_data_timestamp ON pzem_data (timestamp DESC);

CREATE INDEX IF NOT EXISTS idx_relay_states_room_id ON relay_states (room_id);

INSERT INTO
  rooms (id, name, floor, type)
VALUES
  ('unknown', 'Unknown', 0, 'utility'),
  ('living_room', 'Living Room', 1, 'residential'),
  ('bedroom', 'Bedroom', 1, 'residential') ON CONFLICT (id) DO NOTHING;