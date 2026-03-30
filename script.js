// Fix 1: Declare the global variable at the top
let globalWeatherData = null; 

const button = document.getElementById('getWeather');

button.addEventListener('click', function() {
    const city = document.getElementById('cityInput').value;
    const display = document.getElementById('weatherDisplay');
    const options = document.getElementById('forecastOptions');
    
    if (!city) return;

    display.innerHTML = '<div class="spinner"></div><p>Searching...</p>';
    options.style.display = "none";

    // Step 1: Geocoding
    fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1`)
    .then(res => {
        if (!res.ok) throw new Error('Geocoding failed');
        return res.json();
    })
    .then(geoData => {
        if (!geoData.results) {
            display.innerHTML = "City not found!";
            return;
        }
        const { latitude, longitude, name } = geoData.results[0];

        // Step 2: Weather Data (Fix 2: Removed forecast_days=31 to prevent 400 error)
        return fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m&hourly=temperature_2m&daily=temperature_2m_max,temperature_2m_min&timezone=auto`);
    })
    .then(res => {
        if (!res.ok) throw new Error('Weather data fetch failed');
        return res.json();
    })
    .then(data => {
        // Fix 3: Optional Chaining to prevent crashes if data is missing
        if (data && data.current) {
            globalWeatherData = data; 
            display.innerHTML = `
                <div style="animation: fadeIn 0.5s ease-out;">
                    <h2>${city}</h2>
                    <h1 style="font-size: 3.5rem; margin: 10px 0;">${Math.round(data.current.temperature_2m)}°C</h1>
                    <p>Humidity: ${data.current.relative_humidity_2m}%</p>
                </div>`;
            options.style.display = "flex";
        }
    })
    .catch(err => {
        console.error("THE ERROR IS:", err);
        display.innerHTML = "Connection failed. Please try again later.";
    });
});

// Helper functions for the buttons
function show24h() {
    if (!globalWeatherData) return;
    const display = document.getElementById('weatherDisplay');
    let html = '<div class="forecast-list"><h3>Next 24 Hours</h3>';
    for (let i = 0; i < 24; i++) {
        const temp = globalWeatherData.hourly.temperature_2m[i];
        const time = new Date(globalWeatherData.hourly.time[i]).getHours() + ":00";
        html += `<div class="forecast-item"><span>${time}</span> <span>${temp}°C</span></div>`;
    }
    display.innerHTML = html + '</div>';
}