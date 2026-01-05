# NeuroSim Quick Reference Card

## 🚀 Essential Commands

### Start Development Server
```bash
npm run dev
```
Access at: http://localhost:3000/

### Run Tests
```powershell
.\test-server-auto.ps1
```

### Restart Server
```powershell
.\restart-server.ps1
```

### Check Server Status
```powershell
netstat -ano | findstr :3000
```

### Stop Server
Press `Ctrl+C` in the server terminal

---

## 📁 Important Files

| File | Purpose |
|------|---------|
| `vite.config.ts` | Vite configuration (UPDATED with polyfills) |
| `package.json` | Dependencies and scripts |
| `App.tsx` | Main application component |
| `index.tsx` | Application entry point |
| `index.html` | HTML template |

---

## 🧪 Test Scripts

| Script | Purpose |
|--------|---------|
| `test-server-auto.ps1` | Automated test suite |
| `test-server.ps1` | Interactive tests with browser launch |
| `restart-server.ps1` | Stop and restart dev server |

---

## 📚 Documentation

| Document | Content |
|----------|---------|
| `UPDATE-SUMMARY.md` | Configuration update summary |
| `VITE-CONFIG-UPDATE.md` | Detailed technical explanation |
| `SERVER-DIAGNOSTICS.md` | Server health diagnostics |
| `TESTING-GUIDE.md` | Comprehensive testing guide |
| `QUICK-REFERENCE.md` | This quick reference |

---

## 🎮 Application Controls

### Start Simulation
1. Open http://localhost:3000/
2. Click "START SYSTEM" button

### Trigger Alpha Waves
- Press and hold **SPACEBAR**
- Release to stop injection

### Stop Simulation
- Click "STOP SIMULATION" button

---

## ✅ What Was Updated

### Vite Configuration Enhancements
Added to `vite.config.ts`:
```typescript
'process.env.NODE_ENV': JSON.stringify(mode),
'process.env': '{}',
'global': 'globalThis',
```

**Purpose**: Prevent browser compatibility issues

**Result**: 
- ✅ Better error handling
- ✅ Improved compatibility
- ✅ No breaking changes

---

## 🔍 Verification Checklist

After any changes, verify:
- [ ] Server starts without errors
- [ ] http://localhost:3000/ loads
- [ ] No console errors (F12)
- [ ] Components render correctly
- [ ] "START SYSTEM" button works
- [ ] SPACEBAR triggers alpha waves
- [ ] Audio feedback plays
- [ ] Metrics update in real-time

---

## 🆘 Quick Troubleshooting

### Server won't start
```powershell
# Kill any process on port 3000
netstat -ano | findstr :3000
taskkill /PID <PID> /F
npm run dev
```

### Changes not reflecting
1. Hard refresh: `Ctrl+Shift+R`
2. Clear cache
3. Restart server

### Port already in use
```powershell
# Use different port
npm run dev -- --port 3001
```

---

## 📊 Current Status

**Server**: Running (PID 16024)  
**Port**: 3000  
**URL**: http://localhost:3000/  
**Config**: Enhanced with polyfills ✅  
**Tests**: All passing ✅  
**Status**: OPERATIONAL ✅

---

## 🎯 Key Features

- 16-channel EEG simulation
- Real-time DSP processing
- Alpha wave (8-12Hz) filtering
- Web Audio API feedback
- Interactive oscilloscope
- Live metrics display
- Hot module replacement

---

## 💡 Tips

1. **Keep server running** in dedicated terminal
2. **Use test scripts** before committing
3. **Check browser console** for errors
4. **Hard refresh** if changes don't appear
5. **Read documentation** for detailed info

---

**Last Updated**: 2026-01-05  
**Version**: Enhanced Configuration  
**Status**: ✅ Ready for Development

