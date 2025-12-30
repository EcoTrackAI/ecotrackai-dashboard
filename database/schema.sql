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
  ('living-room', 'Living Room', 1, 'residential'),
  (
    'bedroom-master',
    'Master Bedroom',
    2,
    'residential'
  ),
  (
    'bedroom-guest',
    'Guest Bedroom',
    2,
    'residential'
  ),
  ('bedroom-1', 'Bedroom 1', 1, 'residential'),
  ('bedroom-2', 'Bedroom 2', 2, 'residential'),
  ('bedroom-3', 'Bedroom 3', 3, 'residential'),
  ('kitchen', 'Kitchen', 1, 'residential'),
  ('bathroom-1', 'Bathroom 1', 1, 'residential'),
  ('bathroom-2', 'Bathroom 2', 2, 'residential'),
  ('bathroom-3', 'Bathroom 3', 3, 'residential'),
  ('dining-room', 'Dining Room', 1, 'residential'),
  ('home-office', 'Home Office', 2, 'residential'),
  ('garage', 'Garage', 0, 'utility'),
  ('laundry', 'Laundry Room', 1, 'utility'),
  ('storage', 'Storage Room', 1, 'utility'),
  ('balcony-1', 'Balcony 1', 1, 'residential'),
  ('balcony-2', 'Balcony 2', 2, 'residential'),
  ('balcony-3', 'Balcony 3', 3, 'residential'),
  ('basement', 'Basement', 0, 'utility'),
  ('attic', 'Attic', 3, 'utility'),
  ('playroom', 'Playroom', 1, 'residential'),
  ('gym', 'Gym', 2, 'residential'),
  ('library', 'Library', 2, 'residential'),
  ('mezzanine', 'Mezzanine', 2, 'residential'),
  ('other-1', 'Other Room 1', 1, 'other'),
  ('other-2', 'Other Room 2', 2, 'other'),
  ('other-3', 'Other Room 3', 3, 'other') ON CONFLICT (id) DO NOTHING;