async function fetchWeather() {
  let searchInput = document.getElementById("search").value;
  const weatherDataSection = document.getElementById("weather-data");
  weatherDataSection.style.display = "block";
  const apiKey = ""; 

  if (searchInput == "") {
  weatherDataSection.innerHTML = `
  <div>
    <h2>Empty Input!</h2>
    <p>Please try again with a valid <u>city name</u>.</p>
  </div>
  `;
  return;
  }

  async function getLonAndLat() {
    const countryCode = 1;
    const geocodeURL = `https://api.openweathermap.org/geo/1.0/direct?q=${searchInput.replace(" ", "%20")},${countryCode}&limit=1&appid=${apiKey}`;
    
    const response = await fetch(geocodeURL);
    if (!response.ok) {
     console.log("Bad response! ", response.status);
     return;
    }

    const data = await response.json();

    if (data.length == 0) {
      console.log("Something went wrong here.");
      weatherDataSection.innerHTML = `
      <div>
        <h2>Invalid Input: "${searchInput}"</h2>
        <p>Please try again with a valid <u>city name</u>.</p>
      </div>
      `;
      return;
    } else {
      return data[0];
    }
  }

  async function getWeatherData(lon, lat) {
    const weatherURL = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}`;

    const response = await fetch(weatherURL);
    if (!response.ok) {
      console.log("Bad response! ", response.status);
      return;
    }

    const data = await response.json();
    weatherDataSection.style.display = "flex";
    weatherDataSection.innerHTML = `
        <h2>${data.name}</h2>
        <article>
          <img src="https://openweathermap.org/img/wn/${data.weather[0].icon}.png" alt="${data.weather[0].description}" width="400" />
          <h4>${Math.round(data.main.temp - 273.15)}°</h4>

          <div id="wind-humidity">
            <div class="image-data">
              <img src="https://raw.githubusercontent.com/Suacht/Projects/main/Projects%20JS/weather-app/wind.png" alt="wind" width="40" />
              <p><b>${Math.round(data.wind.speed * 3.6)}</b>km/h</p>
            </div>

            <div class="image-data">
              <img src="https://raw.githubusercontent.com/Suacht/Projects/main/Projects%20JS/weather-app/humidity.png" alt="humidity" width="40" />
              <p><b>${data.main.humidity}</b>%</p>
            </div>
          </div>
        </article>`
  }

  document.getElementById("search").value = "";
  const geocodeData = await getLonAndLat();
  getWeatherData(geocodeData.lon, geocodeData.lat);
}