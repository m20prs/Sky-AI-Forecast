const button = document.getElementById('getWeather');
let globalWeatherData = null;
let currentCityName = ""; // To remember the city name when switching tabs

button.addEventListener('click', async () => {
    const city = document.getElementById('cityInput').value;
    const display = document.getElementById('weatherDisplay');
    const options = document.getElementById('forecastOptions');
    
    if (!city) return;

    display.innerHTML = `<div class="spinner"></div><p>Searching...</p>`;
    options.style.display = "none";

    try {
        const geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1`;
        const geoRes = await fetch(geoUrl);
        const geoData = await geoRes.json();

        if (!geoData.results || geoData.results.length === 0) {
            display.innerHTML = "City not found!";
            return;
        }

        const { latitude, longitude, name, country } = geoData.results[0];
        currentCityName = `${name}, ${country}`;

        const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m&hourly=temperature_2m&daily=temperature_2m_max,temperature_2m_min&forecast_days=16&timezone=auto`;
        
        const weatherRes = await fetch(weatherUrl);
        globalWeatherData = await weatherRes.json();

        options.style.display = "flex";
        showCurrent(); // Call the new function to show the initial view

    } catch (error) {
        display.innerHTML = "Connection error. Please try again.";
    }
});

// NEW: Function to show the main current weather view
function showCurrent() {
    if (!globalWeatherData) return;
    const display = document.getElementById('weatherDisplay');
    display.innerHTML = `
        <div style="animation: fadeIn 0.5s ease-out;">
            <p style="color: #888; font-size: 0.8rem; margin-bottom: 0;">${currentCityName}</p>
            <h1 style="font-size: 3.5rem; margin: 10px 0; font-weight: 700;">${Math.round(globalWeatherData.current.temperature_2m)}°C</h1>
            <p>Humidity: ${globalWeatherData.current.relative_humidity_2m}%</p>
        </div>
    `;
}

function show24h() {
    if (!globalWeatherData) return;
    const display = document.getElementById('weatherDisplay');
    let html = '<div class="forecast-list"><h3>Next 24 Hours</h3>';
    for (let i = 0; i < 24; i++) {
        const time = new Date(globalWeatherData.hourly.time[i]).getHours() + ":00";
        const temp = globalWeatherData.hourly.temperature_2m[i];
        html += `<div class="forecast-item"><span>${time}</span> <span>${temp}°C</span></div>`;
    }
    display.innerHTML = html + '</div>';
}

function show30d() {
    if (!globalWeatherData) return;
    const display = document.getElementById('weatherDisplay');
    let html = '<div class="forecast-list"><h3>16-Day Extended Outlook</h3>';
    for (let i = 0; i < globalWeatherData.daily.time.length; i++) {
        const date = new Date(globalWeatherData.daily.time[i]).toLocaleDateString('en-US', { 
            month: 'short', day: 'numeric', weekday: 'short' 
        });
        html += `
            <div class="forecast-item">
                <span>${date}</span> 
                <span><strong>${Math.round(globalWeatherData.daily.temperature_2m_max[i])}°</strong> / ${Math.round(globalWeatherData.daily.temperature_2m_min[i])}°</span>
            </div>`;
    }
    display.innerHTML = html + '</div>';
}