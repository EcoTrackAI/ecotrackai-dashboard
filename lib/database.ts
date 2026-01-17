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

    // Create sensor_data table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS sensor_data (
        id SERIAL PRIMARY KEY,
        sensor_id VARCHAR(100) NOT NULL,
        sensor_name VARCHAR(255) NOT NULL,
        room_id VARCHAR(50) REFERENCES rooms(id),
        category VARCHAR(50) NOT NULL,
        current_value NUMERIC(10, 2) NOT NULL,
        unit VARCHAR(20) NOT NULL,
        status VARCHAR(20) NOT NULL,
        description TEXT,
        timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create indexes
    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_sensor_data_timestamp ON sensor_data(timestamp DESC)
    `);
    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_sensor_data_room_id ON sensor_data(room_id)
    `);
    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_sensor_data_category ON sensor_data(category)
    `);
    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_sensor_data_sensor_id ON sensor_data(sensor_id)
    `);

    // Insert default rooms if table is empty
    await pool.query(`
      INSERT INTO rooms (id, name, floor, type) VALUES
        ('living-room', 'Living Room', 1, 'residential'),
        ('bedroom', 'Master Bedroom', 2, 'residential'),
        ('kitchen', 'Kitchen', 1, 'residential'),
        ('office', 'Home Office', 2, 'residential'),
        ('garage', 'Garage', 0, 'utility')
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

export async function insertSensorData(data: {
  sensor_id: string;
  sensor_name: string;
  room_id: string;
  category: string;
  current_value: number;
  unit: string;
  status: string;
  description?: string;
  timestamp?: Date;
}): Promise<void> {
  await initializeDatabase();
  await getPool().query(
    `INSERT INTO sensor_data 
      (sensor_id, sensor_name, room_id, category, current_value, unit, status, description, timestamp)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
    [
      data.sensor_id,
      data.sensor_name,
      data.room_id,
      data.category,
      data.current_value,
      data.unit,
      data.status,
      data.description || null,
      data.timestamp || new Date(),
    ],
  );
}

export async function batchInsertSensorData(
  records: Array<{
    sensor_id: string;
    sensor_name: string;
    room_id: string;
    category: string;
    current_value: number;
    unit: string;
    status: string;
    description?: string;
    timestamp?: Date;
  }>,
): Promise<void> {
  if (records.length === 0) return;
  await initializeDatabase();

  const values = records
    .map(
      (_, i) =>
        `($${i * 9 + 1}, $${i * 9 + 2}, $${i * 9 + 3}, $${i * 9 + 4}, $${
          i * 9 + 5
        }, $${i * 9 + 6}, $${i * 9 + 7}, $${i * 9 + 8}, $${i * 9 + 9})`,
    )
    .join(", ");

  const params = records.flatMap((r) => [
    r.sensor_id,
    r.sensor_name,
    r.room_id,
    r.category,
    r.current_value,
    r.unit,
    r.status,
    r.description || null,
    r.timestamp || new Date(),
  ]);

  await getPool().query(
    `INSERT INTO sensor_data 
      (sensor_id, sensor_name, room_id, category, current_value, unit, status, description, timestamp)
     VALUES ${values}`,
    params,
  );
}

const SENSOR_CATEGORIES = [
  "energy",
  "power",
  "temperature",
  "humidity",
  "lighting",
  "occupancy",
];

function buildCategoryAggregates(aggFunc: string): string {
  return SENSOR_CATEGORIES.map(
    (cat) =>
      `${aggFunc}(CASE WHEN sd.category = '${cat}' THEN sd.current_value ELSE 0 END) as ${
        cat === "occupancy" ? "motion" : cat
      }`,
  ).join(",\n      ");
}

function buildHistoricalDataQuery(
  aggregation: "raw" | "hourly" = "raw",
): string {
  const isHourly = aggregation === "hourly";
  const timestamp = isHourly
    ? "DATE_TRUNC('hour', sd.timestamp)"
    : "sd.timestamp";
  const aggFunc = isHourly ? "AVG" : "MAX";

  return `
    SELECT 
      ${timestamp} as timestamp,
      sd.room_id as "roomId",
      r.name as "roomName",
      ${buildCategoryAggregates(aggFunc)}
    FROM sensor_data sd
    JOIN rooms r ON sd.room_id = r.id
    WHERE sd.timestamp BETWEEN $1 AND $2
  `;
}

/**
 * Get historical sensor data for specified date range and rooms
 */
export async function getHistoricalData(
  startDate: Date,
  endDate: Date,
  roomIds?: string[],
  aggregation: "raw" | "hourly" = "raw",
): Promise<HistoricalDataPoint[]> {
  await initializeDatabase();
  const pool = getPool();
  let query = buildHistoricalDataQuery(aggregation);
  const params: any[] = [startDate, endDate];

  if (roomIds && roomIds.length > 0) {
    query += ` AND sd.room_id = ANY($3)`;
    params.push(roomIds);
  }

  const groupBy =
    aggregation === "hourly"
      ? "DATE_TRUNC('hour', sd.timestamp), sd.room_id, r.name"
      : "sd.timestamp, sd.room_id, r.name";

  query += `
    GROUP BY ${groupBy}
    ORDER BY timestamp ASC
  `;

  const result: QueryResult<HistoricalDataPoint> = await pool.query(
    query,
    params,
  );
  return result.rows;
}

/**
 * Get the latest sensor readings
 */
export async function getLatestSensorReadings(
  roomId?: string,
): Promise<SensorDataRecord[]> {
  await initializeDatabase();
  const pool = getPool();

  let query = `
    SELECT DISTINCT ON (sensor_id) *
    FROM sensor_data
  `;

  const params: any[] = [];

  if (roomId) {
    query += ` WHERE room_id = $1`;
    params.push(roomId);
  }

  query += `
    ORDER BY sensor_id, timestamp DESC
  `;

  const result: QueryResult<SensorDataRecord> = await pool.query(query, params);
  return result.rows;
}

export async function cleanupOldData(daysToKeep: number = 90): Promise<number> {
  const result = await getPool().query("SELECT cleanup_old_sensor_data($1)", [
    daysToKeep,
  ]);
  return result.rows[0].cleanup_old_sensor_data;
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
