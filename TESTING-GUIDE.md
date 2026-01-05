# NeuroSim Testing Guide

This guide provides various methods to test and verify your NeuroSim development server.

---

## 🚀 Quick Start

### Start the Server
```bash
npm run dev
```

Expected output:
```
VITE v6.4.1  ready in 871 ms

➜  Local:   http://localhost:3000/
➜  Network: http://172.21.214.102:3000/
➜  press h + enter to show help
```

---

## ✅ Testing Methods

### Method 1: Automated Test Script (Recommended)

Run the comprehensive test script:
```powershell
.\test-server-auto.ps1
```

This will test:
- Port availability
- Main HTML page
- Core application files
- React components
- Services and utilities
- Vite HMR client

### Method 2: Browser Testing

Simply open your browser to:
```
http://localhost:3000/
```

Or use PowerShell:
```powershell
Start-Process "http://localhost:3000/"
```

### Method 3: PowerShell Web Request

```powershell
# Test main page
Invoke-WebRequest -Uri http://localhost:3000/ -UseBasicParsing

# Check status code only
(Invoke-WebRequest -Uri http://localhost:3000/ -UseBasicParsing).StatusCode

# Get response details
$response = Invoke-WebRequest -Uri http://localhost:3000/ -UseBasicParsing
Write-Host "Status: $($response.StatusCode)"
Write-Host "Content-Type: $($response.Headers['Content-Type'])"
Write-Host "Size: $($response.Content.Length) bytes"
```

### Method 4: Port Check

Check if the server is listening on port 3000:
```powershell
netstat -ano | findstr :3000
```

Expected output:
```
TCP    0.0.0.0:3000           0.0.0.0:0              LISTENING       11036
```

### Method 5: Test Specific Files

```powershell
# Test a specific component
Invoke-WebRequest -Uri http://localhost:3000/App.tsx -UseBasicParsing

# Test multiple files
@('/index.tsx', '/App.tsx', '/constants.ts') | ForEach-Object {
    $r = Invoke-WebRequest -Uri "http://localhost:3000$_" -UseBasicParsing
    Write-Host "$_ : $($r.StatusCode) - $($r.Content.Length) bytes"
}
```

---

## ⚠️ Common Issues and Solutions

### Issue 1: "curl: Impossible de se connecter au serveur distant"

**Problem:** PowerShell's `curl` is an alias for `Invoke-WebRequest` and can have issues.

**Solutions:**
```powershell
# Option A: Use Invoke-WebRequest directly
Invoke-WebRequest -Uri http://localhost:3000/ -UseBasicParsing

# Option B: Use real curl (if installed)
curl.exe http://localhost:3000/

# Option C: Use the test script
.\test-server-auto.ps1
```

### Issue 2: Server Not Running

**Problem:** Port 3000 is not listening.

**Solution:**
```bash
# Start the dev server
npm run dev
```

**Verify it's running:**
```powershell
netstat -ano | findstr :3000
```

### Issue 3: Port Already in Use

**Problem:** Another process is using port 3000.

**Solution:**
```powershell
# Find the process using port 3000
netstat -ano | findstr :3000

# Kill the process (replace PID with actual process ID)
taskkill /PID <PID> /F

# Or use a different port
npm run dev -- --port 3001
```

### Issue 4: Changes Not Reflecting

**Problem:** Code changes aren't showing in the browser.

**Solutions:**
1. Check that Vite HMR is working:
   ```powershell
   Invoke-WebRequest -Uri http://localhost:3000/@vite/client -UseBasicParsing
   ```
2. Hard refresh the browser: `Ctrl+Shift+R` or `Ctrl+F5`
3. Clear browser cache
4. Restart the dev server

### Issue 5: Module Not Found Errors

**Problem:** Dependencies are missing.

**Solution:**
```bash
# Reinstall dependencies
npm install

# Clear cache and reinstall
rm -r node_modules
npm install
```

---

## 🧪 Application Functionality Tests

### Test 1: Visual Verification

1. Open http://localhost:3000/
2. You should see:
   - "NeuroSim Web" header with CPU icon
   - "START SYSTEM" button
   - Oscilloscope visualization area
   - Metrics panels
   - Simulation controls section

### Test 2: Simulation Test

1. Click "START SYSTEM"
2. Button should change to "STOP SIMULATION"
3. System Status should show "RUNNING"
4. Oscilloscope should show noise signal

### Test 3: Alpha Wave Injection

1. Start the simulation
2. Press and hold SPACEBAR
3. You should see:
   - Alpha Power increase
   - Coherence increase
   - Audio volume increase
   - "Trigger Alpha State" indicator

### Test 4: Audio Feedback

1. Start the simulation
2. Ensure your volume is on
3. Press SPACEBAR
4. You should hear a 440Hz tone that increases in volume

### Test 5: Metrics Display

Verify these metrics are updating:
- Timestamp
- Alpha Power (RMS)
- Coherence (0-1)
- DSP Latency (ms)
- Audio Volume (0-100%)

---

## 📊 Performance Checks

### Check Bundle Size
```powershell
# Main page size
$r = Invoke-WebRequest -Uri http://localhost:3000/ -UseBasicParsing
Write-Host "HTML: $($r.Content.Length) bytes"

# Component sizes
@('/App.tsx', '/components/Oscilloscope.tsx', '/components/MetricsPanel.tsx') | ForEach-Object {
    $r = Invoke-WebRequest -Uri "http://localhost:3000$_" -UseBasicParsing
    Write-Host "$_ : $($r.Content.Length) bytes"
}
```

### Check Response Times
```powershell
Measure-Command {
    Invoke-WebRequest -Uri http://localhost:3000/ -UseBasicParsing
}
```

---

## 🔧 Development Workflow

### 1. Start Development
```bash
npm run dev
```

### 2. Make Changes
Edit any `.tsx`, `.ts`, or `.css` files

### 3. Verify Changes
- Changes auto-reload in browser (HMR)
- Check browser console for errors (F12)

### 4. Test Functionality
```powershell
.\test-server-auto.ps1
```

### 5. Build for Production
```bash
npm run build
```

### 6. Preview Production Build
```bash
npm run preview
```

---

## 📝 Useful Commands

```powershell
# Check if server is running
netstat -ano | findstr :3000

# Test server health
.\test-server-auto.ps1

# Open in browser
Start-Process "http://localhost:3000/"

# Check specific endpoint
Invoke-WebRequest -Uri http://localhost:3000/App.tsx -UseBasicParsing

# Monitor server logs
# (Just watch the terminal where npm run dev is running)

# Kill server process
# Press Ctrl+C in the server terminal
```

---

## 🎯 Best Practices

1. **Always use the test script** before committing changes
2. **Keep the dev server running** in a dedicated terminal
3. **Use browser DevTools** (F12) to check for console errors
4. **Test in multiple browsers** if possible
5. **Verify HMR is working** - changes should reflect immediately
6. **Check network tab** in DevTools for failed requests

---

## 📚 Additional Resources

- **Vite Documentation:** https://vitejs.dev/
- **React Documentation:** https://react.dev/
- **Web Audio API:** https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API
- **TypeScript:** https://www.typescriptlang.org/

---

**Last Updated:** 2026-01-05  
**Vite Version:** 6.4.1  
**React Version:** 19.2.3

