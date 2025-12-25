const API_KEY = 'f3ed4f7c2f0d0c1499e43c1df5c63392';

const cityInput = document.getElementById('city-input');
const searchBtn = document.getElementById('search-btn');
const loading = document.getElementById('loading');
const weatherInfo = document.getElementById('weather-info');
const errorEl = document.getElementById('error');

const cityName = document.getElementById('city-name');
const temperature = document.getElementById('temperature');
const weatherIcon = document.getElementById('weather-icon');
const description = document.getElementById('description');
const humidity = document.getElementById('humidity');
const wind = document.getElementById('wind');

// Smooth background transition setup
document.body.style.transition = "background 1s ease-in-out";

// Fetch weather data
async function getWeather(city) {
  if (!city) {
    showError('Please enter a city name');
    return;
  }

  showLoading();

  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
    );

    if (!response.ok) {
      throw new Error('City not found');
    }

    const data = await response.json();

    // Update background based on weather
    updateBackground(data.weather[0].main);

    // Update UI
    cityName.textContent = `${data.name}, ${data.sys.country}`;
    temperature.textContent = Math.round(data.main.temp) + '°C';
    description.textContent = data.weather[0].description;
    humidity.textContent = data.main.humidity + '%';
    wind.textContent = data.wind.speed + ' m/s';

    const iconCode = data.weather[0].icon;
    weatherIcon.src = `https://openweathermap.org/img/wn/${iconCode}@4x.png`;

    weatherInfo.style.display = 'block';
    errorEl.textContent = '';
  } catch (err) {
    showError(err.message);
    weatherInfo.style.display = 'none';
    document.body.style.background = "linear-gradient(135deg, #74b9ff, #0984e3)"; // Reset on error
  } finally {
    hideLoading();
  }
}

// Show loading spinner
function showLoading() {
  loading.style.display = 'block';
  weatherInfo.style.display = 'none';
}

// Hide loading spinner
function hideLoading() {
  loading.style.display = 'none';
}

// Show error message
function showError(msg) {
  errorEl.textContent = msg;
}

// Update background dynamically
function updateBackground(weatherMain) {
  switch(weatherMain.toLowerCase()) {
    case 'clear':
      document.body.style.background = "linear-gradient(135deg, #f6d365, #fda085)"; // sunny
      break;
    case 'clouds':
      document.body.style.background = "linear-gradient(135deg, #d7d2cc, #304352)"; // cloudy
      break;
    case 'rain':
    case 'drizzle':
      document.body.style.background = "linear-gradient(135deg, #4e54c8, #8f94fb)"; // rainy
      break;
    case 'snow':
      document.body.style.background = "linear-gradient(135deg, #e0eafc, #cfdef3)"; // snowy
      break;
    case 'thunderstorm':
      document.body.style.background = "linear-gradient(135deg, #232526, #414345)"; // stormy
      break;
    default:
      document.body.style.background = "linear-gradient(135deg, #f6d365, #fda085)"; // fallback sunny
  }
}

// Event listeners
searchBtn.addEventListener('click', () => {
  getWeather(cityInput.value.trim());
});

cityInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    getWeather(cityInput.value.trim());
  }
});

// Load default city on start
getWeather('Lagos');
