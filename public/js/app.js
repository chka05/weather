// Update time displays every second
function updateTimes() {
    // Update Dublin time
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

// Store current city timezone for real-time updates
let currentCityTimezone = null;

// Handle city selection change
document.getElementById('city-select').addEventListener('change', async function() {
    const selectedIndex = this.value;
    const weatherDisplay = document.getElementById('weather-display');
    
    // Show loading state
    weatherDisplay.innerHTML = '<div class="loading">Loading weather data...</div>';
    
    if (selectedIndex === '-1') {
        // Reset timezone and reload page to show current location weather
        currentCityTimezone = null;
        document.getElementById('selected-city-time-label').textContent = 'Local Time';
        window.location.reload();
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
            weatherDisplay.innerHTML = `
                <h3 id="location-name">${data.cityName}</h3>
                <div class="weather-info">
                    <div class="temperature">
                        <span class="temp-value">${Math.round(data.weather.main.temp)}°C</span>
                        <span class="feels-like">Feels like ${Math.round(data.weather.main.feels_like)}°C</span>
                    </div>
                    <div class="weather-description">
                        <p>${data.weather.weather[0].description}</p>
                        <img src="https://openweathermap.org/img/wn/${data.weather.weather[0].icon}@2x.png" alt="Weather icon">
                    </div>
                </div>
                <div class="weather-details">
                    <p>Humidity: ${data.weather.main.humidity}%</p>
                    <p>Wind: ${data.weather.wind.speed} m/s</p>
                    <p>Pressure: ${data.weather.main.pressure} hPa</p>
                </div>
            `;
            
            // Timezone is now stored in currentCityTimezone
        } else {
            weatherDisplay.innerHTML = '<div class="error">Unable to fetch weather data for this city.</div>';
        }
    } catch (error) {
        console.error('Error:', error);
        weatherDisplay.innerHTML = `<div class="error">Error: ${error.message}</div>`;
    }
});

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

// Update times every second
setInterval(() => {
    updateTimes();
    updateSelectedCityTime();
}, 1000);

// Initial time update
updateTimes();
updateSelectedCityTime();