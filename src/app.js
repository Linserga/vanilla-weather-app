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
let msg = document.querySelector("#msg");
let date = document.querySelector("#date");
let form = document.querySelector("#search");
let button = document.querySelector("#location");
let apiKey = "d37ed2899e060781baede29f71370db4";

function formatDate(timestamp) {
  let week = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  let date = new Date(timestamp * 1000);
  let hours = date.getHours();
  hours < 10 ? `0${hours}` : hours;
  let minutes = date.getMinutes();
  minutes < 10 ? `0${minutes}` : minutes;
  let day = week[date.getDay()];
  return `Updated: ${day} ${hours}:${minutes}`;
}

function toFahrenheit(degree) {
  fahrenheit.classList.add("active");
  celsius.classList.remove("active");
  degree = parseInt(degree, 10);
  return Math.floor((degree * 9) / 5 + 32).toString();
}

function layout(response) {
  weather = response.data;
  city.innerHTML = weather.name;
  humidity.innerHTML = weather.main.humidity;
  wind.innerHTML = Math.round(weather.wind.speed);
  temperature.innerHTML = Math.round(weather.main.temp);
  tempInCelsius = Math.round(weather.main.temp);
  atmosphere.innerHTML = weather.weather[0].description;
  date.innerHTML = formatDate(weather.dt);
  icon.setAttribute(
    "src",
    `https://openweathermap.org/img/wn/${weather.weather[0].icon}.png`
  );
  icon.setAttribute("alt", weather.weather[0].description);
}

function searchLocation() {
  navigator.geolocation.getCurrentPosition((position) => {
    let latitude = position.coords.latitude;
    let longitude = position.coords.longitude;
    let urlLocation = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`;
    axios.get(urlLocation).then((response) => {
      layout(response);
    });
  });
}

function search(cityInput) {
  let url = `https://api.openweathermap.org/data/2.5/weather?q=${cityInput}&appid=${apiKey}&units=metric`;
  axios
    .get(url)
    .then((response) => {
      layout(response);
    })
    .catch((error) => {
      //msg.innerHTML = "We couldn't find this city. Try again";
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
});

button.addEventListener("click", (event) => {
  event.preventDefault();
  searchLocation();
});

search("Paris");
