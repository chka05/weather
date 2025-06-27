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

    navigator.geolocation.getCurrentPosition(
        async (position) => {
            try {
                const lat = position.coords.latitude;
                const lon = position.coords.longitude;
                
                console.log('User location:', lat, lon);
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
                    errorMessage = 'Location access denied. Please allow location access and refresh the page.';
                    break;
                case error.POSITION_UNAVAILABLE:
                    errorMessage = 'Location information is unavailable.';
                    break;
                case error.TIMEOUT:
                    errorMessage = 'Location request timed out.';
                    break;
            }
            
            weatherDisplay.innerHTML = `
                <div class="error">
                    <p>${errorMessage}</p>
                    <p>Please select a city from the dropdown above.</p>
                    <button onclick="getUserLocation()" style="margin-top: 10px; padding: 8px 16px; background: #667eea; color: white; border: none; border-radius: 4px; cursor: pointer;">Try Again</button>
                </div>
            `;
        },
        {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 300000 // 5 minutes
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
            // Use cached location
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
                console.error('Error:', error);
                weatherDisplay.innerHTML = `<div class="error">Error: ${error.message}</div>`;
            }
        } else {
            // Get fresh location
            getUserLocation();
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
    
    // Get user's location on page load
    getUserLocation();
});