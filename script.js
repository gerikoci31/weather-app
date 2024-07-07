const apiKey = 'd60780aafffc0c28845ece16af79ecdb'; 
const apiUrl = 'https://api.openweathermap.org/data/2.5/';

// DOM Elements
const searchForm = document.getElementById('search-form');
const cityInput = document.getElementById('city-input');
const searchHistory = document.getElementById('search-history');
const currentWeatherEl = document.getElementById('current-weather');
const forecastEl = document.getElementById('forecast');

// Event listener for form submission
searchForm.addEventListener('submit', function(event) {
    event.preventDefault();
    const cityName = cityInput.value.trim();
    if (cityName) {
        getWeather(cityName);
        cityInput.value = '';
    }
});

// Function to fetch weather data
async function getWeather(city) {
    try {
        const response = await fetch(`${apiUrl}weather?q=${city}&appid=${apiKey}&units=metric`);
        if (!response.ok) {
            throw new Error('City not found');
        }
        const weatherData = await response.json();
        displayWeather(weatherData);
        saveToLocalStorage(city);
    } catch (error) {
        console.error('Error fetching weather:', error);
    }
}

// Function to display current weather
function displayWeather(data) {
    // Clear previous content
    currentWeatherEl.innerHTML = '';

    // Create elements to display current weather
    const cityName = document.createElement('h2');
    cityName.textContent = data.name;

    const date = document.createElement('p');
    date.textContent = new Date().toLocaleDateString();

    const icon = document.createElement('img');
    icon.src = `https://openweathermap.org/img/wn/${data.weather[0].icon}.png`;
    icon.alt = data.weather[0].description;

    const temperature = document.createElement('p');
    temperature.textContent = `Temperature: ${data.main.temp} °C`;

    const humidity = document.createElement('p');
    humidity.textContent = `Humidity: ${data.main.humidity}%`;

    const windSpeed = document.createElement('p');
    windSpeed.textContent = `Wind Speed: ${data.wind.speed} m/s`;

    // Append elements to current weather section
    currentWeatherEl.appendChild(cityName);
    currentWeatherEl.appendChild(date);
    currentWeatherEl.appendChild(icon);
    currentWeatherEl.appendChild(temperature);
    currentWeatherEl.appendChild(humidity);
    currentWeatherEl.appendChild(windSpeed);
}

// Function to save searched city to localStorage
function saveToLocalStorage(city) {
    let searchHistoryArray = JSON.parse(localStorage.getItem('searchHistory')) || [];
    if (!searchHistoryArray.includes(city)) {
        searchHistoryArray.push(city);
        localStorage.setItem('searchHistory', JSON.stringify(searchHistoryArray));
        displaySearchHistory();
    }
}

// Function to display search history
function displaySearchHistory() {
    searchHistory.innerHTML = '';
    const searchHistoryArray = JSON.parse(localStorage.getItem('searchHistory')) || [];
    searchHistoryArray.forEach(city => {
        const historyItem = document.createElement('button');
        historyItem.textContent = city;
        historyItem.addEventListener('click', () => getWeather(city));
        searchHistory.appendChild(historyItem);
    });
}

// Initial setup on page load
displaySearchHistory();