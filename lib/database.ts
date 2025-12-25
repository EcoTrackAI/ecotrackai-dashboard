import { Pool, QueryResult } from "pg";

let pool: Pool | null = null;

export function getPool(): Pool {
  if (!pool) {
    pool = new Pool({
      host: process.env.POSTGRES_HOST || "localhost",
      port: parseInt(process.env.POSTGRES_PORT || "5432"),
      database: process.env.POSTGRES_DATABASE || "ecotrackai",
      user: process.env.POSTGRES_USER || "postgres",
      password: process.env.POSTGRES_PASSWORD || "",
      max: 20, // Maximum number of clients in the pool
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 2000,
    });

    pool.on("error", (err) => {
      console.error("Unexpected error on idle client", err);
    });
  }
  return pool;
}

export async function getRooms(): Promise<DBRoom[]> {
  const result: QueryResult<DBRoom> = await getPool().query("SELECT * FROM rooms ORDER BY name");
  return result.rows;
}

export async function upsertRoom(
  id: string,
  name: string,
  floor: number = 1,
  type: string = "residential"
): Promise<void> {
  await getPool().query(
    `INSERT INTO rooms (id, name, floor, type, updated_at)
     VALUES ($1, $2, $3, $4, CURRENT_TIMESTAMP)
     ON CONFLICT (id) DO UPDATE SET 
       name = EXCLUDED.name, floor = EXCLUDED.floor, 
       type = EXCLUDED.type, updated_at = CURRENT_TIMESTAMP`,
    [id, name, floor, type]
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
    ]
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
  }>
): Promise<void> {
  if (records.length === 0) return;

  const values = records
    .map((_, i) => `($${i * 9 + 1}, $${i * 9 + 2}, $${i * 9 + 3}, $${i * 9 + 4}, $${i * 9 + 5}, $${i * 9 + 6}, $${i * 9 + 7}, $${i * 9 + 8}, $${i * 9 + 9})`)
    .join(", ");

  const params = records.flatMap((r) => [
    r.sensor_id, r.sensor_name, r.room_id, r.category,
    r.current_value, r.unit, r.status, r.description || null, r.timestamp || new Date(),
  ]);

  await getPool().query(
    `INSERT INTO sensor_data 
      (sensor_id, sensor_name, room_id, category, current_value, unit, status, description, timestamp)
     VALUES ${values}`,
    params
  );
}

/**
 * Get historical sensor data for specified date range and rooms
 */
export async function getHistoricalData(
  startDate: Date,
  endDate: Date,
  roomIds?: string[]
): Promise<HistoricalDataPoint[]> {
  const pool = getPool();

  let query = `
    SELECT 
      sd.timestamp,
      sd.room_id as "roomId",
      r.name as "roomName",
      MAX(CASE WHEN sd.category = 'energy' THEN sd.current_value ELSE 0 END) as energy,
      MAX(CASE WHEN sd.category = 'power' THEN sd.current_value ELSE 0 END) as power,
      MAX(CASE WHEN sd.category = 'temperature' THEN sd.current_value ELSE 0 END) as temperature,
      MAX(CASE WHEN sd.category = 'humidity' THEN sd.current_value ELSE 0 END) as humidity,
      MAX(CASE WHEN sd.category = 'lighting' THEN sd.current_value ELSE 0 END) as lighting,
      MAX(CASE WHEN sd.category = 'occupancy' THEN sd.current_value ELSE 0 END) as motion
    FROM sensor_data sd
    JOIN rooms r ON sd.room_id = r.id
    WHERE sd.timestamp BETWEEN $1 AND $2
  `;

  const params: any[] = [startDate, endDate];

  if (roomIds && roomIds.length > 0) {
    query += ` AND sd.room_id = ANY($3)`;
    params.push(roomIds);
  }

  query += `
    GROUP BY sd.timestamp, sd.room_id, r.name
    ORDER BY sd.timestamp ASC
  `;

  const result: QueryResult<HistoricalDataPoint> = await pool.query(
    query,
    params
  );
  return result.rows;
}

/**
 * Get aggregated hourly data (useful for longer time ranges)
 */
export async function getAggregatedHourlyData(
  startDate: Date,
  endDate: Date,
  roomIds?: string[]
): Promise<HistoricalDataPoint[]> {
  const pool = getPool();

  let query = `
    SELECT 
      DATE_TRUNC('hour', sd.timestamp) as timestamp,
      sd.room_id as "roomId",
      r.name as "roomName",
      AVG(CASE WHEN sd.category = 'energy' THEN sd.current_value ELSE 0 END) as energy,
      AVG(CASE WHEN sd.category = 'power' THEN sd.current_value ELSE 0 END) as power,
      AVG(CASE WHEN sd.category = 'temperature' THEN sd.current_value ELSE 0 END) as temperature,
      AVG(CASE WHEN sd.category = 'humidity' THEN sd.current_value ELSE 0 END) as humidity,
      AVG(CASE WHEN sd.category = 'lighting' THEN sd.current_value ELSE 0 END) as lighting,
      AVG(CASE WHEN sd.category = 'occupancy' THEN sd.current_value ELSE 0 END) as motion
    FROM sensor_data sd
    JOIN rooms r ON sd.room_id = r.id
    WHERE sd.timestamp BETWEEN $1 AND $2
  `;

  const params: any[] = [startDate, endDate];

  if (roomIds && roomIds.length > 0) {
    query += ` AND sd.room_id = ANY($3)`;
    params.push(roomIds);
  }

  query += `
    GROUP BY DATE_TRUNC('hour', sd.timestamp), sd.room_id, r.name
    ORDER BY timestamp ASC
  `;

  const result: QueryResult<HistoricalDataPoint> = await pool.query(
    query,
    params
  );
  return result.rows;
}

/**
 * Get the latest sensor readings
 */
export async function getLatestSensorReadings(
  roomId?: string
): Promise<SensorDataRecord[]> {
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

  const result: QueryResult<SensorDataRecord> = await pool.query(
    query,
    params
  );
  return result.rows;
}

export async function cleanupOldData(daysToKeep: number = 90): Promise<number> {
  const result = await getPool().query("SELECT cleanup_old_sensor_data($1)", [daysToKeep]);
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
