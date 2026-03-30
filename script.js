const button = document.getElementById('getWeather');

button.addEventListener('click', async () => {
    const city = document.getElementById('cityInput').value;
    const display = document.getElementById('weatherDisplay');
    
    if (!city) return; // Don't do anything if the box is empty

    // 1. Show the Loading Spinner
    display.innerHTML = `<div class="spinner"></div><p style="color: #888;">SkyAI is analyzing...</p>`;
    
    try {
        const geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${city}&count=1&language=en&format=json`;
        const geoRes = await fetch(geoUrl);
        const geoData = await geoRes.json();

        if (!geoData.results) {
            display.innerHTML = "<p style='color: #ff4d4d;'>City not found!</p>";
            return;
        }

        const { latitude, longitude, name, country } = geoData.results[0];

        const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,weather_code`;
        const weatherRes = await fetch(weatherUrl);
        const weatherData = await weatherRes.json();

        // 2. Replace Spinner with Data
        display.innerHTML = `
            <div style="animation: fadeIn 0.6s ease-out; padding-top: 10px;">
                <p style="font-size: 0.75rem; text-transform: uppercase; letter-spacing: 1px; color: #aaa; margin-bottom: 5px;">SkyAI Report for ${name}, ${country}</p>
                <h2 style="font-size: 3.5rem; margin: 10px 0; color: #1a1a1a; font-weight: 700;">${Math.round(weatherData.current.temperature_2m)}°</h2>
                <div style="display: flex; justify-content: center; gap: 15px; color: #555;">
                    <span>💧 ${weatherData.current.relative_humidity_2m}% Humidity</span>
                </div>
            </div>
        `;
        
    } catch (error) {
        display.innerHTML = "<p style='color: #ff4d4d;'>Connection Error. Try again.</p>";
    }
});
let globalWeatherData = null; // Store data here so we can switch views

button.addEventListener('click', async () => {
    const city = document.getElementById('cityInput').value;
    const display = document.getElementById('weatherDisplay');
    const options = document.getElementById('forecastOptions');
    
    display.innerHTML = `<div class="spinner"></div>`;
    options.style.display = "none";

    try {
        const geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${city}&count=1&language=en&format=json`;
        const geoRes = await fetch(geoUrl);
        const geoData = await geoRes.json();

        if (!geoData.results) {
            display.innerHTML = "City not found!";
            return;
        }

        const { latitude, longitude, name } = geoData.results[0];

        // FETCH ALL DATA: Current, Hourly (24h), and Daily (30 days)
        const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m&hourly=temperature_2m&daily=temperature_2m_max,temperature_2m_min&forecast_days=31`;
        const weatherRes = await fetch(weatherUrl);
        globalWeatherData = await weatherRes.json();

        options.style.display = "flex"; // Show the 24h/30d buttons
        
        // Default View: Current Weather
        display.innerHTML = `
            <h2>${name}</h2>
            <h1 style="font-size: 3rem;">${Math.round(globalWeatherData.current.temperature_2m)}°C</h1>
            <p>Select a forecast option above</p>
        `;

    } catch (error) {
        display.innerHTML = "Error fetching data.";
    }
});

// Function for 24 Hour Forecast
function show24h() {
    const display = document.getElementById('weatherDisplay');
    let html = '<div class="forecast-list"><h3>Next 24 Hours</h3>';
    for (let i = 0; i < 24; i++) {
        const time = new Date(globalWeatherData.hourly.time[i]).getHours();
        const temp = globalWeatherData.hourly.temperature_2m[i];
        html += `<div class="forecast-item"><span>${time}:00</span> <span>${temp}°C</span></div>`;
    }
    html += '</div>';
    display.innerHTML = html;
}

// Function for 30 Day Forecast
function show30d() {
    const display = document.getElementById('weatherDisplay');
    let html = '<div class="forecast-list"><h3>30-Day Outlook</h3>';
    for (let i = 0; i < 30; i++) {
        const date = new Date(globalWeatherData.daily.time[i]).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        const max = globalWeatherData.daily.temperature_2m_max[i];
        const min = globalWeatherData.daily.temperature_2m_min[i];
        html += `<div class="forecast-item"><span>${date}</span> <span>${max}° / ${min}°</span></div>`;
    }
    html += '</div>';
    display.innerHTML = html;
}