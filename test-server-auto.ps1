# NeuroSim Development Server Automated Test Script
# This script verifies that the Vite dev server is running and all components are accessible

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  NeuroSim Server Diagnostic Test" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Test 1: Check if port 3000 is listening
Write-Host "[1/5] Checking if port 3000 is listening..." -ForegroundColor Yellow
$portCheck = netstat -ano | findstr :3000 | findstr LISTENING
if ($portCheck) {
    Write-Host "[OK] Port 3000 is LISTENING" -ForegroundColor Green
    $portCheck | ForEach-Object { Write-Host "  $_" -ForegroundColor Gray }
} else {
    Write-Host "[FAIL] Port 3000 is NOT listening" -ForegroundColor Red
    Write-Host "  Please start the dev server with: npm run dev" -ForegroundColor Yellow
    exit 1
}
Write-Host ""

# Test 2: Check main HTML page
Write-Host "[2/5] Testing main HTML page..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri http://localhost:3000/ -UseBasicParsing -ErrorAction Stop
    Write-Host "[OK] Main page accessible (Status: $($response.StatusCode))" -ForegroundColor Green
    Write-Host "  Content-Type: $($response.Headers['Content-Type'])" -ForegroundColor Gray
    Write-Host "  Content-Length: $($response.Content.Length) bytes" -ForegroundColor Gray
} catch {
    Write-Host "[FAIL] Failed to access main page: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}
Write-Host ""

# Test 3: Check core application files
Write-Host "[3/5] Testing core application files..." -ForegroundColor Yellow
$coreFiles = @(
    '/index.tsx',
    '/App.tsx',
    '/constants.ts',
    '/types.ts'
)

$allPassed = $true
foreach ($file in $coreFiles) {
    try {
        $r = Invoke-WebRequest -Uri "http://localhost:3000$file" -UseBasicParsing -ErrorAction Stop
        $size = '{0:N0}' -f $r.Content.Length
        Write-Host "  [OK] $file ($size bytes)" -ForegroundColor Green
    } catch {
        Write-Host "  [FAIL] $file" -ForegroundColor Red
        $allPassed = $false
    }
}
Write-Host ""

# Test 4: Check components and services
Write-Host "[4/5] Testing components and services..." -ForegroundColor Yellow
$componentFiles = @(
    '/components/Oscilloscope.tsx',
    '/components/MetricsPanel.tsx',
    '/hooks/useNeurofeedbackSimulation.ts',
    '/services/audioEngine.ts',
    '/utils/dsp.ts'
)

foreach ($file in $componentFiles) {
    try {
        $r = Invoke-WebRequest -Uri "http://localhost:3000$file" -UseBasicParsing -ErrorAction Stop
        $size = '{0:N0}' -f $r.Content.Length
        Write-Host "  [OK] $file ($size bytes)" -ForegroundColor Green
    } catch {
        Write-Host "  [FAIL] $file" -ForegroundColor Red
        $allPassed = $false
    }
}
Write-Host ""

# Test 5: Check Vite client
Write-Host "[5/5] Testing Vite HMR client..." -ForegroundColor Yellow
try {
    $r = Invoke-WebRequest -Uri "http://localhost:3000/@vite/client" -UseBasicParsing -ErrorAction Stop
    Write-Host "[OK] Vite client accessible (Hot Module Replacement enabled)" -ForegroundColor Green
} catch {
    Write-Host "[FAIL] Vite client not accessible" -ForegroundColor Red
    $allPassed = $false
}
Write-Host ""

# Summary
Write-Host "========================================" -ForegroundColor Cyan
if ($allPassed) {
    Write-Host "  ALL TESTS PASSED!" -ForegroundColor Green
    Write-Host "  Your NeuroSim server is running correctly" -ForegroundColor Green
    Write-Host "  Access it at: http://localhost:3000/" -ForegroundColor Cyan
} else {
    Write-Host "  SOME TESTS FAILED" -ForegroundColor Red
    Write-Host "  Please check the errors above" -ForegroundColor Yellow
}
Write-Host "========================================" -ForegroundColor Cyan

