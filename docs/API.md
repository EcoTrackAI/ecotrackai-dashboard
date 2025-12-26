# API Reference

**Version**: 1.1  
**Last Updated**: December 26, 2025  
**Status**: Production Ready

## Overview

The EcoTrack AI Dashboard provides a RESTful API for accessing room data, historical sensor readings, and triggering data synchronization operations. All endpoints return JSON responses and follow standard HTTP status codes.

This document provides comprehensive API documentation including request/response formats, parameters, error handling, and practical examples.

## Base URLs

| Environment     | Base URL                                 | Description              |
| --------------- | ---------------------------------------- | ------------------------ |
| **Development** | `http://localhost:3000`                  | Local development server |
| **Production**  | `https://your-domain.vercel.app`         | Production deployment    |
| **Staging**     | `https://staging-your-domain.vercel.app` | Staging environment      |

## Authentication

**Current Status**: All endpoints are currently public and require no authentication.

**Roadmap**: Firebase Authentication will be implemented in version 2.0, requiring Bearer tokens for all requests:

```http
Authorization: Bearer <firebase-id-token>
```

## Response Format

All API responses follow a consistent JSON structure:

**Success Response**:

```json
{
  "data": {
    /* response data */
  },
  "success": true,
  "timestamp": "2025-12-26T10:30:00.000Z"
}
```

**Error Response**:

```json
{
  "error": "Error message",
  "details": "Detailed error information",
  "success": false,
  "statusCode": 400
}
```

## HTTP Status Codes

| Code  | Description                                                    |
| ----- | -------------------------------------------------------------- |
| `200` | Success - Request completed successfully                       |
| `400` | Bad Request - Invalid parameters or malformed request          |
| `404` | Not Found - Resource doesn't exist                             |
| `500` | Internal Server Error - Server-side error occurred             |
| `503` | Service Unavailable - Database or external service unavailable |

## Endpoints

### 1. GET /api/rooms

Retrieves list of all rooms in the system.

#### Request

```http
GET /api/rooms HTTP/1.1
Host: localhost:3000
```

#### Response

**Status**: `200 OK`

```json
{
  "rooms": [
    {
      "id": "living-room",
      "name": "Living Room",
      "floor": 1,
      "type": "residential",
      "created_at": "2025-01-01T00:00:00.000Z",
      "updated_at": "2025-01-26T10:30:00.000Z"
    },
    {
      "id": "bedroom",
      "name": "Master Bedroom",
      "floor": 2,
      "type": "residential",
      "created_at": "2025-01-01T00:00:00.000Z",
      "updated_at": "2025-01-26T10:30:00.000Z"
    }
  ]
}
```

#### Error Responses

**Database Connection Failed**

**Status**: `500 Internal Server Error`

```json
{
  "error": "Failed to fetch rooms",
  "details": "Connection timeout"
}
```

#### Example Usage

```typescript
// JavaScript/TypeScript
const response = await fetch("/api/rooms");
const { rooms } = await response.json();
console.log(rooms);
```

```bash
# cURL
curl http://localhost:3000/api/rooms
```

---

### 2. GET /api/historical-data

Query historical sensor data with optional filtering by date range and rooms.

#### Request

```http
GET /api/historical-data?startDate=2025-01-01&endDate=2025-01-26&roomIds=living-room,bedroom HTTP/1.1
Host: localhost:3000
```

#### Query Parameters

| Parameter     | Type                     | Required | Description                        |
| ------------- | ------------------------ | -------- | ---------------------------------- |
| `startDate`   | string (ISO 8601)        | Yes      | Start date for data query          |
| `endDate`     | string (ISO 8601)        | Yes      | End date for data query            |
| `roomIds`     | string (comma-separated) | No       | Filter by specific room IDs        |
| `aggregation` | string                   | No       | `raw` or `hourly` (default: `raw`) |

#### Response

**Status**: `200 OK`

```json
{
  "data": [
    {
      "timestamp": "2025-01-26T10:00:00.000Z",
      "roomId": "living-room",
      "roomName": "Living Room",
      "energy": 2.5,
      "power": 850,
      "temperature": 22.5,
      "humidity": 65,
      "lighting": 80,
      "motion": 1
    },
    {
      "timestamp": "2025-01-26T10:05:00.000Z",
      "roomId": "living-room",
      "roomName": "Living Room",
      "energy": 2.6,
      "power": 860,
      "temperature": 22.6,
      "humidity": 64,
      "lighting": 80,
      "motion": 1
    }
  ],
  "count": 2,
  "startDate": "2025-01-01T00:00:00.000Z",
  "endDate": "2025-01-26T23:59:59.999Z"
}
```

#### Error Responses

**Missing Parameters**

**Status**: `400 Bad Request`

```json
{
  "error": "Missing required parameters",
  "details": "startDate and endDate are required"
}
```

**Invalid Date Format**

**Status**: `400 Bad Request`

```json
{
  "error": "Invalid date format",
  "details": "Please use ISO 8601 format (YYYY-MM-DD)"
}
```

**Database Query Failed**

**Status**: `500 Internal Server Error`

```json
{
  "error": "Failed to fetch historical data",
  "details": "Query execution error"
}
```

#### Example Usage

```typescript
// JavaScript/TypeScript
const startDate = "2025-01-01";
const endDate = "2025-01-26";
const roomIds = ["living-room", "bedroom"];

const params = new URLSearchParams({
  startDate,
  endDate,
  roomIds: roomIds.join(","),
});

const response = await fetch(`/api/historical-data?${params}`);
const { data } = await response.json();
console.log(data);
```

```bash
# cURL
curl "http://localhost:3000/api/historical-data?startDate=2025-01-01&endDate=2025-01-26&roomIds=living-room,bedroom"
```

---

### 3. POST /api/sync-firebase

Triggers synchronization of Firebase Realtime Database data to PostgreSQL for historical storage.

#### Request

```http
POST /api/sync-firebase HTTP/1.1
Host: localhost:3000
Content-Type: application/json
```

#### Request Body

No body required. Sync reads all current sensor data from Firebase.

#### Response

**Status**: `200 OK`

```json
{
  "message": "Successfully synced data",
  "synced": 45,
  "rooms": 6,
  "timestamp": "2025-01-26T10:30:00.000Z"
}
```

#### Response Fields

| Field       | Type   | Description                     |
| ----------- | ------ | ------------------------------- |
| `message`   | string | Success message                 |
| `synced`    | number | Number of sensor records synced |
| `rooms`     | number | Number of rooms created/updated |
| `timestamp` | string | Sync completion timestamp       |

#### Error Responses

**Database Connection Failed**

**Status**: `500 Internal Server Error`

```json
{
  "error": "Database connection failed"
}
```

**No Sensor Data Available**

**Status**: `200 OK`

```json
{
  "message": "No sensor data available",
  "synced": 0
}
```

**Firebase Read Failed**

**Status**: `500 Internal Server Error`

```json
{
  "error": "Failed to sync data",
  "details": "Firebase read permission denied"
}
```

#### Example Usage

```typescript
// JavaScript/TypeScript
const response = await fetch("/api/sync-firebase", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
});

const result = await response.json();
console.log(`Synced ${result.synced} sensors`);
```

```bash
# cURL
curl -X POST http://localhost:3000/api/sync-firebase
```

---

### 4. GET /api/sync-firebase

Check database connection status without triggering a sync.

#### Request

```http
GET /api/sync-firebase HTTP/1.1
Host: localhost:3000
```

#### Response

**Status**: `200 OK`

**Connected:**

```json
{
  "databaseConnected": true,
  "message": "Database connection successful. Use POST to sync data."
}
```

**Not Connected:**

```json
{
  "databaseConnected": false,
  "message": "Database connection failed. Check your configuration."
}
```

#### Example Usage

```typescript
// JavaScript/TypeScript
const response = await fetch("/api/sync-firebase");
const { databaseConnected } = await response.json();

if (databaseConnected) {
  console.log("Database is ready");
} else {
  console.error("Database connection failed");
}
```

```bash
# cURL
curl http://localhost:3000/api/sync-firebase
```

---

## Data Types

### DBRoom

```typescript
interface DBRoom {
  id: string;
  name: string;
  floor: number;
  type: string;
  created_at: Date;
  updated_at: Date;
}
```

### HistoricalDataPoint

```typescript
interface HistoricalDataPoint {
  timestamp: Date;
  roomId: string;
  roomName: string;
  energy: number; // kWh
  power: number; // W
  temperature: number; // °C
  humidity: number; // %
  lighting: number; // lux
  motion: number; // 0 or 1
}
```

### FirebaseSensorData

```typescript
interface FirebaseSensorData {
  id: string;
  sensorName: string;
  currentValue: number | string;
  unit: string;
  status: "normal" | "warning" | "critical" | "offline";
  description: string;
  lastUpdate: string; // ISO 8601
  category:
    | "temperature"
    | "humidity"
    | "occupancy"
    | "lighting"
    | "power"
    | "system";
  room: string;
}
```

## Rate Limits

Currently no rate limiting implemented. When deployed on Vercel, rate limits depend on your plan:

- **Hobby**: 100 requests per 10 seconds
- **Pro**: 600 requests per 10 seconds
- **Enterprise**: Custom limits

## Error Handling

All endpoints follow consistent error response format:

```typescript
interface ErrorResponse {
  error: string; // Error message
  details?: string; // Additional details
  statusCode?: number; // HTTP status code
}
```

### Common HTTP Status Codes

| Code | Meaning               | When Used              |
| ---- | --------------------- | ---------------------- |
| 200  | OK                    | Successful request     |
| 400  | Bad Request           | Invalid parameters     |
| 404  | Not Found             | Endpoint doesn't exist |
| 500  | Internal Server Error | Server/database error  |

## Client Libraries

### JavaScript/TypeScript Example

```typescript
// lib/api-client.ts
export class EcoTrackAPI {
  constructor(private baseURL: string) {}

  async getRooms(): Promise<DBRoom[]> {
    const response = await fetch(`${this.baseURL}/api/rooms`);
    const { rooms } = await response.json();
    return rooms;
  }

  async getHistoricalData(
    startDate: string,
    endDate: string,
    roomIds?: string[]
  ): Promise<HistoricalDataPoint[]> {
    const params = new URLSearchParams({
      startDate,
      endDate,
      ...(roomIds && { roomIds: roomIds.join(",") }),
    });

    const response = await fetch(
      `${this.baseURL}/api/historical-data?${params}`
    );
    const { data } = await response.json();
    return data;
  }

  async syncFirebase(): Promise<{ synced: number; rooms: number }> {
    const response = await fetch(`${this.baseURL}/api/sync-firebase`, {
      method: "POST",
    });
    return response.json();
  }
}

// Usage
const api = new EcoTrackAPI("http://localhost:3000");
const rooms = await api.getRooms();
```

### Python Example

```python
import requests
from typing import List, Dict, Any
from datetime import datetime

class EcoTrackAPI:
    def __init__(self, base_url: str):
        self.base_url = base_url

    def get_rooms(self) -> List[Dict[str, Any]]:
        response = requests.get(f"{self.base_url}/api/rooms")
        response.raise_for_status()
        return response.json()['rooms']

    def get_historical_data(
        self,
        start_date: str,
        end_date: str,
        room_ids: List[str] = None
    ) -> List[Dict[str, Any]]:
        params = {
            'startDate': start_date,
            'endDate': end_date
        }
        if room_ids:
            params['roomIds'] = ','.join(room_ids)

        response = requests.get(
            f"{self.base_url}/api/historical-data",
            params=params
        )
        response.raise_for_status()
        return response.json()['data']

    def sync_firebase(self) -> Dict[str, Any]:
        response = requests.post(f"{self.base_url}/api/sync-firebase")
        response.raise_for_status()
        return response.json()

# Usage
api = EcoTrackAPI('http://localhost:3000')
rooms = api.get_rooms()
```

## Webhooks

Webhooks are not currently implemented but are planned for future releases to enable:

- Real-time alerts on threshold breaches
- Automation triggers
- Third-party integrations

## Versioning

API versioning is not currently implemented. All endpoints are version 1. Future versions will use URL path versioning:

- `/api/v1/rooms`
- `/api/v2/rooms`

## Support

For API support:

- GitHub Issues: https://github.com/yourusername/ecotrackai-dashboard/issues
- Email: support@ecotrackai.com
- Documentation: https://docs.ecotrackai.com
