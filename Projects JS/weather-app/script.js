const cel = document.getElementById("celcius");
const fah = document.getElementById("fahrenheint");
const kel = document.getElementById("kelvin");

let state = 0;
let tempGlobal;

function formuleGrade() {
  if (!tempGlobal) return;

  if (state == 0) return Math.round(tempGlobal - 273.15);
  if (state == 1) return Math.round((tempGlobal- 273.15) * 9/5 + 32);
  if (state == 2) return Math.round(tempGlobal);
};

function tempButtonColors(stateTemp) {
  const allButtons = [cel, fah, kel];
  state = stateTemp;

  function resetColors() {
    allButtons.forEach(btn => btn.style.color = "grey");
  }  

  function updateGrade() {
    const gradeData = document.getElementById("grade");
    if (gradeData == null) return;

    gradeData.textContent = formuleGrade() + "°";
  }

  updateGrade();
  resetColors();
  allButtons[state].style.color = "black";
}

async function fetchWeather() {
  let searchInput = document.getElementById("search").value;
  const weatherDataSection = document.getElementById("weather-data");
  const countryCodeSelection = document.getElementById("country").value;
  const apiKey = "";

  if (searchInput == "") {
    weatherDataSection.innerHTML = `
      <div class="invalid-input">
        <h2>Empty Input!</h2>
        <p>Please try again with a valid <u>city name</u>.</p>
      </div>
    `;
    return;
  }

  async function getLonAndLat() {
    const geocodeURL = `https://api.openweathermap.org/geo/1.0/direct?q=${searchInput.replace(" ", "%20")},${countryCodeSelection}&limit=1&appid=${apiKey}`;
    
    const response = await fetch(geocodeURL);
    if (!response.ok) {
     console.log("Bad response! ", response.status);
     return;
    }

    const data = await response.json();

    if (data.length == 0) {
      console.log("Something went wrong here.");
      weatherDataSection.innerHTML = `
        <div class="invalid-input">
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
    
    tempGlobal = data.main.temp;
    let forumule = formuleGrade();
    
    weatherDataSection.innerHTML = `
        <h2>${data.weather[0].description} <b>in</b> ${data.name}</h2>
        <article id="weather-data-article">
          <img id="image-weather" src="https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png" alt="${data.weather[0].description}"/>
          <h4 id="grade">${forumule}°</h4>

          <div id="wind-humidity">
            <div class="image-data">
              <img class="image-recurs" src="https://raw.githubusercontent.com/Suacht/Projects/main/Projects%20JS/weather-app/wind.png" alt="wind"/>
              <p><b>${Math.round(data.wind.speed * 3.6)}</b>km/h</p>
            </div>

            <div class="image-data">
              <img class="image-recurs" src="https://raw.githubusercontent.com/Suacht/Projects/main/Projects%20JS/weather-app/humidity.png" alt="humidity"/>
              <p><b>${data.main.humidity}</b>%</p>
            </div>
          </div>
        </article>`;
  }

  document.getElementById("search").value = "";
  const geocodeData = await getLonAndLat();
  getWeatherData(geocodeData.lon, geocodeData.lat);

}
