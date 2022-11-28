let weather = {
    apiKey: "540b53ccb3837f01809fc75085a1d980",
    nameOfCity: "",
    fetchCityInfo: function (cityName) {
        fetch(
            "http://api.openweathermap.org/geo/1.0/direct?q="
            + cityName
            + "&units=metric&appid="
            + this.apiKey
        ).then((response) => response.json())
            .then((data) => {
                console.log("1111111111111111111111");
                console.log(data);
                weather.nameOfCity = data[0].name;
                var latitude = data.at(0).lat;
                var longitude = data.at(0).lon;
                this.fetchWeather(latitude, longitude);
                this.getForecast(latitude, longitude);
            })
    },

    fetchWeather: function (latitude, longitude) {
        fetch(
            "https://api.openweathermap.org/data/2.5/weather?"
            + "lat=" + latitude + "&"
            + "lon=" + longitude + "&units=metric&"
            + "appid=" + this.apiKey
        ).then((response) => response.json())
            .then((data) => {
                console.log("2222222222222222222222222");
                console.log(data);
                this.displayWeather(data);
            })
    },


    capitalizeWords: function (mySentence) {
        const words = mySentence.split(" ");

        for (let i = 0; i < words.length; i++) {
            words[i] = words[i][0].toUpperCase() + words[i].substr(1);
        }
        return words.join(" ");
    },

    displayWeather: function (data) {
        const { icon, description } = data.weather[0];
        const { temp, humidity } = data.main;
        const { speed } = data.wind;
        console.log(weather.nameOfCity, icon, description, temp, humidity, speed);

        if (weather.nameOfCity != "")
            document.querySelector(".city").innerHTML = "Weather in " + weather.nameOfCity;
        else
            document.querySelector(".city").innerHTML = "Weather at current location";

        document.querySelector(".icon").src = "http://openweathermap.org/img/wn/" + icon + "@2x.png";
        document.querySelector(".description").innerHTML = this.capitalizeWords(description);
        document.querySelector(".temp").innerHTML = temp + "°C";
        document.querySelector(".humidity").innerHTML = "Humidity: " + humidity + "%";
        document.querySelector(".wind").innerHTML = "Wind Speed: " + speed + " Km/h";
    },

    getForecast: function () {
        fetch('https://api.openweathermap.org/data/2.5/forecast?q=' + this.nameOfCity + '&appid=540b53ccb3837f01809fc75085a1d980')
            .then(response => response.json())
            .then(data => {
                //Getting the min and max values for each day
                for (i = 0; i < 5; i++) {
                    document.getElementById("day" + (i + 1) + "Min").innerHTML =
                        "Min: " + Number(data.list[i].main.temp_min - 273.15).toFixed(1) + "°";
                    //Number(1.3450001).toFixed(2); // 1.35
                }

                for (i = 0; i < 5; i++) {
                    document.getElementById("day" + (i + 1) + "Max").innerHTML =
                        "Max: " + Number(data.list[i].main.temp_max - 273.15).toFixed(2) + "°";
                }

                for (i = 0; i < 5; i++) {
                    document.getElementById("img" + (i + 1)).src = "http://openweathermap.org/img/wn/" +
                        data.list[i].weather[0].icon + ".png";
                }
                console.log(data)
            })

            .catch(err => alert("Something Went Wrong: Try Checking Your Internet Coneciton"))
    },

    getForecast: function (latitude, longitude) {

        var newName = document.getElementById("cityInput");
        var cityName = document.getElementById("cityName");

        fetch('https://api.openweathermap.org/data/2.5/forecast?lat=' + latitude +
            "&lon=" + longitude +
            '&appid=540b53ccb3837f01809fc75085a1d980')
            .then(response => response.json())
            .then(data => {

                //Getting the min and max values for each day
                for (i = 0; i < 5; i++) {
                    document.getElementById("day" + (i + 1) + "Min").innerHTML = "Min: " +
                     Number(data.list[i].main.temp_min - 273.15).toFixed(1) + "°";
                    //Number(1.3450001).toFixed(2); // 1.35
                }

                for (i = 0; i < 5; i++) {
                    document.getElementById("day" + (i + 1) + "Max").innerHTML = "Max: " +
                     Number(data.list[i].main.temp_max - 273.15).toFixed(2) + "°";
                }
                //------------------------------------------------------------

                //Getting Weather Icons
                for (i = 0; i < 5; i++) {
                    document.getElementById("img" + (i + 1)).src = "http://openweathermap.org/img/wn/" +
                        data.list[i].weather[0].icon
                        + "@2x.png";
                }
                //------------------------------------------------------------
                console.log(data)
            })
            .catch(err => alert("Something Went Wrong: Try Checking Your Internet Coneciton"))
    }
}

document.querySelector("button").addEventListener("click", function () {
    weather.fetchCityInfo(document.querySelector(".search_bar").value);
})

document.querySelector(".search_bar").addEventListener("keyup", function (event) {
    if (event.key == "Enter") {
        weather.fetchCityInfo(document.querySelector(".search_bar").value);
    }
})

// For initial location acquiring of user
function initGeolocation() {
    if (navigator.geolocation) {
        // Call getCurrentPosition with success and failure callbacks
        navigator.geolocation.getCurrentPosition(success, fail);
    }
    else {
        alert("Sorry, your browser does not support geolocation services.");
    }
}

function success(position) {
    // location obtained! :D
    var lon = position.coords.longitude;
    var lat = position.coords.latitude;
    console.log(lat);
    console.log(lon);
    weather.fetchWeather(lat, lon);
}

function fail() {
    // Could not obtain location :(
    weather.fetchCityInfo("New Delhi");
}

initGeolocation();