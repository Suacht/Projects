async function weatherApp() {
    const grade = document.getElementById("weather-grade");
    const image = document.getElementById("weather-image-src");
    const text = document.getElementById("weather-text");
    const apiKey = "1bf9a1208e548305ee68695ead1dca4c";
    /*const city = "Tonala";

    async function getLatAndLon() {
        const geocodeURL = `https://api.openweathermap.org/geo/1.0/direct?q=${city},52&limit=1&appid=${apiKey}`;
        
        const response = await fetch(geocodeURL);
        if (!response.ok) return;

        const data = await response.json();
        if (data.lenght !== 0) return data[0];
    }*/

    async function getLatAndLon() {
      return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(
          (pos) => {
            resolve({lat: pos.coords.latitude, lon: pos.coords.longitude});
          },
          (err) => reject(err)
        );
      });
    }

    async function getWeatherData(lat, lon) {
        const weatherURL = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}`;

        const response = await fetch(weatherURL);
        if (!response.ok) return;

        const data = await response.json();

        let celcius = Math.round(data.main.temp - 273.15);
        grade.textContent = `${celcius} °C`;
        text.textContent = `${data.weather[0].description} in ${data.name}`;
        image.src = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
    }

    const geoData = await getLatAndLon();
    getWeatherData(geoData.lat, geoData.lon);
}

//weatherApp();