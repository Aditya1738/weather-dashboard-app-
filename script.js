// Replace with your actual OpenWeatherMap API key!
const API_KEY = "6db4646156c06faea1c8a80e72ef2fdd";

// DOM Elements
const cityInput = document.getElementById('cityInput');
const searchBtn = document.getElementById('searchBtn');
const currentWeather = document.getElementById('currentWeather');
const forecast = document.getElementById('forecast');

// Event listener for search button
searchBtn.addEventListener('click', () => {
    const city = cityInput.value.trim();
    if (city) {
        getWeather(city);
    }
});

// Fetch weather data
async function getWeather(city) {
    try {
        // Current weather API
        const weatherRes = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
        );
        const weatherData = await weatherRes.json();

        // 5-day forecast API
        const forecastRes = await fetch(
            `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=metric`
        );
        const forecastData = await forecastRes.json();

        if (weatherData.cod !== 200) {
            showError("City not found. Please try again.");
            return;
        }

        renderCurrent(weatherData);
        renderForecast(forecastData);
    } catch (error) {
        showError("Error fetching weather data.");
    }
}
function getEmoji(weatherMain) {
    switch (weatherMain.toLowerCase()) {
        case "clear": return "☀️";
        case "clouds": return "☁️";
        case "rain": return "🌧️";
        case "drizzle": return "🌦️";
        case "thunderstorm": return "⛈️";
        case "snow": return "❄️";
        case "mist":
        case "smoke":
        case "haze":
        case "fog":
        case "dust": return "🌫️";
        default: return "🌈";
    }
}

// Display current weather
function renderCurrent(data) {
    const emoji = getEmoji(data.weather[0].main);
    currentWeather.innerHTML = `
        <h2>${data.name}, ${data.sys.country}</h2>
        <div style="font-size:2.5rem;">${emoji}</div>
        <p><strong>${data.weather[0].main}</strong></p>
        <p>Temperature: ${data.main.temp} °C</p>
        <p>Humidity: ${data.main.humidity}%</p>
        <p>Wind Speed: ${data.wind.speed} m/s</p>
    `;
}




// Display 5-day forecast (one card per day at midday)
function renderForecast(data) {
    forecast.innerHTML = "";
    const days = {};
    data.list.forEach(item => {
        if (item.dt_txt.includes("12:00:00")) {
            const date = item.dt_txt.split(' ')[0];
            days[date] = item;
        }
    });
    Object.keys(days).slice(0, 5).forEach(date => {
        const item = days[date];
        const emoji = getEmoji(item.weather[0].main);
        forecast.innerHTML += `
            <div class="forecast-card">
                <h3>${date}</h3>
                <div style="font-size:2rem;">${emoji}</div>
                <p>${item.weather[0].main}</p>
                <p>Temp: ${item.main.temp} °C</p>
                <p>Humidity: ${item.main.humidity}%</p>
            </div>
        `;
    });
}



// Error message
function showError(message) {
    currentWeather.innerHTML = `<p style="color:red;">${message}</p>`;
    forecast.innerHTML = "";
}
