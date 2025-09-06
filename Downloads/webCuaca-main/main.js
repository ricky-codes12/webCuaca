const apiKey = "b947e9adbfa94bb59b780424250609"; 
const city = document.querySelector(".city").textContent;

function isNight(hour) {
  return hour >= 18 || hour < 6;
}

function getWeatherByCity(city) {
  // pakai forecast biar bisa akses forecast + current
  const URL = `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${city}&days=3`;   

  fetch(URL)
    .then(response => response.json())
    .then(result => {
      // Data dari API
      const location = result.location;
      const current = result.current;
      const forecast = result.forecast;

      // Ambil jam lokal
      const localHour = new Date(location.localtime).getHours();
      const nightMode = isNight(localHour);

      // Elemen dari HTML
      const body  = document.body;
      const card = document.querySelector(".weather-card");
      const sun = document.querySelector(".sun");
      const moon = document.querySelector(".moon");

      if (nightMode) {
        body.setAttribute("data-mode", "night");
        card.setAttribute("data-mode", "night");
        sun.style.display = "none";
        moon.style.display = "block";
      } else {
        body.setAttribute("data-mode", "day");
        card.setAttribute("data-mode", "day");
        sun.style.display = "block";
        moon.style.display = "none";
      }

      // Update cuaca ke UI
      document.querySelector(".date").textContent = location.localtime;
      document.querySelector(".temperature").textContent = current.temp_c + "°C";
      document.querySelector(".humidity").textContent = "Humidity: " + current.humidity + "%";
      document.querySelector(".wind").textContent = "Wind: " + current.wind_kph + " kph";
      document.querySelector(".weather-icon").innerHTML =
        `<img src="${current.condition.icon}" alt="${current.condition.text}">`;

      // Tampilkan forecast (3 hari)
      const forecastDiv = document.querySelector("#forecast");
      forecastDiv.innerHTML = ""; // clear dulu
      forecast.forecastday.forEach(day => {
        forecastDiv.innerHTML += `
          <div class="forecast-item">
            <p>${day.date}</p>
            <img src="${day.day.condition.icon}" alt="${day.day.condition.text}">
            <p>${day.day.avgtemp_c}°C</p>
          </div>
        `;
      });
    })
    .catch(err => {
      console.error(err);
    });
}

window.onload = () => {
  getWeatherByCity(city);
}
