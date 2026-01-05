# NeuroSim Browser Rendering Test
# Tests if React components are actually rendering in the browser

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  NeuroSim Browser Rendering Test" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Test 1: Check if server is running
Write-Host "[1/5] Checking server status..." -ForegroundColor Yellow
$portCheck = netstat -ano | findstr :3000 | findstr LISTENING
if ($portCheck) {
    Write-Host "  ✅ Server is running on port 3000" -ForegroundColor Green
} else {
    Write-Host "  ❌ Server is NOT running on port 3000" -ForegroundColor Red
    Write-Host "  Please start the server with: npm run dev" -ForegroundColor Yellow
    exit 1
}
Write-Host ""

# Test 2: Fetch HTML and check for entry point
Write-Host "[2/5] Checking HTML structure..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri http://localhost:3000/ -UseBasicParsing
    
    if ($response.Content -match 'index\.tsx') {
        Write-Host "  ✅ Entry point script tag found: /index.tsx" -ForegroundColor Green
    } else {
        Write-Host "  ❌ Entry point script tag NOT found" -ForegroundColor Red
    }
    
    if ($response.Content -match '<div id="root">') {
        Write-Host "  ✅ Root div element found" -ForegroundColor Green
    } else {
        Write-Host "  ❌ Root div element NOT found" -ForegroundColor Red
    }
    
    if ($response.Content -match 'importmap') {
        Write-Host "  ⚠️  WARNING: Import maps detected (AI Studio artifact)" -ForegroundColor Yellow
        Write-Host "     This may cause conflicts with local npm packages" -ForegroundColor Gray
    } else {
        Write-Host "  ✅ No conflicting import maps" -ForegroundColor Green
    }
} catch {
    Write-Host "  ❌ Failed to fetch HTML: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}
Write-Host ""

# Test 3: Check if index.tsx is accessible
Write-Host "[3/5] Checking entry point accessibility..." -ForegroundColor Yellow
try {
    $indexResponse = Invoke-WebRequest -Uri http://localhost:3000/index.tsx -UseBasicParsing
    Write-Host "  ✅ index.tsx is accessible (Status: $($indexResponse.StatusCode))" -ForegroundColor Green
    
    if ($indexResponse.Content -match 'import.*React') {
        Write-Host "  ✅ React import found in index.tsx" -ForegroundColor Green
    }
    
    if ($indexResponse.Content -match 'ReactDOM') {
        Write-Host "  ✅ ReactDOM import found in index.tsx" -ForegroundColor Green
    }
    
    if ($indexResponse.Content -match 'App') {
        Write-Host "  ✅ App component import found in index.tsx" -ForegroundColor Green
    }
} catch {
    Write-Host "  ❌ index.tsx is NOT accessible: $($_.Exception.Message)" -ForegroundColor Red
}
Write-Host ""

# Test 4: Check if App.tsx is accessible
Write-Host "[4/5] Checking App component..." -ForegroundColor Yellow
try {
    $appResponse = Invoke-WebRequest -Uri http://localhost:3000/App.tsx -UseBasicParsing
    Write-Host "  ✅ App.tsx is accessible (Status: $($appResponse.StatusCode))" -ForegroundColor Green
    
    if ($appResponse.Content -match 'useNeurofeedbackSimulation') {
        Write-Host "  ✅ useNeurofeedbackSimulation hook found" -ForegroundColor Green
    }
    
    if ($appResponse.Content -match 'Oscilloscope') {
        Write-Host "  ✅ Oscilloscope component found" -ForegroundColor Green
    }
    
    if ($appResponse.Content -match 'MetricsPanel') {
        Write-Host "  ✅ MetricsPanel component found" -ForegroundColor Green
    }
} catch {
    Write-Host "  ❌ App.tsx is NOT accessible: $($_.Exception.Message)" -ForegroundColor Red
}
Write-Host ""

# Test 5: Check Vite client
Write-Host "[5/5] Checking Vite HMR..." -ForegroundColor Yellow
try {
    $viteResponse = Invoke-WebRequest -Uri http://localhost:3000/@vite/client -UseBasicParsing
    Write-Host "  ✅ Vite client is accessible (HMR enabled)" -ForegroundColor Green
} catch {
    Write-Host "  ❌ Vite client is NOT accessible" -ForegroundColor Red
}
Write-Host ""

# Summary
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Test Summary" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Next Steps:" -ForegroundColor Yellow
Write-Host "1. Open http://localhost:3000/ in your browser" -ForegroundColor White
Write-Host "2. Press F12 to open Developer Tools" -ForegroundColor White
Write-Host "3. Check the Console tab for any errors" -ForegroundColor White
Write-Host "4. Look for:" -ForegroundColor White
Write-Host "   - React component mounting messages" -ForegroundColor Gray
Write-Host "   - Any ReferenceError or import errors" -ForegroundColor Gray
Write-Host "   - Network tab showing successful module loads" -ForegroundColor Gray
Write-Host ""
Write-Host "Expected Behavior:" -ForegroundColor Yellow
Write-Host "✅ You should see the NeuroSim interface with:" -ForegroundColor Green
Write-Host "   - Header with 'NeuroSim Web' title" -ForegroundColor Gray
Write-Host "   - 'START SYSTEM' button" -ForegroundColor Gray
Write-Host "   - Oscilloscope visualization area" -ForegroundColor Gray
Write-Host "   - Metrics panels" -ForegroundColor Gray
Write-Host "   - Controls section with SPACEBAR instructions" -ForegroundColor Gray
Write-Host ""

# Offer to open browser
$openBrowser = Read-Host "Would you like to open the browser now? (Y/N)"
if ($openBrowser -eq 'Y' -or $openBrowser -eq 'y') {
    Write-Host ""
    Write-Host "Opening browser..." -ForegroundColor Cyan
    Start-Process "http://localhost:3000/"
    Write-Host "✅ Browser opened. Check for the NeuroSim interface!" -ForegroundColor Green
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Test Complete" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

