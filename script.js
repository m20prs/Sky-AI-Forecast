// Step 2: Update the fetch URL to include forecast_days=16
const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m&hourly=temperature_2m&daily=temperature_2m_max,temperature_2m_min&forecast_days=16&timezone=auto`;

// ... keep your existing button logic ...

function show30d() {
    if (!globalWeatherData) return;
    const display = document.getElementById('weatherDisplay');
    
    // Changed title to "Extended Outlook" since it's 16 days
    let html = '<div class="forecast-list"><h3>16-Day Extended Outlook</h3>';
    
    // The loop will now automatically adjust to the 16 days we fetched
    for (let i = 0; i < globalWeatherData.daily.time.length; i++) {
        const date = new Date(globalWeatherData.daily.time[i]).toLocaleDateString('en-US', { 
            month: 'short', 
            day: 'numeric',
            weekday: 'short' 
        });
        const max = globalWeatherData.daily.temperature_2m_max[i];
        const min = globalWeatherData.daily.temperature_2m_min[i];
        
        html += `
            <div class="forecast-item">
                <span>${date}</span> 
                <span><strong>${Math.round(max)}°</strong> / ${Math.round(min)}°</span>
            </div>`;
    }
    display.innerHTML = html + '</div>';
}