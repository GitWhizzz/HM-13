const API_KEY = 'cad1ef45d69fcd22b4d89cc5d55de164';
const BASE_URL = 'https://api.openweathermap.org/data/2.5/';

async function getLatLon(cityName) {
    const url = `${BASE_URL}weather?q=${cityName}&appid=${API_KEY}`;
    try {
        const response = await fetch(url);
        const data = await response.json();
        if (data.cod !== 200) {
            throw new Error(data.message);
        }
        return {
            lat: data.coord.lat,
            lon: data.coord.lon
        };
    } catch (error) {
        console.error("Error fetching lat/lon data:", error);
        return null;
    }
}

async function getWeatherData(lat, lon) {
    const url = `${BASE_URL}weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`;
    try {
        const response = await fetch(url);
        const data = await response.json();
        if (data.cod !== 200) {
            throw new Error(data.message);
        }
        return {
            temp: data.main.temp,
            feels_like: data.main.feels_like,
            humidity: data.main.humidity,
            wind_speed: data.wind.speed,
            weather: data.weather,
            cityName: data.name
        };
    } catch (error) {
        console.error("Error fetching weather data:", error);
        return null;
    }
}

async function fetchWeatherForCity(cityName) {
    const coords = await getLatLon(cityName);
    if (coords && coords.lat && coords.lon) {
        const weatherData = await getWeatherData(coords.lat, coords.lon);
        displayWeatherData(weatherData);
    } else {
        displayError("Invalid city name or data not found");
    }
}


function displayWeatherData(weatherData) {
    if (weatherData) {
        document.querySelector('.temp').textContent = `${Math.round(weatherData.temp)}°C`;
        document.querySelector('.feels_like').textContent = `${Math.round(weatherData.feels_like)}°C`;
        document.querySelector('.city').textContent = `${weatherData.cityName}`;
        document.querySelector('.humidity').textContent = `${weatherData.humidity}%`;
        document.querySelector('.wind').textContent = `${weatherData.wind_speed} km/h`;

        const iconSrc = `images/${weatherData.weather[0].main.toLowerCase()}.png`;
        document.querySelector('.weather-icon').setAttribute('src', iconSrc);
        document.querySelector('.weather-icon').setAttribute('alt', weatherData.weather[0].main);

        document.querySelector('.error-message').style.display = 'none';
        document.querySelector(".weather").style.display = "block";
    } else {
        displayError("Weather data not available. Please try again.");
    }
}

function displayError(message) {
    const errorMessageDiv = document.querySelector('.error-message');
    errorMessageDiv.style.display = 'block';
    errorMessageDiv.textContent = message;
}

document.querySelector('.search button').addEventListener('click', () => {
    const city = document.querySelector('.search input').value;
    fetchWeatherForCity(city);
});

document.querySelector('.search input').addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
        const city = document.querySelector('.search input').value;
        fetchWeatherForCity(city);
    }
});