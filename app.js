const express = require('express');
const axios = require('axios');
const moment = require('moment-timezone');
const path = require('path');
const { version } = require('./package.json');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

// Major cities by continent (sorted alphabetically)
const citiesByContinent = {
  // Africa - 20 major cities
  'Africa': [
    { name: 'Abidjan', timezone: 'Africa/Abidjan', lat: 5.3364, lon: -4.0267 },
    { name: 'Accra', timezone: 'Africa/Accra', lat: 5.6037, lon: -0.1870 },
    { name: 'Addis Ababa', timezone: 'Africa/Addis_Ababa', lat: 9.0320, lon: 38.7469 },
    { name: 'Algiers', timezone: 'Africa/Algiers', lat: 36.7372, lon: 3.0865 },
    { name: 'Cairo', timezone: 'Africa/Cairo', lat: 30.0444, lon: 31.2357 },
    { name: 'Cape Town', timezone: 'Africa/Johannesburg', lat: -33.9249, lon: 18.4241 },
    { name: 'Casablanca', timezone: 'Africa/Casablanca', lat: 33.5731, lon: -7.5898 },
    { name: 'Dakar', timezone: 'Africa/Dakar', lat: 14.7167, lon: -17.4677 },
    { name: 'Dar es Salaam', timezone: 'Africa/Dar_es_Salaam', lat: -6.7924, lon: 39.2083 },
    { name: 'Durban', timezone: 'Africa/Johannesburg', lat: -29.8587, lon: 31.0218 },
    { name: 'Harare', timezone: 'Africa/Harare', lat: -17.8252, lon: 31.0335 },
    { name: 'Johannesburg', timezone: 'Africa/Johannesburg', lat: -26.2041, lon: 28.0473 },
    { name: 'Khartoum', timezone: 'Africa/Khartoum', lat: 15.5007, lon: 32.5599 },
    { name: 'Kinshasa', timezone: 'Africa/Kinshasa', lat: -4.4419, lon: 15.2663 },
    { name: 'Lagos', timezone: 'Africa/Lagos', lat: 6.5244, lon: 3.3792 },
    { name: 'Luanda', timezone: 'Africa/Luanda', lat: -8.8390, lon: 13.2894 },
    { name: 'Maputo', timezone: 'Africa/Maputo', lat: -25.9692, lon: 32.5732 },
    { name: 'Nairobi', timezone: 'Africa/Nairobi', lat: -1.2921, lon: 36.8219 },
    { name: 'Rabat', timezone: 'Africa/Casablanca', lat: 34.0209, lon: -6.8416 },
    { name: 'Tunis', timezone: 'Africa/Tunis', lat: 36.8065, lon: 10.1815 }
  ],

  // Asia - 20 major cities
  'Asia': [
    { name: 'Almaty', timezone: 'Asia/Almaty', lat: 43.2220, lon: 76.8512 },
    { name: 'Bangkok', timezone: 'Asia/Bangkok', lat: 13.7563, lon: 100.5018 },
    { name: 'Beijing', timezone: 'Asia/Shanghai', lat: 39.9042, lon: 116.4074 },
    { name: 'Colombo', timezone: 'Asia/Colombo', lat: 6.9271, lon: 79.8612 },
    { name: 'Delhi', timezone: 'Asia/Kolkata', lat: 28.7041, lon: 77.1025 },
    { name: 'Dhaka', timezone: 'Asia/Dhaka', lat: 23.8103, lon: 90.4125 },
    { name: 'Dubai', timezone: 'Asia/Dubai', lat: 25.2048, lon: 55.2708 },
    { name: 'Hong Kong', timezone: 'Asia/Hong_Kong', lat: 22.3193, lon: 114.1694 },
    { name: 'Jakarta', timezone: 'Asia/Jakarta', lat: -6.2088, lon: 106.8456 },
    { name: 'Karachi', timezone: 'Asia/Karachi', lat: 24.8607, lon: 67.0011 },
    { name: 'Kuala Lumpur', timezone: 'Asia/Kuala_Lumpur', lat: 3.1390, lon: 101.6869 },
    { name: 'Manila', timezone: 'Asia/Manila', lat: 14.5995, lon: 120.9842 },
    { name: 'Mumbai', timezone: 'Asia/Kolkata', lat: 19.0760, lon: 72.8777 },
    { name: 'Riyadh', timezone: 'Asia/Riyadh', lat: 24.7136, lon: 46.6753 },
    { name: 'Seoul', timezone: 'Asia/Seoul', lat: 37.5665, lon: 126.9780 },
    { name: 'Shanghai', timezone: 'Asia/Shanghai', lat: 31.2304, lon: 121.4737 },
    { name: 'Singapore', timezone: 'Asia/Singapore', lat: 1.3521, lon: 103.8198 },
    { name: 'Tashkent', timezone: 'Asia/Tashkent', lat: 41.2995, lon: 69.2401 },
    { name: 'Tehran', timezone: 'Asia/Tehran', lat: 35.6892, lon: 51.3890 },
    { name: 'Tokyo', timezone: 'Asia/Tokyo', lat: 35.6762, lon: 139.6503 }
  ],

  // Europe - 20 major cities
  'Europe': [
    { name: 'Amsterdam', timezone: 'Europe/Amsterdam', lat: 52.3676, lon: 4.9041 },
    { name: 'Athens', timezone: 'Europe/Athens', lat: 37.9838, lon: 23.7275 },
    { name: 'Barcelona', timezone: 'Europe/Madrid', lat: 41.3851, lon: 2.1734 },
    { name: 'Berlin', timezone: 'Europe/Berlin', lat: 52.5200, lon: 13.4050 },
    { name: 'Brussels', timezone: 'Europe/Brussels', lat: 50.8503, lon: 4.3517 },
    { name: 'Budapest', timezone: 'Europe/Budapest', lat: 47.4979, lon: 19.0402 },
    { name: 'Copenhagen', timezone: 'Europe/Copenhagen', lat: 55.6761, lon: 12.5683 },
    { name: 'Dublin', timezone: 'Europe/Dublin', lat: 53.3498, lon: -6.2603 },
    { name: 'Istanbul', timezone: 'Europe/Istanbul', lat: 41.0082, lon: 28.9784 },
    { name: 'Lisbon', timezone: 'Europe/Lisbon', lat: 38.7223, lon: -9.1393 },
    { name: 'London', timezone: 'Europe/London', lat: 51.5074, lon: -0.1278 },
    { name: 'Madrid', timezone: 'Europe/Madrid', lat: 40.4168, lon: -3.7038 },
    { name: 'Milan', timezone: 'Europe/Rome', lat: 45.4642, lon: 9.1900 },
    { name: 'Moscow', timezone: 'Europe/Moscow', lat: 55.7558, lon: 37.6176 },
    { name: 'Oslo', timezone: 'Europe/Oslo', lat: 59.9139, lon: 10.7522 },
    { name: 'Paris', timezone: 'Europe/Paris', lat: 48.8566, lon: 2.3522 },
    { name: 'Prague', timezone: 'Europe/Prague', lat: 50.0755, lon: 14.4378 },
    { name: 'Rome', timezone: 'Europe/Rome', lat: 41.9028, lon: 12.4964 },
    { name: 'Stockholm', timezone: 'Europe/Stockholm', lat: 59.3293, lon: 18.0686 },
    { name: 'Vienna', timezone: 'Europe/Vienna', lat: 48.2082, lon: 16.3738 }
  ],

  // North America - 20 major cities
  'North America': [
    { name: 'Atlanta', timezone: 'America/New_York', lat: 33.7490, lon: -84.3880 },
    { name: 'Boston', timezone: 'America/New_York', lat: 42.3601, lon: -71.0589 },
    { name: 'Chicago', timezone: 'America/Chicago', lat: 41.8781, lon: -87.6298 },
    { name: 'Dallas', timezone: 'America/Chicago', lat: 32.7767, lon: -96.7970 },
    { name: 'Denver', timezone: 'America/Denver', lat: 39.7392, lon: -104.9903 },
    { name: 'Detroit', timezone: 'America/Detroit', lat: 42.3314, lon: -83.0458 },
    { name: 'Guadalajara', timezone: 'America/Mexico_City', lat: 20.6597, lon: -103.3496 },
    { name: 'Houston', timezone: 'America/Chicago', lat: 29.7604, lon: -95.3698 },
    { name: 'Las Vegas', timezone: 'America/Los_Angeles', lat: 36.1699, lon: -115.1398 },
    { name: 'Los Angeles', timezone: 'America/Los_Angeles', lat: 34.0522, lon: -118.2437 },
    { name: 'Mexico City', timezone: 'America/Mexico_City', lat: 19.4326, lon: -99.1332 },
    { name: 'Miami', timezone: 'America/New_York', lat: 25.7617, lon: -80.1918 },
    { name: 'Montreal', timezone: 'America/Toronto', lat: 45.5017, lon: -73.5673 },
    { name: 'New York', timezone: 'America/New_York', lat: 40.7128, lon: -74.0060 },
    { name: 'Philadelphia', timezone: 'America/New_York', lat: 39.9526, lon: -75.1652 },
    { name: 'Phoenix', timezone: 'America/Phoenix', lat: 33.4484, lon: -112.0740 },
    { name: 'San Francisco', timezone: 'America/Los_Angeles', lat: 37.7749, lon: -122.4194 },
    { name: 'Seattle', timezone: 'America/Los_Angeles', lat: 47.6062, lon: -122.3321 },
    { name: 'Toronto', timezone: 'America/Toronto', lat: 43.6532, lon: -79.3832 },
    { name: 'Vancouver', timezone: 'America/Vancouver', lat: 49.2827, lon: -123.1207 }
  ],

  // Oceania - 20 major cities
  'Oceania': [
    { name: 'Adelaide', timezone: 'Australia/Adelaide', lat: -34.9285, lon: 138.6007 },
    { name: 'Auckland', timezone: 'Pacific/Auckland', lat: -36.8485, lon: 174.7633 },
    { name: 'Brisbane', timezone: 'Australia/Brisbane', lat: -27.4698, lon: 153.0251 },
    { name: 'Cairns', timezone: 'Australia/Brisbane', lat: -16.9186, lon: 145.7781 },
    { name: 'Canberra', timezone: 'Australia/Sydney', lat: -35.2809, lon: 149.1300 },
    { name: 'Christchurch', timezone: 'Pacific/Auckland', lat: -43.5321, lon: 172.6362 },
    { name: 'Darwin', timezone: 'Australia/Darwin', lat: -12.4634, lon: 130.8456 },
    { name: 'Geelong', timezone: 'Australia/Melbourne', lat: -38.1499, lon: 144.3617 },
    { name: 'Gold Coast', timezone: 'Australia/Brisbane', lat: -28.0167, lon: 153.4000 },
    { name: 'Hamilton', timezone: 'Pacific/Auckland', lat: -37.7870, lon: 175.2793 },
    { name: 'Hobart', timezone: 'Australia/Hobart', lat: -42.8821, lon: 147.3272 },
    { name: 'Melbourne', timezone: 'Australia/Melbourne', lat: -37.8136, lon: 144.9631 },
    { name: 'Newcastle', timezone: 'Australia/Sydney', lat: -32.9283, lon: 151.7817 },
    { name: 'Noumea', timezone: 'Pacific/Noumea', lat: -22.2758, lon: 166.4581 },
    { name: 'Perth', timezone: 'Australia/Perth', lat: -31.9505, lon: 115.8605 },
    { name: 'Port Moresby', timezone: 'Pacific/Port_Moresby', lat: -9.4438, lon: 147.1803 },
    { name: 'Suva', timezone: 'Pacific/Fiji', lat: -18.1248, lon: 178.4501 },
    { name: 'Sydney', timezone: 'Australia/Sydney', lat: -33.8688, lon: 151.2093 },
    { name: 'Townsville', timezone: 'Australia/Brisbane', lat: -19.2590, lon: 146.8169 },
    { name: 'Wellington', timezone: 'Pacific/Auckland', lat: -41.2865, lon: 174.7762 }
  ],

  // South America - 20 major cities
  'South America': [
    { name: 'Asuncion', timezone: 'America/Asuncion', lat: -25.2637, lon: -57.5759 },
    { name: 'Barranquilla', timezone: 'America/Bogota', lat: 10.9685, lon: -74.7813 },
    { name: 'Belo Horizonte', timezone: 'America/Sao_Paulo', lat: -19.9167, lon: -43.9345 },
    { name: 'Bogota', timezone: 'America/Bogota', lat: 4.7110, lon: -74.0721 },
    { name: 'Brasilia', timezone: 'America/Sao_Paulo', lat: -15.8267, lon: -47.9218 },
    { name: 'Buenos Aires', timezone: 'America/Argentina/Buenos_Aires', lat: -34.6118, lon: -58.3960 },
    { name: 'Caracas', timezone: 'America/Caracas', lat: 10.4806, lon: -66.9036 },
    { name: 'Cordoba', timezone: 'America/Argentina/Cordoba', lat: -31.4201, lon: -64.1888 },
    { name: 'Curitiba', timezone: 'America/Sao_Paulo', lat: -25.4284, lon: -49.2733 },
    { name: 'Fortaleza', timezone: 'America/Fortaleza', lat: -3.7319, lon: -38.5267 },
    { name: 'Guayaquil', timezone: 'America/Guayaquil', lat: -2.1894, lon: -79.8890 },
    { name: 'La Paz', timezone: 'America/La_Paz', lat: -16.2902, lon: -68.1193 },
    { name: 'Lima', timezone: 'America/Lima', lat: -12.0464, lon: -77.0428 },
    { name: 'Medellin', timezone: 'America/Bogota', lat: 6.2442, lon: -75.5812 },
    { name: 'Montevideo', timezone: 'America/Montevideo', lat: -34.9011, lon: -56.1645 },
    { name: 'Porto Alegre', timezone: 'America/Sao_Paulo', lat: -30.0346, lon: -51.2177 },
    { name: 'Quito', timezone: 'America/Guayaquil', lat: -0.1807, lon: -78.4678 },
    { name: 'Rio de Janeiro', timezone: 'America/Sao_Paulo', lat: -22.9068, lon: -43.1729 },
    { name: 'Salvador', timezone: 'America/Bahia', lat: -12.9777, lon: -38.5016 },
    { name: 'Santiago', timezone: 'America/Santiago', lat: -33.4489, lon: -70.6693 },
    { name: 'Sao Paulo', timezone: 'America/Sao_Paulo', lat: -23.5505, lon: -46.6333 }
  ]
};

// Flatten cities for backward compatibility and create indexed array
const majorCities = [];
Object.keys(citiesByContinent).sort().forEach(continent => {
  citiesByContinent[continent].forEach(city => {
    majorCities.push({ ...city, continent });
  });
});

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
    // For local development and private IPs, use empty string to auto-detect public IP
    if (ip === '::1' || ip === '127.0.0.1' || ip === '::ffff:127.0.0.1' || 
        ip?.startsWith('::ffff:172.') || ip?.startsWith('172.') || 
        ip?.startsWith('192.168.') || ip?.startsWith('10.')) {
      ip = '';
    }
    
    console.log('Attempting to get location for IP:', ip || 'auto-detect');
    const response = await axios.get(`http://ip-api.com/json/${ip}`);
    console.log('IP geolocation response:', response.data);
    
    // If geolocation fails or returns private range, use default location
    if (response.data.status !== 'success') {
      console.log('IP geolocation failed, using default Dublin location');
      return {
        status: 'success',
        city: 'Dublin',
        lat: 53.3498,
        lon: -6.2603
      };
    }
    
    return response.data;
  } catch (error) {
    console.error('Error getting location by IP:', error.message);
    // Return default Dublin location if IP geolocation fails
    return {
      status: 'success',
      city: 'Dublin',
      lat: 53.3498,
      lon: -6.2603
    };
  }
}

// Routes
app.get('/', async (req, res) => {
  try {
    // Get current times
    const dublinTime = moment().tz('Europe/Dublin').format('YYYY-MM-DD HH:mm:ss');
    const times = {
      dublin: dublinTime,
      local: moment().format('YYYY-MM-DD HH:mm:ss')
    };
    
    res.render('index', {
      cities: majorCities,
      defaultWeather: null, // Will be loaded by browser geolocation
      defaultCity: 'Your Location',
      times,
      weatherApiKey: WEATHER_API_KEY !== 'YOUR_API_KEY_HERE' && WEATHER_API_KEY !== '',
      version: `v${version}`
    });
  } catch (error) {
    console.error('Error in main route:', error);
    res.status(500).send('Server error');
  }
});

// API endpoint to get weather for user's browser location
app.post('/api/weather/location', async (req, res) => {
  try {
    console.log('POST /api/weather/location - Request body:', req.body);
    console.log('POST /api/weather/location - Request headers:', req.headers);
    
    const { lat, lon } = req.body;
    
    if (!lat || !lon) {
      console.log('Missing lat/lon - lat:', lat, 'lon:', lon);
      return res.status(400).json({ error: 'Latitude and longitude are required' });
    }
    
    console.log('Getting weather for browser location:', lat, lon);
    const weather = await getWeatherData(lat, lon);
    
    if (!weather) {
      console.log('Weather data returned null');
      return res.status(500).json({ error: 'Failed to fetch weather data' });
    }
    
    console.log('Weather data retrieved successfully:', weather.name);
    res.json({
      weather,
      cityName: weather.name || 'Your Location'
    });
  } catch (error) {
    console.error('Error fetching location weather:', error);
    res.status(500).json({ error: 'Failed to fetch weather data' });
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
      cityName: city.name,
      timezone: city.timezone
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