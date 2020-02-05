const appId = "0f94af7cedc0069968b5892d9d0c8b55";
const units = "metric"; // other option is metric
let searchMethod; // q means searching as a string.

const getSearchMethod = searchTerm => {
  if (
    searchTerm.length === 5 &&
    parseInt(searchTerm, 10).toString() === searchTerm
  ) {
    searchMethod = "zip";
  } else {
    searchMethod = "q";
  }
};

const searchWeather = async searchTerm => {
  getSearchMethod(searchTerm);
  const result = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?${searchMethod}=${searchTerm}&APPID=${appId}&units=${units}`
  );
  const json = result.json();
  init(await json);
};

const init = resultFromServer => {
  if (
    !resultFromServer ||
    !Array.isArray(resultFromServer.weather) ||
    !resultFromServer.weather.length
  ) {
    return;
  }

  let backgroundImageUrl = "";
  switch (resultFromServer.weather[0].main.toLowerCase()) {
    case "clear":
      backgroundImageUrl = "url('clear.jpg')";
      break;

    case "clouds":
      backgroundImageUrl = "url('cloudy.jpg')";
      break;

    case "rain":
    case "drizzle":
    case "mist":
      backgroundImageUrl = "url('rain.jpg')";
      break;

    case "thunderstorm":
      backgroundImageUrl = "url('storm.jpg')";
      break;

    case "snow":
      backgroundImageUrl = "url('snow.jpg')";
      break;

    default:
      break;
  }
  document.body.style.backgroundImage = backgroundImageUrl;

  const weatherDescriptionHeader = document.getElementById(
    "weatherDescriptionHeader"
  );
  const temperatureElement = document.getElementById("temperature");
  const humidityElement = document.getElementById("humidity");
  const windSpeedElement = document.getElementById("windSpeed");
  const cityHeader = document.getElementById("cityHeader");

  const weatherIcon = document.getElementById("documentIconImg");
  weatherIcon.src = `http://openweathermap.org/img/w/${resultFromServer.weather[0].icon}.png`;

  const resultDescription = resultFromServer.weather[0].description;
  weatherDescriptionHeader.innerText =
    resultDescription.charAt(0).toUpperCase() + resultDescription.slice(1);
  temperatureElement.innerHTML =
    Math.floor(resultFromServer.main.temp) + "&#176;";
  windSpeedElement.innerHTML =
    "Winds at  " + Math.floor(resultFromServer.wind.speed) + " m/s";
  cityHeader.innerHTML = resultFromServer.name;
  humidityElement.innerHTML =
    "Humidity levels at " + resultFromServer.main.humidity + "%";

  setPositionForWeatherInfo();
};

const setPositionForWeatherInfo = () => {
  const weatherContainer = document.getElementById("weatherContainer");
  const weatherContainerHeight = weatherContainer.clientHeight;
  const weatherContainerWidth = weatherContainer.clientWidth;

  weatherContainer.style.left = `calc(50% - ${weatherContainerWidth / 2}px)`;
  weatherContainer.style.top = `calc(50% - ${weatherContainerHeight / 1.3}px)`;
  weatherContainer.style.visibility = "visible";
};

document.getElementById("searchBtn").addEventListener("click", () => {
  const searchTerm = document.getElementById("searchInput").value;
  if (searchTerm) searchWeather(searchTerm);
});
