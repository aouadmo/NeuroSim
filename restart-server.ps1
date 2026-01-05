# Restart NeuroSim Development Server
# This script stops the current dev server and starts a new one

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Restarting NeuroSim Dev Server" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Step 1: Find and kill existing process on port 3000
Write-Host "[1/3] Checking for existing server on port 3000..." -ForegroundColor Yellow
$portCheck = netstat -ano | findstr :3000 | findstr LISTENING

if ($portCheck) {
    # Extract PID from netstat output
    $pid = ($portCheck -split '\s+')[-1]
    Write-Host "  Found server running (PID: $pid)" -ForegroundColor Gray
    Write-Host "  Stopping server..." -ForegroundColor Yellow
    
    try {
        Stop-Process -Id $pid -Force -ErrorAction Stop
        Start-Sleep -Seconds 2
        Write-Host "  [OK] Server stopped successfully" -ForegroundColor Green
    } catch {
        Write-Host "  [WARN] Could not stop process: $($_.Exception.Message)" -ForegroundColor Yellow
        Write-Host "  You may need to manually stop the server with Ctrl+C" -ForegroundColor Yellow
    }
} else {
    Write-Host "  No server currently running on port 3000" -ForegroundColor Gray
}
Write-Host ""

# Step 2: Verify port is free
Write-Host "[2/3] Verifying port 3000 is available..." -ForegroundColor Yellow
Start-Sleep -Seconds 1
$portCheck = netstat -ano | findstr :3000 | findstr LISTENING

if ($portCheck) {
    Write-Host "  [WARN] Port 3000 is still in use" -ForegroundColor Yellow
    Write-Host "  Please manually stop the process or use a different port" -ForegroundColor Yellow
    exit 1
} else {
    Write-Host "  [OK] Port 3000 is available" -ForegroundColor Green
}
Write-Host ""

# Step 3: Start new server
Write-Host "[3/3] Starting new development server..." -ForegroundColor Yellow
Write-Host "  Running: npm run dev" -ForegroundColor Gray
Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Server will start in a new window" -ForegroundColor Cyan
Write-Host "  Press Ctrl+C in that window to stop" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Start server in a new PowerShell window
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PWD'; npm run dev"

Write-Host "[OK] Server starting..." -ForegroundColor Green
Write-Host "  Waiting for server to be ready..." -ForegroundColor Gray

# Wait for server to start
Start-Sleep -Seconds 5

# Verify server is running
$portCheck = netstat -ano | findstr :3000 | findstr LISTENING
if ($portCheck) {
    Write-Host ""
    Write-Host "========================================" -ForegroundColor Green
    Write-Host "  SERVER STARTED SUCCESSFULLY!" -ForegroundColor Green
    Write-Host "  Access at: http://localhost:3000/" -ForegroundColor Cyan
    Write-Host "========================================" -ForegroundColor Green
    Write-Host ""
    
    # Ask if user wants to run tests
    $runTests = Read-Host "Would you like to run the test suite? (Y/N)"
    if ($runTests -eq 'Y' -or $runTests -eq 'y') {
        Write-Host ""
        & .\test-server-auto.ps1
    }
} else {
    Write-Host ""
    Write-Host "[WARN] Server may still be starting..." -ForegroundColor Yellow
    Write-Host "  Check the new PowerShell window for status" -ForegroundColor Yellow
    Write-Host "  Or run: netstat -ano | findstr :3000" -ForegroundColor Gray
}

