// Add this line at the very top to define the button
const button = document.getElementById('getWeather'); 
let globalWeatherData = null;

button.addEventListener('click', async () => {
    const city = document.getElementById('cityInput').value;
    const display = document.getElementById('weatherDisplay');
    const options = document.getElementById('forecastOptions');
    
    if (!city) return;

    display.innerHTML = `<div class="spinner"></div>`;
    options.style.display = "none";

    try {
        const geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1`;
        const geoRes = await fetch(geoUrl);
        const geoData = await geoRes.json();

        if (!geoData.results || geoData.results.length === 0) {
            display.innerHTML = "City not found!";
            return;
        }

        const { latitude, longitude, name } = geoData.results[0];

        // Fetching current, hourly, and daily data
        const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m&hourly=temperature_2m&daily=temperature_2m_max,temperature_2m_min&timezone=auto`;
        const weatherRes = await fetch(weatherUrl);
        globalWeatherData = await weatherRes.json();

        options.style.display = "flex";
        
        display.innerHTML = `
            <div style="animation: fadeIn 0.5s ease-out;">
                <h2>${name}</h2>
                <h1 style="font-size: 3.5rem; margin: 10px 0;">${Math.round(globalWeatherData.current.temperature_2m)}°C</h1>
                <p>Select a forecast below</p>
            </div>
        `;

    } catch (error) {
        console.error(error);
        display.innerHTML = "Error loading data. Check console.";
    }
});

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
    let html = '<div class="forecast-list"><h3>7-Day Outlook</h3>';
    for (let i = 0; i < globalWeatherData.daily.time.length; i++) {
        const date = new Date(globalWeatherData.daily.time[i]).toLocaleDateString('en-US', { weekday: 'short', day: 'numeric' });
        const max = globalWeatherData.daily.temperature_2m_max[i];
        html += `<div class="forecast-item"><span>${date}</span> <span>${max}°C</span></div>`;
    }
    display.innerHTML = html + '</div>';
}