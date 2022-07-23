let tempInCelsius;
let weather;
let city = document.querySelector("#city");
let searchedCity = document.querySelector("#searchedCity");
let humidity = document.querySelector("#humidity");
let wind = document.querySelector("#wind");
let temperature = document.querySelector("#temperature");
let icon = document.querySelector("#icon");
let celsius = document.querySelector("#celsius");
let fahrenheit = document.querySelector("#fahrenheit");
let atmosphere = document.querySelector("#atmosphere");
let weeklyForecast = document.querySelector("#weekly-forecast");
let msg = document.querySelector("#msg");
let date = document.querySelector("#date");
let form = document.querySelector("#search");
let button = document.querySelector("#location");
let apiKey = "d37ed2899e060781baede29f71370db4";

function displayWeeklyForecast(response) {
  let a = [];
  let midnight = response.data.list.findIndex((element) =>
    element.dt_txt.includes("00:00:00")
  );
  let noon = midnight + 4;
  for (let i = noon; i < response.data.list.length; i += 8) {
    a.push(response.data.list[i]);
  }

  a.forEach((day, index) => {
    let date = formatDate(day.dt);
    let forecastHTML = `
      <div class="col">
      <div class="weather-forecast-date">${date.day}</div>
      <img
        src="https://openweathermap.org/img/wn/${day.weather[0].icon}.png"
        alt=""
        width="42"
      />
      <div class="weather-forecast-temperatures">
        <span class="weather-forecast-temperature-max">${Math.round(
          day.main.temp_max
        )}°</span
        ><span class="weather-forecast-temperature-min">${Math.round(
          day.main.temp_min
        )}°</span>
      </div>
      `;
    weeklyForecast.innerHTML += forecastHTML;
  });
}

function formatDate(timestamp) {
  let week = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  let date = new Date(timestamp * 1000);
  let hours = date.getHours();
  hours < 10 ? `0${hours}` : hours;
  let minutes = date.getMinutes();
  minutes < 10 ? `0${minutes}` : minutes;
  let day = week[date.getDay()];
  return {
    hours: hours,
    minutes: minutes,
    day: day,
  };
}

function toFahrenheit(degree) {
  fahrenheit.classList.add("active");
  celsius.classList.remove("active");
  degree = parseInt(degree, 10);
  return Math.floor((degree * 9) / 5 + 32).toString();
}

function layout(response) {
  city.innerHTML = response.data.name;
  humidity.innerHTML = response.data.main.humidity;
  wind.innerHTML = Math.round(response.data.wind.speed);
  temperature.innerHTML = Math.round(response.data.main.temp);
  tempInCelsius = Math.round(response.data.main.temp);
  atmosphere.innerHTML = response.data.weather[0].description;
  let formattedDate = formatDate(response.data.dt);
  date.innerHTML = `Updated: ${formattedDate.day} ${formattedDate.hours}:${formattedDate.minutes}`;
  icon.setAttribute(
    "src",
    `https://openweathermap.org/img/wn/${response.data.weather[0].icon}.png`
  );
  icon.setAttribute("alt", response.data.weather[0].description);
}

function searchLocation() {
  navigator.geolocation.getCurrentPosition((position) => {
    let latitude = position.coords.latitude;
    let longitude = position.coords.longitude;
    let urlLocation = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`;
    let fiveDayCallUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`;

    Promise.all([axios.get(urlLocation), axios.get(fiveDayCallUrl)]).then(
      (results) => {
        const mainLocation = results[0];
        const forecastLocation = results[1];
        layout(mainLocation);
        displayWeeklyForecast(forecastLocation);
      }
    );
    // axios.get(urlLocation).then((response) => {
    //   layout(response);
    // });
  });
}

function search(cityInput) {
  let url = `https://api.openweathermap.org/data/2.5/weather?q=${cityInput}&appid=${apiKey}&units=metric`;
  axios
    .get(url)
    .then((response) => {
      layout(response);
      let fiveDayCallUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${response.data.coord.lat}&lon=${response.data.coord.lon}&appid=${apiKey}&units=metric`;
      axios
        .get(fiveDayCallUrl)
        .then((response) => {
          displayWeeklyForecast(response);
        })
        .catch((error) => console.log(error));
    })
    .catch((error) => {
      console.log(error);
    });
}

celsius.addEventListener("click", (event) => {
  event.preventDefault();
  fahrenheit.classList.remove("active");
  celsius.classList.add("active");
  temperature.innerHTML = tempInCelsius;
});

fahrenheit.addEventListener("click", (event) => {
  event.preventDefault();
  temperature.innerHTML = toFahrenheit(tempInCelsius);
});

form.addEventListener("submit", (event) => {
  event.preventDefault();
  searchedCity = document.querySelector("#searchedCity").value;
  search(searchedCity);
  form.reset();
  weeklyForecast.innerHTML = "";
});

button.addEventListener("click", (event) => {
  event.preventDefault();
  searchLocation();
  weeklyForecast.innerHTML = "";
});

search("Paris");
