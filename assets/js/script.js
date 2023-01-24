 // Global variables
var cityList = [];
var cityname;

// local storage functions
initCityList();
initWeather();

// This function displays the city entered by the user into the DOM
function renderCities(){
    $("#list-of-cities").empty();
    $("#city-name").val("");
    
    for (i=0; i<cityList.length; i++){
        var a = $("<a>");
        a.addClass("list-group-item list-group-item-action list-group-item-primary city");
        a.attr("data-name", cityList[i]);
        a.text(cityList[i]);
        $("#list-of-cities").prepend(a);
    } 
}
// This function pulls the city list array from local storage
function initCityList() {
    var storedCities = JSON.parse(localStorage.getItem("cities"));
    
    if (storedCities !== null) {
        cityList = storedCities;
    }
    
    renderCities();
    }
// This function pull the current city into local storage to display the current weather forecast on reload
function initWeather() {
    var storedWeather = JSON.parse(localStorage.getItem("currentCity"));

    if (storedWeather !== null) {
        cityname = storedWeather;

        displayWeather();
        displayFiveDayForecast();
    }
}

// This function saves the city array to local storage
function storeCityArray() {
    localStorage.setItem("cities", JSON.stringify(cityList));
    }

// This function saves the currently displayed city to local storage
function storeCurrentCity() {

    localStorage.setItem("currentCity", JSON.stringify(cityname));
}
      
// Click event handler for city search button
$(".search-btn").on("click", function(event){
    event.preventDefault();

    cityname = $("#city-name").val().trim();
    if(cityname === ""){
        alert("Please enter a city to look up")

    }else if (cityList.length >= 6){  
        cityList.shift();
        cityList.push(cityname);

    }else{
    cityList.push(cityname);
    }
    storeCurrentCity();
    storeCityArray();
    renderCities();
    displayWeather();
    displayFiveDayForecast();
});

// Event handler if the user hits enter after entering the city search term instead of clicking search
$("#city-name").keypress(function(e){
    if(e.which == 13){
        $(".search-btn").click();
    }
})

// This function runs the Open Weather async API AJAX call and displays the current city, weather, and 5 day forecast to the DOM once requested
async function displayWeather() {

    var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + cityname + "&units=imperial&appid=5b4735245dfd66f5f4d0cf9ad8b7706a";

    var response = await $.ajax({
        url: queryURL,
        method: "GET"
      })
        console.log(response);
    
                
        var currentWeatherDiv = $("<section class='city-data'>");
        currentWeatherDiv.addClass("current-weather")
        var getCurrentCity = response.name;
        var val=dayjs().format('MM/DD/YYYY');
        var getCurrentWeatherIcon = response.weather[0].icon;
        var displayCurrentWeatherIcon = $("<img src = http://openweathermap.org/img/wn/" + getCurrentWeatherIcon + "@2x.png />");
        var currentCityEl = $("<h4 class = 'card-body'>").text(getCurrentCity+" ("+val+")");
        currentCityEl.append(displayCurrentWeatherIcon);
        currentWeatherDiv.append(currentCityEl);
        var getTemp = response.main.temp.toFixed(1);
        var tempEl = $("<p class='card-text'>").text("Temperature: "+getTemp+"° F");
        currentWeatherDiv.append(tempEl);
        var getHumidity = response.main.humidity;
        var humidityEl = $("<p class='card-text'>").text("Humidity: "+getHumidity+"%");
        currentWeatherDiv.append(humidityEl);
        var getWindSpeed = response.wind.speed.toFixed(1);
        var windSpeedEl = $("<p class='card-text'>").text("Wind Speed: "+getWindSpeed+" mph");
        currentWeatherDiv.append(windSpeedEl);
        $(".city-data").html(currentWeatherDiv);
}

// This function runs the AJAX call for the 5 day forecast and displays them to the DOM
async function displayFiveDayForecast() {

    var queryURL = "https://api.openweathermap.org/data/2.5/forecast?q="+cityname+"&units=imperial&appid=5b4735245dfd66f5f4d0cf9ad8b7706a";

    var response = await $.ajax({
        url: queryURL,
        method: "GET"
      })

      var forecastDiv = $("<section class='display-forecast'>");
      var forecastHeader = $("<h3 class='card-header border-secondary'>").text("5 Day Forecast:");
      forecastDiv.append(forecastHeader);
      var fiveDayCardContainer = $("<div  class='card-deck'>");
      forecastDiv.append(fiveDayCardContainer);
      
      console.log(response);
      for (i=0; i<5;i++){
          var forecastCard = $("<div class='cards mb-3 mt-3'>");
          var fiveDayCard = $("<div class='card-body'>");
          var date = new Date();
          var val=(date.getMonth()+1)+"/"+(date.getDate()+i+1)+"/"+date.getFullYear();
          var forecastDate = $("<h6 class='card-title'>").text(val);
          
        fiveDayCard.append(forecastDate);
        var getCurrentWeatherIcon = response.list[i].weather[0].icon;
        var displayWeatherIcon = $("<img src = http://openweathermap.org/img/wn/" + getCurrentWeatherIcon + ".png />");
        fiveDayCard.append(displayWeatherIcon);
        var getTemp = response.list[i].main.temp;
        var tempEl = $("<p class='card-text'>").text("Temp: "+getTemp+"° F");
        fiveDayCard.append(tempEl);
        var getHumidity = response.list[i].main.humidity;
        var humidityEl = $("<p class='card-text'>").text("Humidity: "+getHumidity+"%");
        fiveDayCard.append(humidityEl);
        forecastCard.append(fiveDayCard);
        fiveDayCardContainer.append(forecastCard);
      }
      $(".forecast-container").html(forecastDiv);
    }

// This function is used to pass the city in the history list to the displayWeather function
function historyDisplayWeather(){
    cityname = $(this).attr("data-name");
    displayWeather();
    displayFiveDayForecast();
    console.log(cityname);    
}

$(document).on("click", ".city", historyDisplayWeather);
