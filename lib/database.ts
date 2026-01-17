import { Pool } from "pg";

let pool: Pool | null = null;
let isInitialized = false;

/**
 * Get or create database connection pool
 */
export function getPool(): Pool {
  if (!pool) {
    const connectionString =
      process.env.DATABASE_URL || process.env.POSTGRES_URL;
    if (!connectionString) {
      throw new Error("DATABASE_URL or POSTGRES_URL must be set");
    }

    pool = new Pool({
      connectionString,
      ssl: { rejectUnauthorized: false },
      max: 20,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 5000,
    });

    pool.on("error", () => {
      pool = null;
    });
  }

  return pool;
}

/**
 * Initialize database tables and indexes
 */
export async function initializeDatabase(): Promise<void> {
  if (isInitialized) return;

  const client = getPool();

  try {
    // Create rooms table
    await client.query(`
      CREATE TABLE IF NOT EXISTS rooms (
        id VARCHAR(50) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        floor INT,
        type VARCHAR(100),
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create room_sensors table
    await client.query(`
      CREATE TABLE IF NOT EXISTS room_sensors (
        id SERIAL PRIMARY KEY,
        room_id VARCHAR(50) NOT NULL REFERENCES rooms(id) ON DELETE CASCADE,
        temperature NUMERIC(5,2),
        humidity NUMERIC(5,2),
        light NUMERIC(8,2),
        motion BOOLEAN,
        timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create pzem_data table
    await client.query(`
      CREATE TABLE IF NOT EXISTS pzem_data (
        id SERIAL PRIMARY KEY,
        current NUMERIC(10,3),
        voltage NUMERIC(10,2),
        power NUMERIC(10,2),
        energy NUMERIC(12,3),
        frequency NUMERIC(5,2),
        pf NUMERIC(4,3),
        timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create relay_states table
    await client.query(`
      CREATE TABLE IF NOT EXISTS relay_states (
        id VARCHAR(100) PRIMARY KEY,
        room_id VARCHAR(50) NOT NULL REFERENCES rooms(id) ON DELETE CASCADE,
        relay_type VARCHAR(50) NOT NULL,
        state BOOLEAN NOT NULL DEFAULT FALSE,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create indexes for performance
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_room_sensors_timestamp
      ON room_sensors(timestamp DESC)
    `);

    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_room_sensors_room_timestamp
      ON room_sensors(room_id, timestamp DESC)
    `);

    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_pzem_data_timestamp
      ON pzem_data(timestamp DESC)
    `);

    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_relay_states_room_id
      ON relay_states(room_id)
    `);

    // Insert default rooms
    await client.query(`
      INSERT INTO rooms (id, name, floor, type) VALUES
        ('unknown', 'Unknown', 0, 'utility'),
        ('living_room', 'Living Room', 1, 'residential'),
        ('bedroom', 'Bedroom', 1, 'residential')
      ON CONFLICT (id) DO NOTHING
    `);

    isInitialized = true;
  } catch (error) {
    console.error("Database initialization error:", error);
    throw error;
  }
}

/**
 * Test database connection
 */
export async function testConnection(): Promise<boolean> {
  try {
    await getPool().query("SELECT 1");
    return true;
  } catch {
    return false;
  }
}

/**
 * Get all rooms
 */
export async function getRooms(): Promise<DBRoom[]> {
  await initializeDatabase();
  const result = await getPool().query(
    "SELECT id, name, floor, type, updated_at FROM rooms ORDER BY name",
  );
  return result.rows;
}

/**
 * Get total count of room sensor records
 */
export async function getRoomSensorCount(): Promise<number> {
  await initializeDatabase();
  const result = await getPool().query(
    "SELECT COUNT(*) as count FROM room_sensors",
  );
  return parseInt(result.rows[0].count, 10);
}

/**
 * Get total count of PZEM records
 */
export async function getPZEMDataCount(): Promise<number> {
  await initializeDatabase();
  const result = await getPool().query(
    "SELECT COUNT(*) as count FROM pzem_data",
  );
  return parseInt(result.rows[0].count, 10);
}

/**
 * Upsert a room
 */
export async function upsertRoom(
  id: string,
  name: string,
  floor: number = 1,
  type: string = "residential",
): Promise<void> {
  await initializeDatabase();
  await getPool().query(
    `INSERT INTO rooms (id, name, floor, type, updated_at)
     VALUES ($1, $2, $3, $4, CURRENT_TIMESTAMP)
     ON CONFLICT (id) DO UPDATE SET
       name = EXCLUDED.name,
       floor = EXCLUDED.floor,
       type = EXCLUDED.type,
       updated_at = CURRENT_TIMESTAMP`,
    [id, name, floor, type],
  );
}

/**
 * Batch insert room sensor data
 */
export async function batchInsertRoomSensorData(
  records: Array<{
    room_id: string;
    temperature?: number;
    humidity?: number;
    light?: number;
    motion?: boolean;
    timestamp?: Date;
  }>,
): Promise<void> {
  if (!records.length) return;

  await initializeDatabase();

  const values = records
    .map(
      (_, i) =>
        `($${i * 6 + 1}, $${i * 6 + 2}, $${i * 6 + 3}, $${i * 6 + 4}, $${i * 6 + 5}, $${i * 6 + 6})`,
    )
    .join(", ");

  const params = records.flatMap((r) => [
    r.room_id,
    r.temperature ?? null,
    r.humidity ?? null,
    r.light ?? null,
    r.motion ?? null,
    r.timestamp || new Date(),
  ]);

  await getPool().query(
    `INSERT INTO room_sensors (room_id, temperature, humidity, light, motion, timestamp)
     VALUES ${values}`,
    params,
  );
}

/**
 * Batch insert PZEM data
 */
export async function batchInsertPZEMData(
  records: Array<{
    current?: number;
    voltage?: number;
    power?: number;
    energy?: number;
    frequency?: number;
    pf?: number;
    timestamp?: Date;
  }>,
): Promise<void> {
  if (!records.length) return;

  await initializeDatabase();

  const values = records
    .map(
      (_, i) =>
        `($${i * 7 + 1}, $${i * 7 + 2}, $${i * 7 + 3}, $${i * 7 + 4}, $${i * 7 + 5}, $${i * 7 + 6}, $${i * 7 + 7})`,
    )
    .join(", ");

  const params = records.flatMap((r) => [
    r.current ?? null,
    r.voltage ?? null,
    r.power ?? null,
    r.energy ?? null,
    r.frequency ?? null,
    r.pf ?? null,
    r.timestamp || new Date(),
  ]);

  await getPool().query(
    `INSERT INTO pzem_data (current, voltage, power, energy, frequency, pf, timestamp)
     VALUES ${values}`,
    params,
  );
}

/**
 * Get historical room sensor data with optional aggregation
 */
export async function getHistoricalRoomSensorData(
  startDate: Date,
  endDate: Date,
  roomIds?: string[],
  aggregation: "raw" | "hourly" = "raw",
): Promise<HistoricalRoomSensorData[]> {
  await initializeDatabase();

  const isAggregated = aggregation === "hourly";
  const timeField = isAggregated
    ? "DATE_TRUNC('hour', rs.timestamp)"
    : "rs.timestamp";

  const selectFields = isAggregated
    ? `
        AVG(rs.temperature) as temperature,
        AVG(rs.humidity) as humidity,
        AVG(rs.light) as light,
        BOOL_OR(rs.motion) as motion
      `
    : `
        rs.temperature,
        rs.humidity,
        rs.light,
        rs.motion
      `;

  let query = `
    SELECT
      ${timeField} as timestamp,
      rs.room_id as "roomId",
      r.name as "roomName",
      ${selectFields}
    FROM room_sensors rs
    JOIN rooms r ON rs.room_id = r.id
    WHERE rs.timestamp >= $1 AND rs.timestamp <= $2
  `;

  const params: (Date | string[])[] = [startDate, endDate];

  if (roomIds?.length) {
    query += ` AND rs.room_id = ANY($3)`;
    params.push(roomIds);
  }

  if (isAggregated) {
    query += ` GROUP BY ${timeField}, rs.room_id, r.name`;
  }

  query += ` ORDER BY timestamp ASC`;

  console.log("[DB] Fetching room sensor data:", {
    startDate: startDate.toISOString(),
    endDate: endDate.toISOString(),
    roomIds,
    aggregation,
  });

  const result = await getPool().query(query, params);

  console.log(`[DB] Retrieved ${result.rows.length} room sensor records`);

  return result.rows;
}

/**
 * Get historical PZEM data with optional aggregation
 */
export async function getHistoricalPZEMData(
  startDate: Date,
  endDate: Date,
  aggregation: "raw" | "hourly" = "raw",
): Promise<HistoricalPZEMData[]> {
  await initializeDatabase();

  const isAggregated = aggregation === "hourly";
  const timeField = isAggregated
    ? "DATE_TRUNC('hour', pz.timestamp)"
    : "pz.timestamp";

  const selectFields = isAggregated
    ? `
        AVG(pz.current) as current,
        AVG(pz.voltage) as voltage,
        AVG(pz.power) as power,
        AVG(pz.energy) as energy,
        AVG(pz.frequency) as frequency,
        AVG(pz.pf) as pf
      `
    : `
        pz.current,
        pz.voltage,
        pz.power,
        pz.energy,
        pz.frequency,
        pz.pf
      `;

  let query = `
    SELECT
      ${timeField} as timestamp,
      ${selectFields}
    FROM pzem_data pz
    WHERE pz.timestamp >= $1 AND pz.timestamp <= $2
  `;

  if (isAggregated) {
    query += ` GROUP BY ${timeField}`;
  }

  query += ` ORDER BY timestamp ASC`;

  console.log("[DB] Fetching PZEM data:", {
    startDate: startDate.toISOString(),
    endDate: endDate.toISOString(),
    aggregation,
  });

  const result = await getPool().query(query, [startDate, endDate]);

  console.log(`[DB] Retrieved ${result.rows.length} PZEM records`);

  return result.rows;
}

/**
 * Get latest room sensor readings
 */
export async function getLatestRoomSensorReadings(
  roomId?: string,
): Promise<RoomSensorRecord[]> {
  await initializeDatabase();

  let query = `
    SELECT
      rs.id,
      rs.room_id,
      rs.temperature,
      rs.humidity,
      rs.light,
      rs.motion,
      rs.timestamp,
      r.name as room_name
    FROM room_sensors rs
    JOIN rooms r ON rs.room_id = r.id
  `;

  const params: string[] = [];

  if (roomId) {
    query += ` WHERE rs.room_id = $1`;
    params.push(roomId);
  }

  query += ` ORDER BY rs.room_id, rs.timestamp DESC`;

  const result = await getPool().query(query, params);
  return result.rows;
}

/**
 * Get latest PZEM reading
 */
export async function getLatestPZEMReading(): Promise<PZEMRecord | null> {
  await initializeDatabase();

  const result = await getPool().query(
    `SELECT id, current, voltage, power, energy, frequency, pf, timestamp
     FROM pzem_data
     ORDER BY timestamp DESC
     LIMIT 1`,
  );

  return result.rows[0] || null;
}

/**
 * Clean up old room sensor data
 */
export async function cleanupOldRoomSensorData(
  daysToKeep: number = 90,
): Promise<number> {
  await initializeDatabase();

  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - daysToKeep);

  const result = await getPool().query(
    `DELETE FROM room_sensors WHERE timestamp < $1`,
    [cutoffDate],
  );

  return result.rowCount || 0;
}

/**
 * Clean up old PZEM data
 */
export async function cleanupOldPZEMData(
  daysToKeep: number = 90,
): Promise<number> {
  await initializeDatabase();

  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - daysToKeep);

  const result = await getPool().query(
    `DELETE FROM pzem_data WHERE timestamp < $1`,
    [cutoffDate],
  );

  return result.rowCount || 0;
}

/**
 * Upsert relay state
 */
export async function upsertRelayState(
  relayId: string,
  roomId: string,
  relayType: string,
  state: boolean,
): Promise<void> {
  await initializeDatabase();

  await getPool().query(
    `INSERT INTO relay_states (id, room_id, relay_type, state, updated_at)
     VALUES ($1, $2, $3, $4, CURRENT_TIMESTAMP)
     ON CONFLICT (id) DO UPDATE SET
       state = EXCLUDED.state,
       updated_at = CURRENT_TIMESTAMP`,
    [relayId, roomId, relayType, state],
  );
}

/**
 * Get relay state by ID
 */
export async function getRelayState(
  relayId: string,
): Promise<RelayStateRecord | null> {
  await initializeDatabase();

  const result = await getPool().query(
    `SELECT id, room_id, relay_type, state, updated_at FROM relay_states WHERE id = $1`,
    [relayId],
  );

  return result.rows[0] || null;
}

/**
 * Get all relay states for a room
 */
export async function getRoomRelayStates(
  roomId: string,
): Promise<RelayStateRecord[]> {
  await initializeDatabase();

  const result = await getPool().query(
    `SELECT id, room_id, relay_type, state, updated_at
     FROM relay_states
     WHERE room_id = $1
     ORDER BY updated_at DESC`,
    [roomId],
  );

  return result.rows;
}

/**
 * Get all relay states
 */
export async function getAllRelayStates(): Promise<RelayStateRecord[]> {
  await initializeDatabase();

  const result = await getPool().query(
    `SELECT id, room_id, relay_type, state, updated_at
     FROM relay_states
     ORDER BY updated_at DESC`,
  );

  return result.rows;
}

/**
 * Close database connection pool
 */
export async function closePool(): Promise<void> {
  if (pool) {
    await pool.end();
    pool = null;
  }
}
