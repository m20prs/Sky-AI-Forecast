const button = document.getElementById('getWeather');

button.addEventListener('click', function() {
    const city = document.getElementById('cityInput').value;
    const display = document.getElementById('weatherDisplay');
    
    display.innerHTML = "Searching...";

    // Step 1: Get Lat/Lon
    fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${city}&count=1`)
    .then(res => res.json())
    .then(geoData => {
        if (!geoData.results) {
            display.innerHTML = "City not found!";
            return;
        }
        const { latitude, longitude, name } = geoData.results[0];

        // Step 2: Get Weather
        return fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m&hourly=temperature_2m&daily=temperature_2m_max&forecast_days=31&timezone=auto`);
    })
    .then(res => res.json())
    .then(data => {
        globalWeatherData = data; // Save for the charts/forecasts
        display.innerHTML = `<h2>${city}</h2><h1>${Math.round(data.current.temperature_2m)}°C</h1>`;
        document.getElementById('forecastOptions').style.display = "flex";
    })
    .catch(err => {
        console.log("THE ERROR IS:", err);
        display.innerHTML = "Failed. Check Console for 'THE ERROR IS'.";
    });
});