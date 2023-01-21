/*To get the icon for the weather, use this URL as the src attribute in an <img> tag: (look for the icon property and use this:
var iconUrl = `https://openweathermap.org/img/w/${**your-data-ojb**.icon}.png`;*/

var APIKey = "5b4735245dfd66f5f4d0cf9ad8b7706a"

var city;

var queryURL = "http://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + APIKey;

// fetch(queryURL)

var cityNameResultsEl = $('.results');
var cityNameListEl = $('.city-results');
var searchBtn = $('.search-btn');

function generateCityEl (event) {
    event.preventDefault();
  
    var city = $('#city-name').val();
    console.log("city =", city);

    if (!city) {
        return
    }
    
    // print selected city to the page as button
    cityNameListEl.append('<button class= city-btn>' + city + '</button>');
    var cityList = cityNameListEl.attr("city-btn");

    // clear the form input element
    $('#city-name').val('');

    localStorage.setItem(cityList, city);
  }
  
  // Create a submit event listener on the button element
    searchBtn.on('click', generateCityEl);

    $(".city-results .city-btn").val(localStorage.getItem("undefined"));
