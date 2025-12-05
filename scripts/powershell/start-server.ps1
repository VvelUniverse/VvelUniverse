# PowerShell script to start the server
# This script kills any process on port 3000, then starts the server

Write-Host "Checking for processes on port 3000..." -ForegroundColor Yellow

# Get processes using port 3000
$connections = Get-NetTCPConnection -LocalPort 3000 -State Listen -ErrorAction SilentlyContinue

if ($connections) {
    Write-Host "Found process(es) on port 3000. Killing..." -ForegroundColor Red
    $connections | ForEach-Object {
        $pid = $_.OwningProcess
        Write-Host "Killing process $pid..." -ForegroundColor Yellow
        Stop-Process -Id $pid -Force -ErrorAction SilentlyContinue
    }
    Start-Sleep -Seconds 2
    Write-Host "Process(es) killed. Port 3000 is now free." -ForegroundColor Green
} else {
    Write-Host "Port 3000 is free." -ForegroundColor Green
}

# Get script directory and navigate to project root
$scriptPath = Split-Path -Parent $PSCommandPath
$projectRoot = Split-Path -Parent (Split-Path -Parent $scriptPath)
Set-Location -Path $projectRoot

Write-Host "Project root: $projectRoot" -ForegroundColor Cyan

# Change to backend directory
Set-Location -Path "backend"

# Start the server
Write-Host "Starting server..." -ForegroundColor Cyan
npm run dev





