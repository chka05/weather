// Store current city timezone for real-time updates
let currentCityTimezone = null;
let userLocation = null;

// Update Dublin time display
function updateDublinTime() {
    const dublinTime = new Date().toLocaleString('en-US', {
        timeZone: 'Europe/Dublin',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
    });
    document.getElementById('dublin-time').textContent = dublinTime.replace(',', '');
}

// Update selected city time
function updateSelectedCityTime() {
    const citySelect = document.getElementById('city-select');
    const selectedIndex = citySelect.value;
    
    if (selectedIndex !== '-1' && currentCityTimezone) {
        const cityTime = new Date().toLocaleString('en-US', {
            timeZone: currentCityTimezone,
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false
        });
        document.getElementById('selected-city-time').textContent = cityTime.replace(',', '');
    } else if (selectedIndex === '-1') {
        // Update local time
        const localTime = new Date().toLocaleString('en-US', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false
        });
        document.getElementById('selected-city-time').textContent = localTime.replace(',', '');
    }
}

// Display weather data in the UI
function displayWeatherData(weather, cityName) {
    const weatherDisplay = document.getElementById('weather-display');
    
    weatherDisplay.innerHTML = `
        <h3 id="location-name">${cityName}</h3>
        <div class="weather-info">
            <div class="temperature">
                <span class="temp-value">${Math.round(weather.main.temp)}°C</span>
                <span class="feels-like">Feels like ${Math.round(weather.main.feels_like)}°C</span>
            </div>
            <div class="weather-description">
                <p>${weather.weather[0].description}</p>
                <img src="https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png" alt="Weather icon">
            </div>
        </div>
        <div class="weather-details">
            <p>Humidity: ${weather.main.humidity}%</p>
            <p>Wind: ${weather.wind.speed} m/s</p>
            <p>Pressure: ${weather.main.pressure} hPa</p>
        </div>
    `;
}

// Load weather for default location (Dublin)
async function loadDefaultLocation() {
    const weatherDisplay = document.getElementById('weather-display');
    
    try {
        weatherDisplay.innerHTML = '<div class="loading">Loading default location weather...</div>';
        
        // Use Dublin as default location
        const defaultLat = 53.3498;
        const defaultLon = -6.2603;
        
        console.log('Loading default location (Dublin):', defaultLat, defaultLon);
        
        const response = await fetch('/api/weather/location', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ lat: defaultLat, lon: defaultLon })
        });
        
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.error || 'Failed to fetch weather data');
        }
        
        displayWeatherData(data.weather, data.cityName);
        
        // Update the dropdown label
        const currentLocationOption = document.querySelector('option[value="-1"]');
        currentLocationOption.textContent = `Default Location (${data.cityName})`;
        
        // Show location access button
        const locationButton = document.createElement('div');
        locationButton.style.textAlign = 'center';
        locationButton.style.marginTop = '20px';
        locationButton.innerHTML = `
            <p style="margin-bottom: 10px; color: #666; font-size: 0.9em;">Want weather for your exact location?</p>
            <button onclick="getUserLocation()" style="padding: 8px 16px; background: #667eea; color: white; border: none; border-radius: 4px; cursor: pointer;">📍 Use My Location</button>
        `;
        document.getElementById('weather-display').appendChild(locationButton);
        
    } catch (error) {
        console.error('Error loading default location:', error);
        weatherDisplay.innerHTML = `
            <div class="error">
                <p>Unable to load weather data.</p>
                <p>Please select a city from the dropdown above.</p>
            </div>
        `;
    }
}

// Get user's location using browser geolocation
function getUserLocation() {
    const weatherDisplay = document.getElementById('weather-display');
    
    if (!navigator.geolocation) {
        weatherDisplay.innerHTML = `
            <div class="error">
                <p>Geolocation is not supported by this browser.</p>
                <p>Please select a city from the dropdown above.</p>
            </div>
        `;
        return;
    }

    // Check if we're on localhost or HTTP (geolocation might be restricted)
    if (location.protocol === 'http:' && location.hostname !== 'localhost' && location.hostname !== '127.0.0.1') {
        weatherDisplay.innerHTML = `
            <div class="error">
                <p>Location access requires HTTPS.</p>
                <p>Please select a city from the dropdown above.</p>
            </div>
        `;
        return;
    }
    
    weatherDisplay.innerHTML = '<div class="loading">📍 Getting your precise location...</div>';

    navigator.geolocation.getCurrentPosition(
        async (position) => {
            try {
                const lat = position.coords.latitude;
                const lon = position.coords.longitude;
                
                console.log('User location:', lat, lon);
                userLocation = { lat, lon };
                
                weatherDisplay.innerHTML = '<div class="loading">Loading weather data...</div>';
                
                console.log('Making fetch request to /api/weather/location with:', { lat, lon });
                
                const response = await fetch('/api/weather/location', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ lat, lon })
                });
                
                console.log('Response status:', response.status);
                console.log('Response headers:', [...response.headers.entries()]);
                
                const data = await response.json();
                console.log('Response data:', data);
                
                if (!response.ok) {
                    throw new Error(data.error || 'Failed to fetch weather data');
                }
                
                displayWeatherData(data.weather, data.cityName);
                
                // Update the dropdown label
                const currentLocationOption = document.querySelector('option[value="-1"]');
                currentLocationOption.textContent = `Current Location (${data.cityName})`;
                
            } catch (error) {
                console.error('Error fetching weather:', error);
                weatherDisplay.innerHTML = `
                    <div class="error">
                        <p>Error loading weather data: ${error.message}</p>
                        <p>Please select a city from the dropdown above.</p>
                    </div>
                `;
            }
        },
        (error) => {
            console.error('Geolocation error:', error);
            let errorMessage = 'Unable to get your location.';
            
            switch (error.code) {
                case error.PERMISSION_DENIED:
                    errorMessage = 'Location access denied. Using default location instead.';
                    break;
                case error.POSITION_UNAVAILABLE:
                    errorMessage = 'Location unavailable. Using default location instead.';
                    break;
                case error.TIMEOUT:
                    errorMessage = 'Location request timed out. Using default location instead.';
                    break;
            }
            
            // Show error briefly then load default location
            weatherDisplay.innerHTML = `
                <div class="loading">
                    <p>${errorMessage}</p>
                    <p>Loading weather for default location...</p>
                </div>
            `;
            
            // Load default location after a brief delay
            setTimeout(() => {
                loadDefaultLocation();
            }, 2000);
        },
        {
            enableHighAccuracy: false, // Faster but less accurate
            timeout: 15000, // Increased timeout to 15 seconds
            maximumAge: 600000 // 10 minutes cache
        }
    );
}

// Handle city selection change
document.getElementById('city-select').addEventListener('change', async function() {
    const selectedIndex = this.value;
    const weatherDisplay = document.getElementById('weather-display');
    
    // Show loading state
    weatherDisplay.innerHTML = '<div class="loading">Loading weather data...</div>';
    
    if (selectedIndex === '-1') {
        // Reset timezone and get user location
        currentCityTimezone = null;
        document.getElementById('selected-city-time-label').textContent = 'Local Time';
        
        if (userLocation) {
            // Use cached user location
            try {
                console.log('Using cached location:', userLocation);
                
                const response = await fetch('/api/weather/location', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(userLocation)
                });
                
                console.log('Cached location response status:', response.status);
                const data = await response.json();
                console.log('Cached location response data:', data);
                
                if (!response.ok) {
                    throw new Error(data.error || 'Failed to fetch weather data');
                }
                
                displayWeatherData(data.weather, data.cityName);
            } catch (error) {
                console.error('Error:', error);
                weatherDisplay.innerHTML = `<div class="error">Error: ${error.message}</div>`;
            }
        } else {
            // Load default location
            loadDefaultLocation();
        }
        return;
    }
    
    try {
        // Fetch weather data for selected city
        const response = await fetch(`/api/weather/${selectedIndex}`);
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.error || 'Failed to fetch weather data');
        }
        
        // Update selected city time label and display
        document.getElementById('selected-city-time-label').textContent = `${data.cityName} Time`;
        document.getElementById('selected-city-time').textContent = data.cityTime;
        
        // Store timezone for real-time updates
        currentCityTimezone = data.timezone;
        
        // Update weather display
        if (data.weather) {
            displayWeatherData(data.weather, data.cityName);
        } else {
            weatherDisplay.innerHTML = '<div class="error">Unable to fetch weather data for this city.</div>';
        }
    } catch (error) {
        console.error('Error:', error);
        weatherDisplay.innerHTML = `<div class="error">Error: ${error.message}</div>`;
    }
});

// Update times every second
setInterval(() => {
    updateDublinTime();
    updateSelectedCityTime();
}, 1000);

// Initialize the app
document.addEventListener('DOMContentLoaded', function() {
    // Initial time update
    updateDublinTime();
    updateSelectedCityTime();
    
    // Load default location first (faster and more reliable)
    loadDefaultLocation();
});