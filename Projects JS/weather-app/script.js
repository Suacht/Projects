let state = 0;

function formuleGrade(gradeK) {
  let forumule = 0;
  if (state == 0) {
    forumule = Math.round(gradeK - 273.15);
  } else if (state == 1) {
    forumule = Math.round((gradeK - 273.15) * 9/5 + 32);
  } else if (state == 2) {
    forumule = Math.round(gradeK);
  }

  return forumule;
};

function setupTempButtons(data) {
  const cel = document.getElementById("celcius");
  const fah = document.getElementById("fahrenheint");
  const kel = document.getElementById("kelvin");

  const allButtons = [cel, fah, kel];

  function resetColors() {
    allButtons.forEach(btn => btn.style.color = "grey");
  }

  function updateGrade() {
    const gradeData = document.getElementById("grade");
    let formule = formuleGrade(data.main.temp);

    gradeData.textContent = formule + "°";
  }

  cel.addEventListener("click", (e) => {
    state = 0;
    updateGrade();
    resetColors();
    e.target.style.color = "black";
  });

  fah.addEventListener("click", (e) => {
    state = 1;
    updateGrade(data.main.temp);
    resetColors();
    e.target.style.color = "black";
  });

  kel.addEventListener("click", (e) => {
    state = 2;
    updateGrade(data.main.temp);
    resetColors();
    e.target.style.color = "black";
  });

  resetColors();
  allButtons[state].style.color = "black";
}

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
    
    let forumule = formuleGrade(data.main.temp);

    weatherDataSection.style.display = "flex";
    weatherDataSection.innerHTML = `
        <h2>${data.weather[0].description} <b>in</b> ${data.name}</h2>
        <article id="weather-data-article">
          <img src="https://openweathermap.org/img/wn/${data.weather[0].icon}.png" alt="${data.weather[0].description}" width="250" />
          <h4 id="grade">${forumule}°</h4>

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
        </article>
        
        <article id="buttons">
          <button id="celcius"> C° </button>
          <b>|</b>
          <button id="fahrenheint"> F° </button>
          <b>|</b>
          <button id="kelvin"> K° </button>
        </article>`

        setupTempButtons(data);
  }

  document.getElementById("search").value = "";
  const geocodeData = await getLonAndLat();
  getWeatherData(geocodeData.lon, geocodeData.lat);

}
