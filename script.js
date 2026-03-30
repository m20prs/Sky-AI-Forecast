const button = document.getElementById('getWeather');
let globalWeatherData = null;
let currentCityDisplay = "";

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
        currentCityDisplay = `${name}, ${country}`;

        const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,weather_code&hourly=temperature_2m,weather_code&daily=temperature_2m_max,temperature_2m_min,weather_code&forecast_days=16&timezone=auto`;
        
        const weatherRes = await fetch(weatherUrl);
        globalWeatherData = await weatherRes.json();

        options.style.display = "flex";
        showCurrent();

    } catch (error) {
        display.innerHTML = "Connection error. Please try again.";
    }
});

function getWeatherIcon(code) {
    if (code === 0) return '<i data-lucide="sun" style="color: #ffb703"></i>';
    if (code <= 3) return '<i data-lucide="cloud" style="color: #8ecae6"></i>';
    return '<i data-lucide="cloud-rain" style="color: #007bff"></i>';
}

function showCurrent() {
    const display = document.getElementById('weatherDisplay');
    display.innerHTML = `
        <div style="animation: fadeIn 0.5s ease-out;">
            <p style="color: #888; font-size: 0.8rem; margin-bottom: 0;">${currentCityDisplay}</p>
            <h1 style="font-size: 3.5rem; margin: 5px 0;">${Math.round(globalWeatherData.current.temperature_2m)}°C</h1>
            <p>Humidity: ${globalWeatherData.current.relative_humidity_2m}%</p>
        </div>`;
    lucide.createIcons();
}

function show24h() {
    const display = document.getElementById('weatherDisplay');
    let html = '<div class="forecast-list"><h3>Next 24 Hours</h3>';
    for (let i = 0; i < 24; i++) {
        const time = new Date(globalWeatherData.hourly.time[i]).getHours() + ":00";
        html += `
        <div class="forecast-item">
            <span style="width: 50px; text-align: left;">${time}</span> 
            <span style="flex-grow: 1; display: flex; justify-content: center;">${getWeatherIcon(globalWeatherData.hourly.weather_code[i])}</span>
            <span style="width: 50px; text-align: right;">${globalWeatherData.hourly.temperature_2m[i]}°C</span>
        </div>`;
    }
    display.innerHTML = html + '</div>';
    lucide.createIcons();
}

function show30d() {
    const display = document.getElementById('weatherDisplay');
    let html = '<div class="forecast-list"><h3>16-Day Outlook</h3>';
    for (let i = 0; i < globalWeatherData.daily.time.length; i++) {
        const date = new Date(globalWeatherData.daily.time[i]).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        html += `
        <div class="forecast-item">
            <span style="width: 80px; text-align: left;">${date}</span> 
            <span style="flex-grow: 1; display: flex; justify-content: center;">${getWeatherIcon(globalWeatherData.daily.weather_code[i])}</span>
            <span style="width: 80px; text-align: right;"><strong>${Math.round(globalWeatherData.daily.temperature_2m_max[i])}°</strong></span>
        </div>`;
    }
    display.innerHTML = html + '</div>';
    lucide.createIcons();
}

window.addEventListener('load', () => { if (typeof lucide !== 'undefined') lucide.createIcons(); });