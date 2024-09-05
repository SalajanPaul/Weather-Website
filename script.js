let weatherDataReceived = false;

function getWeather() {
    const apiKey = '2fac1a8c2109fc052015aa7336b85953';
    const city = document.getElementById('city').value;

    if (!city) {
        alert('Please enter a city');
        return; // Stop the function execution if no city is entered
    }

    const currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`;
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}`;

    weatherDataReceived = false;

    fetch(currentWeatherUrl)
    .then(response => response.json())
    .then(data => {
        if (data.cod === '404') {
            alert(`City not found!`);
            weatherDataReceived = false; 
        } else {
            weatherDataReceived = true; 
            displayWeather(data);

            
            fetch(forecastUrl)
                .then(response => response.json())
                .then(data => {
                    displayHourlyForecast(data.list);
                })
                .catch(error => {
                    console.error('Error', error);
                    if (weatherDataReceived) { 
                        alert('Error fetching hourly forecast data.');
                    }
                });
        }
    })
    .catch(error => {
        console.error('Error', error);
        alert('Error fetching current weather data.');
    });


function displayWeather(data) {
    const tempDivInfo = document.getElementById('temp-div');
    const weatherInfoDiv = document.getElementById('weather-info');
    const weatherIcon = document.getElementById('weather-icon');
    const hourlyForecastDiv = document.getElementById('hourly-forecast');

    weatherInfoDiv.innerHTML = '';
    hourlyForecastDiv.innerHTML = '';
    tempDivInfo.innerHTML = '';

    if (data.cod === '404') {
        alert(`City not found!`);
        location.reload();
    } else {
        const cityName = data.name;
        const temperature = Math.round(data.main.temp - 273.15);
        const description = data.weather[0].description;
        const iconCode = data.weather[0].icon;
        const iconUrl = `http://openweathermap.org/img/wn/${iconCode}@4x.png`;

        const temperatureHTML = `<p>${temperature}°C</p>`;
        const weatherHTML = `<p>${cityName}</p>
                             <p>${description}</p>`;

        tempDivInfo.innerHTML = temperatureHTML;
        weatherInfoDiv.innerHTML = weatherHTML;
        weatherIcon.src = iconUrl;
        weatherIcon.alt = description;

        showImage();
    }
}

function displayHourlyForecast(hourlyData) {
    const hourlyForecastDiv = document.getElementById('hourly-forecast');
    const next24Hours = hourlyData.slice(0, 8);

    next24Hours.forEach(item => {
        const dateTime = new Date(item.dt * 1000);
        const hour = dateTime.getHours();
        const temperature = Math.round(item.main.temp - 273.15);
        const iconCode = item.weather[0].icon;
        const iconUrl = `https://openweathermap.org/img/wn/${iconCode}.png`;

        const hourlyItemHtml = `
            <div class="hourly-item">
                <span>${hour}:00</span>
                <img src="${iconUrl}" alt="Hourly Weather Icon">
                <span>${temperature}°C</span>
            </div>
        `;

        hourlyForecastDiv.innerHTML += hourlyItemHtml;
    });
}

function showImage() {
    const weatherIcon = document.getElementById('weather-icon');
}
}

function getCurrentLocationWeather() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
            let lat = position.coords.latitude;
            let lon = position.coords.longitude;
            fetchWeatherByCoords(lat, lon);
        }, function(error) {
            alert("Unable to retrieve your location due to " + error.message);
        });
    } else {
        alert("Geolocation is not supported by this browser.");
    }
}

function fetchWeatherByCoords(lat, lon) {
    const apiKey = '2fac1a8c2109fc052015aa7336b85953';
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            updateWeatherUI(data);
        })
        .catch(error => {
            alert("An error occurred: " + error.message);
        });
}

function updateWeatherUI(data) {
    document.getElementById('temp-div').innerText = `Temperature: ${data.main.temp}°C`;
    document.getElementById('weather-info').innerText = `Weather: ${data.weather[0].description}`;
    document.getElementById('weather-icon').src = `http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
    document.getElementById('weather-info').innerHTML += `<br>You are located in: ${data.name}`;
}