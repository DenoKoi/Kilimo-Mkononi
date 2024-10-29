
const apiKey = 'YOUR_API_KEY'; // Replace with your OpenWeatherMap API key
const city = 'Nairobi'; // Default city, you can get user location dynamically

// Function to fetch weather data
async function fetchWeather() {
    try {
        // Fetch current weather data from OpenWeatherMap API
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`);
        const data = await response.json();

        // Extract relevant weather details
        const weatherCondition = data.weather[0].main; // E.g., "Sunny"
        const temperature = data.main.temp; // Current temperature

        // Dynamically populate a weather forecast card
        const weatherForecastCards = document.getElementById('weatherForecastCards');
        weatherForecastCards.innerHTML = `
            <div class="weather-card">
                <h4>Current Weather</h4>
                <p><strong>Location:</strong> ${city}</p>
                <p><strong>Condition:</strong> ${weatherCondition}</p>
                <p><strong>Temperature:</strong> ${temperature}°C</p>
            </div>
        `;
    } catch (error) {
        console.error('Error fetching weather data:', error);
    }
}

// Call the fetchWeather function on page load
window.onload = fetchWeather;

// You can also call fetchWeather whenever the user selects a different forecast option
document.getElementById('weather').addEventListener('change', function() {
    // Fetch and display weather data based on the selected option if needed
    fetchWeather();
});

