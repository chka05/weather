# Claude.md

## Project: Simple Weather App

### Overview

This project is a **simple weather and time app** built using **Node.js**. It fetches and displays:

- The **current weather** for your **actual location (using browser geolocation)**.
- A **dropdown list of 120 major cities** across all continents to select and view their weather.
- The **current time in Dublin** and the **current time in the selected city**.

### Features

✅ Fetch current weather using OpenWeatherMap API  
✅ Detect user location using browser geolocation (GPS/WiFi)  
✅ List 120 major cities across 6 continents (Africa, Asia, Europe, North America, Oceania, South America)  
✅ Display current time in Dublin and in the selected city  
✅ Real-time clock updates  
✅ Responsive design for mobile and desktop  
✅ Docker containerization for easy deployment  
✅ Coolify deployment ready  

### Technologies

- Node.js (Express)
- [OpenWeatherMap API](https://openweathermap.org/api) for weather data
- Browser Geolocation API for precise location detection
- [Moment-Timezone](https://momentjs.com/timezone/) for time handling
- EJS templating engine
- Docker for containerization

### Development Workflow

**Version Management:**
- After every change, increment version by 0.1 (e.g., v0.13 → v0.14)
- Version format: `v0.xx` (remove final .0)
- Update package.json version
- Commit and push changes automatically

### Installation

1. Clone the repository:

```bash
git clone https://github.com/yourusername/weather-app.git
cd weather-app

