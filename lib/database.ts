import { Pool, QueryResult } from "pg";
let pool: Pool | null = null;

export function getPool(): Pool {
  if (!pool) {
    const connectionString =
      process.env.DATABASE_URL || process.env.POSTGRES_URL;
    if (!connectionString) {
      throw new Error(
        "DATABASE_URL or POSTGRES_URL must be set for Neon Postgres connection.",
      );
    }
    pool = new Pool({
      connectionString,
      ssl: { rejectUnauthorized: false },
      max: 20,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 5000,
    });
    pool.on("error", (err) => {
      console.error("Database pool error:", err.message);
      pool = null;
    });
  }
  return pool;
}

// Initialize database tables if they don't exist
let isInitialized = false;

export async function initializeDatabase(): Promise<void> {
  if (isInitialized) return;

  try {
    const pool = getPool();

    // Create rooms table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS rooms (
        id VARCHAR(50) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        floor INTEGER,
        type VARCHAR(100),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create room_sensors table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS room_sensors (
        id SERIAL PRIMARY KEY,
        room_id VARCHAR(50) NOT NULL REFERENCES rooms(id),
        temperature NUMERIC(5, 2),
        humidity NUMERIC(5, 2),
        light NUMERIC(8, 2),
        motion BOOLEAN,
        timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create pzem_data table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS pzem_data (
        id SERIAL PRIMARY KEY,
        current NUMERIC(10, 3),
        voltage NUMERIC(10, 2),
        power NUMERIC(10, 2),
        energy NUMERIC(12, 3),
        frequency NUMERIC(5, 2),
        pf NUMERIC(4, 3),
        timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create indexes for room_sensors
    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_room_sensors_timestamp ON room_sensors(timestamp DESC)
    `);
    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_room_sensors_room_id ON room_sensors(room_id)
    `);
    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_room_sensors_room_timestamp ON room_sensors(room_id, timestamp DESC)
    `);

    // Create indexes for pzem_data
    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_pzem_data_timestamp ON pzem_data(timestamp DESC)
    `);

    // Insert default rooms if table is empty
    await pool.query(`
      INSERT INTO rooms (id, name, floor, type) VALUES
        ('unknown', 'Unknown', 0, 'utility'),
        ('living_room', 'Living Room', 1, 'residential'),
        ('bedroom', 'Bedroom', 1, 'residential')
      ON CONFLICT (id) DO NOTHING
    `);

    isInitialized = true;
    console.log("Database initialized successfully");
  } catch (error) {
    console.error("Database initialization error:", error);
    throw error;
  }
}

export async function getRooms(): Promise<DBRoom[]> {
  await initializeDatabase();
  const result: QueryResult<DBRoom> = await getPool().query(
    "SELECT * FROM rooms ORDER BY name",
  );
  return result.rows;
}

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
       name = EXCLUDED.name, floor = EXCLUDED.floor, 
       type = EXCLUDED.type, updated_at = CURRENT_TIMESTAMP`,
    [id, name, floor, type],
  );
}

/**
 * Insert room sensor data
 */
export async function insertRoomSensorData(data: {
  room_id: string;
  temperature?: number;
  humidity?: number;
  light?: number;
  motion?: boolean;
  timestamp?: Date;
}): Promise<void> {
  await initializeDatabase();
  await getPool().query(
    `INSERT INTO room_sensors 
      (room_id, temperature, humidity, light, motion, timestamp)
     VALUES ($1, $2, $3, $4, $5, $6)`,
    [
      data.room_id,
      data.temperature ?? null,
      data.humidity ?? null,
      data.light ?? null,
      data.motion ?? null,
      data.timestamp || new Date(),
    ],
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
  if (records.length === 0) return;
  await initializeDatabase();

  const values = records
    .map(
      (_, i) =>
        `($${i * 6 + 1}, $${i * 6 + 2}, $${i * 6 + 3}, $${i * 6 + 4}, $${
          i * 6 + 5
        }, $${i * 6 + 6})`,
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
    `INSERT INTO room_sensors 
      (room_id, temperature, humidity, light, motion, timestamp)
     VALUES ${values}`,
    params,
  );
}

/**
 * Insert PZEM power meter data
 */
export async function insertPZEMData(data: {
  current?: number;
  voltage?: number;
  power?: number;
  energy?: number;
  frequency?: number;
  pf?: number;
  timestamp?: Date;
}): Promise<void> {
  await initializeDatabase();
  await getPool().query(
    `INSERT INTO pzem_data 
      (current, voltage, power, energy, frequency, pf, timestamp)
     VALUES ($1, $2, $3, $4, $5, $6, $7)`,
    [
      data.current ?? null,
      data.voltage ?? null,
      data.power ?? null,
      data.energy ?? null,
      data.frequency ?? null,
      data.pf ?? null,
      data.timestamp || new Date(),
    ],
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
  if (records.length === 0) return;
  await initializeDatabase();

  const values = records
    .map(
      (_, i) =>
        `($${i * 7 + 1}, $${i * 7 + 2}, $${i * 7 + 3}, $${i * 7 + 4}, $${
          i * 7 + 5
        }, $${i * 7 + 6}, $${i * 7 + 7})`,
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
    `INSERT INTO pzem_data 
      (current, voltage, power, energy, frequency, pf, timestamp)
     VALUES ${values}`,
    params,
  );
}

/**
 * Get historical room sensor data for specified date range and rooms
 */
export async function getHistoricalRoomSensorData(
  startDate: Date,
  endDate: Date,
  roomIds?: string[],
  aggregation: "raw" | "hourly" = "raw",
): Promise<HistoricalRoomSensorData[]> {
  await initializeDatabase();
  const pool = getPool();

  let query = `
    SELECT 
      ${aggregation === "hourly" ? "DATE_TRUNC('hour', rs.timestamp)" : "rs.timestamp"} as timestamp,
      rs.room_id as "roomId",
      r.name as "roomName",
      ${aggregation === "hourly" ? "AVG(rs.temperature)" : "rs.temperature"} as temperature,
      ${aggregation === "hourly" ? "AVG(rs.humidity)" : "rs.humidity"} as humidity,
      ${aggregation === "hourly" ? "AVG(rs.light)" : "rs.light"} as light,
      ${aggregation === "hourly" ? "BOOL_OR(rs.motion)" : "rs.motion"} as motion
    FROM room_sensors rs
    JOIN rooms r ON rs.room_id = r.id
    WHERE rs.timestamp BETWEEN $1 AND $2
  `;

  const params: any[] = [startDate, endDate];

  if (roomIds && roomIds.length > 0) {
    query += ` AND rs.room_id = ANY($3)`;
    params.push(roomIds);
  }

  if (aggregation === "hourly") {
    query += `
    GROUP BY DATE_TRUNC('hour', rs.timestamp), rs.room_id, r.name
    `;
  }

  query += `
    ORDER BY timestamp ASC
  `;

  const result: QueryResult<HistoricalRoomSensorData> = await pool.query(
    query,
    params,
  );
  return result.rows;
}

/**
 * Get historical PZEM power data for specified date range
 */
export async function getHistoricalPZEMData(
  startDate: Date,
  endDate: Date,
  aggregation: "raw" | "hourly" = "raw",
): Promise<HistoricalPZEMData[]> {
  await initializeDatabase();
  const pool = getPool();

  let query = `
    SELECT 
      ${aggregation === "hourly" ? "DATE_TRUNC('hour', pz.timestamp)" : "pz.timestamp"} as timestamp,
      ${aggregation === "hourly" ? "AVG(pz.current)" : "pz.current"} as current,
      ${aggregation === "hourly" ? "AVG(pz.voltage)" : "pz.voltage"} as voltage,
      ${aggregation === "hourly" ? "AVG(pz.power)" : "pz.power"} as power,
      ${aggregation === "hourly" ? "AVG(pz.energy)" : "pz.energy"} as energy,
      ${aggregation === "hourly" ? "AVG(pz.frequency)" : "pz.frequency"} as frequency,
      ${aggregation === "hourly" ? "AVG(pz.pf)" : "pz.pf"} as pf
    FROM pzem_data pz
    WHERE pz.timestamp BETWEEN $1 AND $2
  `;

  if (aggregation === "hourly") {
    query += ` GROUP BY DATE_TRUNC('hour', pz.timestamp)`;
  }

  query += ` ORDER BY timestamp ASC`;

  const result: QueryResult<HistoricalPZEMData> = await pool.query(query, [
    startDate,
    endDate,
  ]);
  return result.rows;
}

/**
 * Get the latest room sensor readings
 */
export async function getLatestRoomSensorReadings(
  roomId?: string,
): Promise<RoomSensorRecord[]> {
  await initializeDatabase();
  const pool = getPool();

  let query = `
    SELECT DISTINCT ON (rs.room_id) 
      rs.*,
      r.name as room_name
    FROM room_sensors rs
    JOIN rooms r ON rs.room_id = r.id
  `;

  const params: any[] = [];

  if (roomId) {
    query += ` WHERE rs.room_id = $1`;
    params.push(roomId);
  }

  query += `
    ORDER BY rs.room_id, rs.timestamp DESC
  `;

  const result: QueryResult<RoomSensorRecord> = await pool.query(query, params);
  return result.rows;
}

/**
 * Get the latest PZEM reading
 */
export async function getLatestPZEMReading(): Promise<PZEMRecord | null> {
  await initializeDatabase();
  const pool = getPool();

  const query = `
    SELECT *
    FROM pzem_data
    ORDER BY timestamp DESC
    LIMIT 1
  `;

  const result: QueryResult<PZEMRecord> = await pool.query(query);
  return result.rows[0] || null;
}

export async function cleanupOldRoomSensorData(
  daysToKeep: number = 90,
): Promise<number> {
  await initializeDatabase();
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - daysToKeep);

  const result = await getPool().query(
    "DELETE FROM room_sensors WHERE timestamp < $1",
    [cutoffDate],
  );
  return result.rowCount || 0;
}

export async function cleanupOldPZEMData(
  daysToKeep: number = 90,
): Promise<number> {
  await initializeDatabase();
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - daysToKeep);

  const result = await getPool().query(
    "DELETE FROM pzem_data WHERE timestamp < $1",
    [cutoffDate],
  );
  return result.rowCount || 0;
}

export async function testConnection(): Promise<boolean> {
  try {
    await getPool().query("SELECT 1");
    return true;
  } catch (error) {
    console.error("Database connection failed:", error);
    return false;
  }
}

export async function closePool(): Promise<void> {
  if (pool) {
    await pool.end();
    pool = null;
  }
}
