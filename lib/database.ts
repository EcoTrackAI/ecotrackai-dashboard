import { Pool } from "pg";
let pool: Pool | null = null;

export function getPool(): Pool {
  if (!pool) {
    const connectionString = process.env.DATABASE_URL || process.env.POSTGRES_URL;
    if (!connectionString) throw new Error("DATABASE_URL or POSTGRES_URL must be set");
    pool = new Pool({
      connectionString,
      ssl: { rejectUnauthorized: false },
      max: 20,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 5000,
    });
    pool.on("error", () => { pool = null; });
  }
  return pool;
}

// Initialize database tables if they don't exist
let isInitialized = false;

export async function initializeDatabase(): Promise<void> {
  if (isInitialized) return;
  try {
    const p = getPool();
    await p.query(`CREATE TABLE IF NOT EXISTS rooms (id VARCHAR(50) PRIMARY KEY, name VARCHAR(255) NOT NULL, floor INT, type VARCHAR(100), updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP)`);
    await p.query(`CREATE TABLE IF NOT EXISTS room_sensors (id SERIAL PRIMARY KEY, room_id VARCHAR(50) NOT NULL REFERENCES rooms(id), temperature NUMERIC(5,2), humidity NUMERIC(5,2), light NUMERIC(8,2), motion BOOLEAN, timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP)`);
    await p.query(`CREATE TABLE IF NOT EXISTS pzem_data (id SERIAL PRIMARY KEY, current NUMERIC(10,3), voltage NUMERIC(10,2), power NUMERIC(10,2), energy NUMERIC(12,3), frequency NUMERIC(5,2), pf NUMERIC(4,3), timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP)`);
    await p.query(`CREATE TABLE IF NOT EXISTS relay_states (id VARCHAR(100) PRIMARY KEY, room_id VARCHAR(50) NOT NULL REFERENCES rooms(id), relay_type VARCHAR(50) NOT NULL, state BOOLEAN NOT NULL DEFAULT FALSE, updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP)`);
    await p.query(`CREATE INDEX IF NOT EXISTS idx_room_sensors_room_timestamp ON room_sensors(room_id, timestamp DESC)`);
    await p.query(`CREATE INDEX IF NOT EXISTS idx_pzem_data_timestamp ON pzem_data(timestamp DESC)`);
    await p.query(`CREATE INDEX IF NOT EXISTS idx_relay_states_room_id ON relay_states(room_id)`);
    await p.query(`INSERT INTO rooms (id, name, floor, type) VALUES ('unknown', 'Unknown', 0, 'utility'), ('living_room', 'Living Room', 1, 'residential'), ('bedroom', 'Bedroom', 1, 'residential') ON CONFLICT (id) DO NOTHING`);
    isInitialized = true;
  } catch (error) {
    throw error;
  }
}

export async function getRooms(): Promise<DBRoom[]> {
  await initializeDatabase();
  const result = await getPool().query("SELECT * FROM rooms ORDER BY name");
  return result.rows;
}

export async function upsertRoom(id: string, name: string, floor: number = 1, type: string = "residential"): Promise<void> {
  await initializeDatabase();
  await getPool().query(`INSERT INTO rooms (id, name, floor, type, updated_at) VALUES ($1, $2, $3, $4, CURRENT_TIMESTAMP)
    ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, floor = EXCLUDED.floor, type = EXCLUDED.type, updated_at = CURRENT_TIMESTAMP`, 
    [id, name, floor, type]);
}



export async function batchInsertRoomSensorData(records: Array<{room_id: string; temperature?: number; humidity?: number; light?: number; motion?: boolean; timestamp?: Date}>): Promise<void> {
  if (!records.length) return;
  await initializeDatabase();
  const v = records.map((_, i) => `($${i*6+1},$${i*6+2},$${i*6+3},$${i*6+4},$${i*6+5},$${i*6+6})`).join(",");
  const p = records.flatMap(r => [r.room_id, r.temperature??null, r.humidity??null, r.light??null, r.motion??null, r.timestamp||new Date()]);
  await getPool().query(`INSERT INTO room_sensors (room_id,temperature,humidity,light,motion,timestamp) VALUES ${v}`, p);
}

export async function batchInsertPZEMData(records: Array<{current?: number; voltage?: number; power?: number; energy?: number; frequency?: number; pf?: number; timestamp?: Date}>): Promise<void> {
  if (!records.length) return;
  await initializeDatabase();
  const v = records.map((_, i) => `($${i*7+1},$${i*7+2},$${i*7+3},$${i*7+4},$${i*7+5},$${i*7+6},$${i*7+7})`).join(",");
  const p = records.flatMap(r => [r.current??null, r.voltage??null, r.power??null, r.energy??null, r.frequency??null, r.pf??null, r.timestamp||new Date()]);
  await getPool().query(`INSERT INTO pzem_data (current,voltage,power,energy,frequency,pf,timestamp) VALUES ${v}`, p);
}

export async function getHistoricalRoomSensorData(startDate: Date, endDate: Date, roomIds?: string[], aggregation: "raw"|"hourly"="raw"): Promise<HistoricalRoomSensorData[]> {
  await initializeDatabase();
  const agg = aggregation === "hourly", t = agg ? "DATE_TRUNC('hour',rs.timestamp)" : "rs.timestamp";
  let q = `SELECT ${t} as timestamp, rs.room_id as "roomId", r.name as "roomName", ${agg?"AVG(rs.temperature)":"rs.temperature"} as temperature, ${agg?"AVG(rs.humidity)":"rs.humidity"} as humidity, ${agg?"AVG(rs.light)":"rs.light"} as light, ${agg?"BOOL_OR(rs.motion)":"rs.motion"} as motion FROM room_sensors rs JOIN rooms r ON rs.room_id=r.id WHERE rs.timestamp BETWEEN $1 AND $2`;
  const p: (Date|string[])[] = [startDate, endDate];
  if (roomIds?.length) { q += ` AND rs.room_id=ANY($3)`; p.push(roomIds); }
  if (agg) q += ` GROUP BY ${t}, rs.room_id, r.name`;
  return (await getPool().query(q + " ORDER BY timestamp ASC", p)).rows;
}

export async function getHistoricalPZEMData(startDate: Date, endDate: Date, aggregation: "raw"|"hourly"="raw"): Promise<HistoricalPZEMData[]> {
  await initializeDatabase();
  const agg = aggregation === "hourly", t = agg ? "DATE_TRUNC('hour',pz.timestamp)" : "pz.timestamp";
  let q = `SELECT ${t} as timestamp, ${agg?"AVG(pz.current)":"pz.current"} as current, ${agg?"AVG(pz.voltage)":"pz.voltage"} as voltage, ${agg?"AVG(pz.power)":"pz.power"} as power, ${agg?"AVG(pz.energy)":"pz.energy"} as energy, ${agg?"AVG(pz.frequency)":"pz.frequency"} as frequency, ${agg?"AVG(pz.pf)":"pz.pf"} as pf FROM pzem_data pz WHERE pz.timestamp BETWEEN $1 AND $2`;
  if (agg) q += ` GROUP BY ${t}`;
  return (await getPool().query(q + " ORDER BY timestamp ASC", [startDate, endDate])).rows;
}

export async function getLatestRoomSensorReadings(roomId?: string): Promise<RoomSensorRecord[]> {
  await initializeDatabase();
  const q = `SELECT DISTINCT ON (rs.room_id) rs.*, r.name as room_name FROM room_sensors rs JOIN rooms r ON rs.room_id=r.id${roomId?" WHERE rs.room_id=$1":""} ORDER BY rs.room_id, rs.timestamp DESC`;
  return (await getPool().query(q, roomId ? [roomId] : [])).rows;
}

export async function getLatestPZEMReading(): Promise<PZEMRecord | null> {
  await initializeDatabase();
  return (await getPool().query(`SELECT * FROM pzem_data ORDER BY timestamp DESC LIMIT 1`)).rows[0]||null;
}

export async function cleanupOldRoomSensorData(daysToKeep: number=90): Promise<number> {
  const d = new Date(); d.setDate(d.getDate()-daysToKeep);
  return (await getPool().query("DELETE FROM room_sensors WHERE timestamp<$1", [d])).rowCount||0;
}

export async function cleanupOldPZEMData(daysToKeep: number=90): Promise<number> {
  const d = new Date(); d.setDate(d.getDate()-daysToKeep);
  return (await getPool().query("DELETE FROM pzem_data WHERE timestamp<$1", [d])).rowCount||0;
}

export async function testConnection(): Promise<boolean> {
  try {
    await getPool().query("SELECT 1");
    return true;
  } catch {
    return false;
  }
}

export async function upsertRelayState(relayId: string, room_id: string, relay_type: string, state: boolean): Promise<void> {
  await initializeDatabase();
  await getPool().query(`INSERT INTO relay_states (id,room_id,relay_type,state,updated_at) VALUES ($1,$2,$3,$4,CURRENT_TIMESTAMP) ON CONFLICT (id) DO UPDATE SET state=EXCLUDED.state, updated_at=CURRENT_TIMESTAMP`, [relayId, room_id, relay_type, state]);
}

export async function getRelayState(relayId: string): Promise<RelayStateRecord|null> {
  await initializeDatabase();
  return (await getPool().query(`SELECT * FROM relay_states WHERE id=$1`, [relayId])).rows[0]||null;
}
export async function getRoomRelayStates(roomId: string): Promise<RelayStateRecord[]> {
  await initializeDatabase();
  return (await getPool().query(`SELECT * FROM relay_states WHERE room_id=$1 ORDER BY updated_at DESC`, [roomId])).rows;
}
export async function getAllRelayStates(): Promise<RelayStateRecord[]> {
  await initializeDatabase();
  return (await getPool().query(`SELECT * FROM relay_states ORDER BY updated_at DESC`)).rows;
}

export async function closePool(): Promise<void> {
  if (pool) {
    await pool.end();
    pool = null;
  }
}
