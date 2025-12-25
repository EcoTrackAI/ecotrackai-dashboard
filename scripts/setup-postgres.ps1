# Quick Setup Script for PostgreSQL Integration
# This script helps you set up the database quickly

Write-Host "🚀 EcoTrackAI PostgreSQL Setup" -ForegroundColor Cyan
Write-Host "================================`n" -ForegroundColor Cyan

# Check if PostgreSQL is installed
Write-Host "Checking for PostgreSQL installation..." -ForegroundColor Yellow

try {
    $pgVersion = psql --version 2>$null
    if ($pgVersion) {
        Write-Host "✅ PostgreSQL found: $pgVersion`n" -ForegroundColor Green
    }
} catch {
    Write-Host "❌ PostgreSQL not found!" -ForegroundColor Red
    Write-Host "Please install PostgreSQL from: https://www.postgresql.org/download/`n" -ForegroundColor Yellow
    exit 1
}

# Get database credentials
Write-Host "Database Configuration" -ForegroundColor Cyan
Write-Host "=====================`n" -ForegroundColor Cyan

$dbHost = Read-Host "PostgreSQL Host (default: localhost)"
if ([string]::IsNullOrWhiteSpace($dbHost)) { $dbHost = "localhost" }

$dbPort = Read-Host "PostgreSQL Port (default: 5432)"
if ([string]::IsNullOrWhiteSpace($dbPort)) { $dbPort = "5432" }

$dbName = Read-Host "Database Name (default: ecotrackai)"
if ([string]::IsNullOrWhiteSpace($dbName)) { $dbName = "ecotrackai" }

$dbUser = Read-Host "PostgreSQL User (default: postgres)"
if ([string]::IsNullOrWhiteSpace($dbUser)) { $dbUser = "postgres" }

$dbPassword = Read-Host "PostgreSQL Password" -AsSecureString
$dbPasswordPlain = [Runtime.InteropServices.Marshal]::PtrToStringAuto([Runtime.InteropServices.Marshal]::SecureStringToBSTR($dbPassword))

Write-Host "`n"

# Test connection
Write-Host "Testing database connection..." -ForegroundColor Yellow
$env:PGPASSWORD = $dbPasswordPlain

try {
    $testResult = psql -h $dbHost -p $dbPort -U $dbUser -d postgres -c "SELECT 1;" 2>$null
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Connection successful!`n" -ForegroundColor Green
    } else {
        throw "Connection failed"
    }
} catch {
    Write-Host "❌ Failed to connect to PostgreSQL!" -ForegroundColor Red
    Write-Host "Please check your credentials and try again.`n" -ForegroundColor Yellow
    exit 1
}

# Create database if it doesn't exist
Write-Host "Creating database '$dbName'..." -ForegroundColor Yellow
$createDbResult = psql -h $dbHost -p $dbPort -U $dbUser -d postgres -c "CREATE DATABASE $dbName;" 2>$null

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Database created successfully!`n" -ForegroundColor Green
} else {
    Write-Host "ℹ️  Database already exists or creation failed (this is OK if database exists)`n" -ForegroundColor Yellow
}

# Run schema
Write-Host "Setting up database schema..." -ForegroundColor Yellow
$schemaPath = Join-Path $PSScriptRoot "..\database\schema.sql"

if (Test-Path $schemaPath) {
    psql -h $dbHost -p $dbPort -U $dbUser -d $dbName -f $schemaPath
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Schema created successfully!`n" -ForegroundColor Green
    } else {
        Write-Host "❌ Failed to create schema!" -ForegroundColor Red
        exit 1
    }
} else {
    Write-Host "❌ Schema file not found at: $schemaPath" -ForegroundColor Red
    exit 1
}

# Create or update .env.local
Write-Host "Creating .env.local file..." -ForegroundColor Yellow
$envPath = Join-Path $PSScriptRoot "..\.env.local"

$envContent = @"
# PostgreSQL Configuration
POSTGRES_HOST=$dbHost
POSTGRES_PORT=$dbPort
POSTGRES_DATABASE=$dbName
POSTGRES_USER=$dbUser
POSTGRES_PASSWORD=$dbPasswordPlain

"@

# Check if .env.local exists
if (Test-Path $envPath) {
    Write-Host "⚠️  .env.local already exists!" -ForegroundColor Yellow
    $overwrite = Read-Host "Do you want to update PostgreSQL settings? (y/n)"
    
    if ($overwrite -eq "y" -or $overwrite -eq "Y") {
        $existingContent = Get-Content $envPath -Raw
        
        # Remove old PostgreSQL settings
        $existingContent = $existingContent -replace "(?m)^POSTGRES_.*$`n?", ""
        
        # Add new settings
        Set-Content -Path $envPath -Value ($existingContent.Trim() + "`n`n" + $envContent)
        Write-Host "✅ Updated .env.local with PostgreSQL settings`n" -ForegroundColor Green
    }
} else {
    Set-Content -Path $envPath -Value $envContent
    Write-Host "✅ Created .env.local with PostgreSQL settings`n" -ForegroundColor Green
}

# Clear password from environment
$env:PGPASSWORD = $null

Write-Host "🎉 Setup Complete!" -ForegroundColor Green
Write-Host "================`n" -ForegroundColor Green

Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "1. Start the development server: npm run dev" -ForegroundColor White
Write-Host "2. Sync Firebase data: node scripts/sync-firebase-to-postgres.js" -ForegroundColor White
Write-Host "3. View historical data at: http://localhost:3000/history`n" -ForegroundColor White

Write-Host "📚 For more information, see: docs/postgresql-setup.md`n" -ForegroundColor Yellow
