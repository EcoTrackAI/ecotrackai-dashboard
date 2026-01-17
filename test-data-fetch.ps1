# Test script to verify data fetching is working
# Run this with: .\test-data-fetch.ps1

Write-Host "`n=== EcoTrackAI Data Fetch Test ===" -ForegroundColor Cyan
Write-Host "Testing all API endpoints...`n" -ForegroundColor Cyan

# Test 1: Debug endpoint
Write-Host "[1/5] Testing debug endpoint..." -ForegroundColor Yellow
try {
    $debug = Invoke-RestMethod -Uri "http://localhost:3000/api/debug" -Method GET
    if ($debug.status -eq "connected") {
        Write-Host "✓ Database connected" -ForegroundColor Green
        Write-Host "  Rooms: $($debug.database.rooms.count)" -ForegroundColor Gray
        if ($debug.database.pzem.latest) {
            Write-Host "  PZEM data: Available" -ForegroundColor Gray
        } else {
            Write-Host "  PZEM data: None (need to sync)" -ForegroundColor Red
        }
        Write-Host "  Sensor readings: $($debug.database.sensors.count)" -ForegroundColor Gray
    }
} catch {
    Write-Host "✗ Failed: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 2: Sync data
Write-Host "`n[2/5] Syncing data from Firebase..." -ForegroundColor Yellow
try {
    $sync = Invoke-RestMethod -Uri "http://localhost:3000/api/sync-firebase" -Method POST
    if ($sync.success) {
        Write-Host "✓ Sync successful" -ForegroundColor Green
        Write-Host "  Synced: $($sync.synced -join ', ')" -ForegroundColor Gray
    }
} catch {
    Write-Host "✗ Failed: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 3: Get rooms
Write-Host "`n[3/5] Getting rooms..." -ForegroundColor Yellow
try {
    $rooms = Invoke-RestMethod -Uri "http://localhost:3000/api/rooms" -Method GET
    if ($rooms.success) {
        Write-Host "✓ Found $($rooms.count) rooms" -ForegroundColor Green
        foreach ($room in $rooms.data) {
            Write-Host "  - $($room.name) (ID: $($room.id))" -ForegroundColor Gray
        }
    }
} catch {
    Write-Host "✗ Failed: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 4: Get PZEM data (last 24 hours)
Write-Host "`n[4/5] Getting PZEM data (last 24 hours)..." -ForegroundColor Yellow
try {
    $end = (Get-Date).ToUniversalTime().ToString("yyyy-MM-ddTHH:mm:ssZ")
    $start = (Get-Date).AddHours(-24).ToUniversalTime().ToString("yyyy-MM-ddTHH:mm:ssZ")
    $pzem = Invoke-RestMethod -Uri "http://localhost:3000/api/pzem-data?startDate=$start&endDate=$end&aggregation=hourly" -Method GET
    if ($pzem.success) {
        Write-Host "✓ Found $($pzem.count) PZEM readings" -ForegroundColor Green
        if ($pzem.count -gt 0) {
            $latest = $pzem.data[-1]
            Write-Host "  Latest: Power=$($latest.power)W, Voltage=$($latest.voltage)V" -ForegroundColor Gray
        }
    }
} catch {
    Write-Host "✗ Failed: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 5: Get historical sensor data (last 7 days)
Write-Host "`n[5/5] Getting sensor data (last 7 days)..." -ForegroundColor Yellow
try {
    $end = (Get-Date).ToUniversalTime().ToString("yyyy-MM-ddTHH:mm:ssZ")
    $start = (Get-Date).AddDays(-7).ToUniversalTime().ToString("yyyy-MM-ddTHH:mm:ssZ")
    $sensors = Invoke-RestMethod -Uri "http://localhost:3000/api/historical-data?startDate=$start&endDate=$end&aggregation=hourly" -Method GET
    if ($sensors.success) {
        Write-Host "✓ Found $($sensors.count) sensor readings" -ForegroundColor Green
        if ($sensors.count -gt 0) {
            $latest = $sensors.data[-1]
            Write-Host "  Latest: Room=$($latest.roomName), Temp=$($latest.temperature)°C, Humidity=$($latest.humidity)%" -ForegroundColor Gray
        }
    }
} catch {
    Write-Host "✗ Failed: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`n=== Test Complete ===" -ForegroundColor Cyan
Write-Host "If all tests passed, open http://localhost:3000/analytics and http://localhost:3000/history" -ForegroundColor Cyan
Write-Host "Data should now be visible in both pages.`n" -ForegroundColor Cyan
