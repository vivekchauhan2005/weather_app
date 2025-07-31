const apiKey = "d950bddfda036ea4d0ef31465de02056"; // Replace with your OpenWeatherMap API key

window.onload = () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(position => {
      const lat = position.coords.latitude;
      const lon = position.coords.longitude;
      getWeather(lat, lon);
    });
  }
};

async function getWeather(lat, lon) {
  const weatherURL = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
  const forecastURL = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;

  const weatherRes = await fetch(weatherURL);
  const forecastRes = await fetch(forecastURL);
  const weatherData = await weatherRes.json();
  const forecastData = await forecastRes.json();

  displayCurrentWeather(weatherData);
  displayForecast(forecastData.list.slice(0, 5)); // 5 cards
}

function displayCurrentWeather(data) {
  const container = document.getElementById("currentWeather");
  container.innerHTML = `
    <img src="https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png">
    <h1>${Math.round(data.main.temp)}°</h1>
    <p>${data.weather[0].description}</p>
    <p>📍 ${data.name}</p>
    <p>🔼 ${data.main.temp_max}° 🔽 ${data.main.temp_min}°</p>
  `;
}

function displayForecast(forecasts) {
  const forecastContainer = document.getElementById("hourlyForecast");
  forecastContainer.innerHTML = forecasts.map(f => {
    const hour = new Date(f.dt_txt).getHours();
    return `
      <div class="forecast-card">
        <p>${hour}:00</p>
        <img src="https://openweathermap.org/img/wn/${f.weather[0].icon}.png">
        <p>${Math.round(f.main.temp)}°</p>
      </div>
    `;
  }).join("");
}

async function getWeatherByCity() {
  const city = document.getElementById("cityInput").value;
  if (!city) return alert("Please enter a city");

  const geoURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`;
  const res = await fetch(geoURL);
  const data = await res.json();

  if (data.coord) {
    getWeather(data.coord.lat, data.coord.lon);
  } else {
    alert("City not found");
  }
}
