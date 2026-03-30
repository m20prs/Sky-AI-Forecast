let globalWeatherData = null; // Important: This stores the data for the buttons to use

button.addEventListener('click', async () => {
    const city = document.getElementById('cityInput').value;
    const display = document.getElementById('weatherDisplay');
    const options = document.getElementById('forecastOptions');
    
    display.innerHTML = `<div class="spinner"></div>`;

    try {
        const geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${city}&count=1`;
        const geoRes = await fetch(geoUrl);
        const geoData = await geoRes.json();

        if (!geoData.results) {
            display.innerHTML = "City not found!";
            return;
        }

        const { latitude, longitude, name } = geoData.results[0];

        // FETCH ALL DATA AT ONCE
        const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m&hourly=temperature_2m&daily=temperature_2m_max,temperature_2m_min&timezone=auto`;
        const weatherRes = await fetch(weatherUrl);
        globalWeatherData = await weatherRes.json();

        options.style.display = "flex"; // Show the 24h/30d buttons
        
        display.innerHTML = `
            <h2>${name}</h2>
            <h1>${Math.round(globalWeatherData.current.temperature_2m)}°C</h1>
            <p>Select a forecast below</p>
        `;

    } catch (error) {
        display.innerHTML = "Error loading data.";
    }
});

function show24h() {
    const display = document.getElementById('weatherDisplay');
    let html = '<div class="forecast-list"><h3>Next 24 Hours</h3>';
    // Loops through the first 24 hours of data
    for (let i = 0; i < 24; i++) {
        const time = new Date(globalWeatherData.hourly.time[i]).getHours() + ":00";
        const temp = globalWeatherData.hourly.temperature_2m[i];
        html += `<div class="forecast-item"><span>${time}</span> <span>${temp}°C</span></div>`;
    }
    display.innerHTML = html + '</div>';
}

function show30d() {
    const display = document.getElementById('weatherDisplay');
    let html = '<div class="forecast-list"><h3>7-Day Outlook</h3>';
    // Open-Meteo provides 7 days by default; looping through them here
    for (let i = 0; i < globalWeatherData.daily.time.length; i++) {
        const date = new Date(globalWeatherData.daily.time[i]).toLocaleDateString('en-US', { weekday: 'short', day: 'numeric' });
        const max = globalWeatherData.daily.temperature_2m_max[i];
        html += `<div class="forecast-item"><span>${date}</span> <span>${max}°C</span></div>`;
    }
    display.innerHTML = html + '</div>';
}