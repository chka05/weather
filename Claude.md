# Claude.md

## Project: Simple Weather App

### Overview

This project is a **simple weather and time app** built using **Node.js**. It fetches and displays:

- The **current weather** for your **actual location (using browser geolocation)**.
- A **dropdown list of 120 major cities** across all continents to select and view their weather.
- The **current time in Dublin** and the **current time in the selected city**.

### 🌐 Live Deployment

**Coolify Server:** https://ysg04kow8sk4sk40ooc8go8g.eu1.mlgym.io/

### Features

✅ Fetch current weather using OpenWeatherMap API  
✅ Detect user location using browser geolocation (GPS/WiFi)  
✅ Smart fallback system with default location (Dublin)  
✅ List 120 major cities across 6 continents (Africa, Asia, Europe, North America, Oceania, South America)  
✅ Display current time in Dublin and in the selected city  
✅ Real-time clock updates  
✅ Responsive design for mobile and desktop  
✅ Docker containerization for easy deployment  
✅ Coolify deployment ready with healthcheck  
✅ Comprehensive debugging system  
✅ Enhanced error handling and user feedback  
✅ Manual location button for precise positioning  

### Technologies

- **Backend:** Node.js (Express.js)
- **Weather API:** [OpenWeatherMap API](https://openweathermap.org/api)
- **Geolocation:** Browser Geolocation API with fallback system
- **Time Zones:** [Moment-Timezone](https://momentjs.com/timezone/) for accurate time handling
- **Templating:** EJS for server-side rendering
- **Containerization:** Docker with Alpine Linux and curl for healthcheck
- **Deployment:** Coolify with automatic GitHub integration

### Development Workflow

**Version Management:**
- After every change, increment version by 0.1 (e.g., v0.17 → v0.18)
- Version format: `v0.xx` (remove final .0)
- Update package.json version
- Commit and push changes automatically
- Current version: **v0.18**

**Debugging System:**
- Comprehensive console logging with timestamps
- Debug functions: `checkAPIStatus()`, `testLocation()`, `getAppStatus()`
- All logs prefixed with `[WEATHER-DEBUG]` for easy filtering
- Error states include debug buttons for immediate troubleshooting

### Recent Major Updates

**v0.18 (Latest)** - Comprehensive JavaScript console debugging
- Added extensive debug logging system
- Created browser console utility functions
- Enhanced error reporting and troubleshooting tools

**v0.17** - Enhanced API key detection and debugging
- Improved API key validation with environment logging
- Added debug endpoint for server diagnostics

**v0.16** - Geolocation timeout fixes with fallback system
- Smart default location fallback (Dublin)
- Graceful error handling with automatic fallback
- Manual location button for precise positioning

**v0.15** - Enhanced debugging for deployment issues
- Added comprehensive console logging for API requests
- Better error handling for different deployment environments

**v0.14** - Updated project documentation and versioning workflow
- Established systematic version management
- Updated feature documentation

**Earlier versions (v0.13 and below):**
- Initial geolocation implementation
- Global city coverage (120 cities)
- Coolify deployment preparation
- Docker containerization
- API key management

### 🔧 Debugging & Troubleshooting

**For Coolify Deployment Issues:**

1. **Check API Status:**
   ```javascript
   // Open browser console (F12) on Coolify URL
   checkAPIStatus()
   ```

2. **Debug Environment:**
   - Visit: `https://ysg04kow8sk4sk40ooc8go8g.eu1.mlgym.io/debug/env`
   - Check if API key is properly set

3. **Common Issues:**
   - **API Key Warning:** Set `OPENWEATHER_API_KEY` in Coolify environment variables
   - **Location Timeout:** Use manual city selection or default location fallback
   - **Network Errors:** Check browser console for detailed fetch request logs

4. **Console Commands:**
   ```javascript
   checkAPIStatus()    // Test API connectivity and environment
   testLocation()      // Test geolocation services
   getAppStatus()      // Get current app state
   ```

5. **Log Filtering:**
   - Filter console with: `WEATHER-DEBUG`
   - All debug logs are timestamped and prefixed

### Environment Variables

**Required for Coolify:**
- `OPENWEATHER_API_KEY`: Your OpenWeatherMap API key (32 characters)
- `PORT`: Server port (default: 3000)

### Installation

1. Clone the repository:

```bash
git clone https://github.com/yourusername/weather-app.git
cd weather-app

