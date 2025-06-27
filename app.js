const express = require('express');
const axios = require('axios');
const moment = require('moment-timezone');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

// Major cities list
const majorCities = [
  { name: 'New York', timezone: 'America/New_York', lat: 40.7128, lon: -74.0060 },
  { name: 'London', timezone: 'Europe/London', lat: 51.5074, lon: -0.1278 },
  { name: 'Tokyo', timezone: 'Asia/Tokyo', lat: 35.6762, lon: 139.6503 },
  { name: 'Sydney', timezone: 'Australia/Sydney', lat: -33.8688, lon: 151.2093 },
  { name: 'Paris', timezone: 'Europe/Paris', lat: 48.8566, lon: 2.3522 },
  { name: 'Dubai', timezone: 'Asia/Dubai', lat: 25.2048, lon: 55.2708 },
  { name: 'Singapore', timezone: 'Asia/Singapore', lat: 1.3521, lon: 103.8198 },
  { name: 'Los Angeles', timezone: 'America/Los_Angeles', lat: 34.0522, lon: -118.2437 },
  { name: 'Berlin', timezone: 'Europe/Berlin', lat: 52.5200, lon: 13.4050 },
  { name: 'Mumbai', timezone: 'Asia/Kolkata', lat: 19.0760, lon: 72.8777 }
];

// OpenWeatherMap API configuration
const WEATHER_API_KEY = process.env.OPENWEATHER_API_KEY || 'YOUR_API_KEY_HERE';
const WEATHER_API_BASE_URL = 'https://api.openweathermap.org/data/2.5/weather';

// Function to get weather data
async function getWeatherData(lat, lon) {
  try {
    const response = await axios.get(WEATHER_API_BASE_URL, {
      params: {
        lat: lat,
        lon: lon,
        appid: WEATHER_API_KEY,
        units: 'metric'
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching weather data:', error.message);
    return null;
  }
}

// Function to get user location by IP
async function getUserLocationByIP(ip) {
  try {
    // For local development, use a default IP
    if (ip === '::1' || ip === '127.0.0.1') {
      ip = '';
    }
    
    const response = await axios.get(`http://ip-api.com/json/${ip}`);
    return response.data;
  } catch (error) {
    console.error('Error getting location by IP:', error.message);
    return null;
  }
}

// Routes
app.get('/', async (req, res) => {
  try {
    // Get user IP
    const userIP = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    
    // Get user location
    const userLocation = await getUserLocationByIP(userIP);
    let defaultWeather = null;
    let defaultCity = 'Your Location';
    
    if (userLocation && userLocation.status === 'success') {
      defaultWeather = await getWeatherData(userLocation.lat, userLocation.lon);
      defaultCity = userLocation.city || 'Your Location';
    }
    
    // Get current times
    const dublinTime = moment().tz('Europe/Dublin').format('YYYY-MM-DD HH:mm:ss');
    const times = {
      dublin: dublinTime,
      local: moment().format('YYYY-MM-DD HH:mm:ss')
    };
    
    res.render('index', {
      cities: majorCities,
      defaultWeather,
      defaultCity,
      times,
      weatherApiKey: WEATHER_API_KEY !== 'YOUR_API_KEY_HERE'
    });
  } catch (error) {
    console.error('Error in main route:', error);
    res.status(500).send('Server error');
  }
});

// API endpoint to get weather for a specific city
app.get('/api/weather/:cityIndex', async (req, res) => {
  try {
    const cityIndex = parseInt(req.params.cityIndex);
    if (cityIndex < 0 || cityIndex >= majorCities.length) {
      return res.status(400).json({ error: 'Invalid city index' });
    }
    
    const city = majorCities[cityIndex];
    const weather = await getWeatherData(city.lat, city.lon);
    const cityTime = moment().tz(city.timezone).format('YYYY-MM-DD HH:mm:ss');
    
    res.json({
      weather,
      cityTime,
      cityName: city.name
    });
  } catch (error) {
    console.error('Error fetching city weather:', error);
    res.status(500).json({ error: 'Failed to fetch weather data' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Weather app is running on http://localhost:${PORT}`);
});