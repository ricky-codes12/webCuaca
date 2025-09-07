const apiKey = "f8fd5b0e7297496c84c75929250609"; 

function isNight(hour) {
  return hour >= 18 || hour < 6;
}

// fungsi untuk pilih emoji sesuai kondisi cuaca
function getIconEmoji(code, nightMode) {
  if (code === 1000) return nightMode ? "🌙" : "☀️"; // clear
  if (code === 1003) return nightMode ? "☁️" : "⛅"; // partly cloudy
  if (code >= 1180 && code <= 1201) return "🌧️"; // rain
  if (code >= 1210 && code <= 1225) return "❄️"; // snow
  return "🌡️"; // default
}

function getWeatherByCity(city) {
  const URL = `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${city}&days=3`;   

  fetch(URL)
    .then(res => res.json())
    .then(data => {
      const current = data.current;
      const forecast = data.forecast.forecastday;
      const location = data.location.name;

      const date = new Date().toLocaleDateString("id-ID", {
        weekday: "long",
        day: "numeric",
        month: "long",
      });

      const localHour = new Date(data.location.localtime).getHours();
      const nightMode = isNight(localHour);

      // ambil emoji cuaca saat ini
      const emoji = getIconEmoji(current.condition.code, nightMode);

      const body = document.body;
      if (nightMode) {
        body.classList.remove("day");
        body.classList.add("night");
      } else {
        body.classList.remove("night");
        body.classList.add("day");
      }

      document.querySelector(".city").textContent = location;
      document.querySelector(".date").textContent = date;
      document.querySelector(".details-top").innerHTML = `
        <div class="humidity">💧 ${current.humidity}%</div>
        <div class="wind">💨 ${current.wind_kph} km/h</div>
      `;
      document.querySelector(".weather-icon").textContent = emoji;
      document.querySelector(".temperature").textContent = `${current.temp_c}°C`;

      showForecast(forecast.slice(1, 3), nightMode);
    })
    .catch((err) => {
      document.querySelector(".city").textContent = "Gagal memuat data";
      console.error(err);
    });
}

function showForecast(forecastDays, nightMode) {
  const html = forecastDays
    .map((day) => {
      const emoji = getIconEmoji(day.day.condition.code, nightMode);
      const label = new Date(day.date).toLocaleDateString("id-ID", {
        weekday: "long",
        day: "numeric",
        month: "long",
      });

      return `
        <div class="forecast-item">
          <div class="weather-day">${label.split(",")[0]}</div>
          <div class="weather-icon">${emoji}</div>
          <div class="temperature-card">${day.day.avgtemp_c}°C</div>
        </div>
      `;
    })
    .join("");

  document.getElementById("forecast").innerHTML = `<div class="forecast-grid">${html}</div>`;
}

document.addEventListener("DOMContentLoaded", () => {
  getWeatherByCity("Jakarta");
});
