// Helper to get Icon based on Open-Meteo Weather Codes
function getWeatherIcon(code) {
    if (code === 0) return '<i data-lucide="sun" class="icon-sun"></i>';
    if (code <= 3) return '<i data-lucide="cloud" class="icon-cloud"></i>';
    if (code >= 51 && code <= 67) return '<i data-lucide="cloud-rain" class="icon-rain"></i>';
    if (code >= 71 && code <= 77) return '<i data-lucide="snowflake" class="icon-snow"></i>';
    if (code >= 95) return '<i data-lucide="cloud-lightning" class="icon-bolt"></i>';
    return '<i data-lucide="cloud-sun"></i>';
}

function showCurrent() {
    if (!globalWeatherData) return;
    const display = document.getElementById('weatherDisplay');
    const code = globalWeatherData.current.weather_code || 0;
    
    display.innerHTML = `
        <div style="animation: fadeIn 0.5s ease-out;">
            <div class="main-icon-container">${getWeatherIcon(code)}</div>
            <p style="color: #888; font-size: 0.8rem; margin-bottom: 0;">${currentCityDisplay}</p>
            <h1 style="font-size: 3.5rem; margin: 5px 0;">${Math.round(globalWeatherData.current.temperature_2m)}°C</h1>
            <p>Humidity: ${globalWeatherData.current.relative_humidity_2m}%</p>
        </div>
    `;
    lucide.createIcons(); // This triggers the icons to draw
}

function show24h() {
    const display = document.getElementById('weatherDisplay');
    let html = '<div class="forecast-list"><h3>Next 24 Hours</h3>';
    for (let i = 0; i < 24; i++) {
        const time = new Date(globalWeatherData.hourly.time[i]).getHours() + ":00";
        const temp = globalWeatherData.hourly.temperature_2m[i];
        // We add a generic cloud-sun for hourly to keep it clean
        html += `<div class="forecast-item">
                    <span>${time}</span> 
                    <i data-lucide="cloud-sun" style="width:16px; opacity:0.6;"></i>
                    <span>${temp}°C</span>
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
        const max = globalWeatherData.daily.temperature_2m_max[i];
        html += `<div class="forecast-item">
                    <span>${date}</span> 
                    <i data-lucide="thermometer" style="width:14px; color:#ff7e5f;"></i>
                    <span>${Math.round(max)}°C</span>
                 </div>`;
    }
    display.innerHTML = html + '</div>';
    lucide.createIcons();
}