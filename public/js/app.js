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

// Load weather for default location (Dublin) with permission denied message
async function loadDefaultLocation() {
    const weatherDisplay = document.getElementById('weather-display');
    
    try {
        weatherDisplay.innerHTML = '<div class="loading">Loading default location weather...</div>';
        
        // Use Dublin as default location
        const defaultLat = 53.3498;
        const defaultLon = -6.2603;
        
        const response = await fetch('/api/weather/location', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ lat: defaultLat, lon: defaultLon })
        });
        
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.error || `Server error: ${response.status}`);
        }
        
        displayWeatherData(data.weather, data.cityName);
        
        // Update the dropdown label
        const currentLocationOption = document.querySelector('option[value="-1"]');
        if (currentLocationOption) {
            currentLocationOption.textContent = `Default Location (${data.cityName})`;
        }
        
        // Show permission denied message
        const permissionMessage = document.createElement('div');
        permissionMessage.style.textAlign = 'center';
        permissionMessage.style.marginTop = '15px';
        permissionMessage.style.padding = '10px';
        permissionMessage.style.borderRadius = '4px';
        permissionMessage.style.backgroundColor = '#ffebee';
        permissionMessage.style.border = '1px solid #ffcdd2';
        permissionMessage.innerHTML = `
            <p style="margin: 0; color: #c62828; font-size: 0.9em;">📍 Location permission not granted - showing weather for Dublin, Ireland</p>
        `;
        document.getElementById('weather-display').appendChild(permissionMessage);
        
    } catch (error) {
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
                
                userLocation = { lat, lon };
                
                weatherDisplay.innerHTML = '<div class="loading">Loading weather data...</div>';
                
                const response = await fetch('/api/weather/location', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ lat, lon })
                });
                
                const data = await response.json();
                
                if (!response.ok) {
                    throw new Error(data.error || 'Failed to fetch weather data');
                }
                
                displayWeatherData(data.weather, data.cityName);
                
                // Update the dropdown label
                const currentLocationOption = document.querySelector('option[value="-1"]');
                currentLocationOption.textContent = `Current Location (${data.cityName})`;
                
                // Show success message
                const successMessage = document.createElement('div');
                successMessage.style.textAlign = 'center';
                successMessage.style.marginTop = '15px';
                successMessage.style.padding = '10px';
                successMessage.style.borderRadius = '4px';
                successMessage.style.backgroundColor = '#e8f5e8';
                successMessage.style.border = '1px solid #c8e6c9';
                successMessage.innerHTML = `
                    <p style="margin: 0; color: #2e7d32; font-size: 0.9em;">📍 Current location: ${data.cityName}</p>
                `;
                document.getElementById('weather-display').appendChild(successMessage);
                
            } catch (error) {
                weatherDisplay.innerHTML = `
                    <div class="error">
                        <p>Error loading weather data: ${error.message}</p>
                        <p>Please select a city from the dropdown above.</p>
                    </div>
                `;
            }
        },
        (error) => {
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
                const response = await fetch('/api/weather/location', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(userLocation)
                });
                
                const data = await response.json();
                
                if (!response.ok) {
                    throw new Error(data.error || 'Failed to fetch weather data');
                }
                
                displayWeatherData(data.weather, data.cityName);
            } catch (error) {
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
    try {
        // Initial time update
        updateDublinTime();
        updateSelectedCityTime();
        
        // Always try to get user's exact location first
        getUserLocation();
    } catch (error) {
        // Silent error handling
    }
});