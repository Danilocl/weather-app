const container = document.querySelector('.container');
const search = document.querySelector('.search-box button');
const error404 = document.querySelector('.not-found');
const weatherBox = document.querySelector('.weather-box');
const weatherDetails = document.querySelector('.weather-details');
const tableForecast = document.querySelector('.table-forecast');
const searchInput = document.querySelector('#search-input');
const suggestionsBox = document.querySelector('#suggestions')
const APIKey = '2d3349aa8b5998b7d31222f867042307';

import { formatDateTime, kelvinToCelsius } from './util.js';


searchInput.addEventListener('input', () => {
    const query = searchInput.value;

    if (query.length > 2) {
        fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${query}&limit=5&appid=${APIKey}`)
            .then(response => response.json())
            .then(data => {
                suggestionsBox.innerHTML = '';
                data.forEach(city => {
                    const suggestion = document.createElement('div');
                    suggestion.classList.add('suggestion');
                    suggestion.innerHTML = `${city.name},${city.country}`
                    suggestion.addEventListener('click', () => {
                        searchInput.value = city.name;
                        suggestionsBox.innerHTML = '';
                    })
                    suggestionsBox.appendChild(suggestion);
                })
            })
    } else {
        suggestionsBox.innerHTML = '';
    }
})


search.addEventListener('click', () => {

    const location = document.querySelector('.search-box input').value;

    if (location === '')
        return;


    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${location}&units=metric&appid=${APIKey}`).then(response => response.json())
        .then(json => {

            if (json.cod === '404') {
                container.style.height = '500px';
                weatherBox.style.display = 'none';
                weatherDetails.style.display = 'none'
                tableForecast.style.display = 'none'
                error404.style.display = 'block';
                error404.classList.add('fadeIn');
                suggestionsBox.style.bottom = '420px'
                return;
            }

            error404.style.display = 'none';
            error404.classList.remove('fadeIn');

            const image = document.querySelector('.weather-box img');
            const temperature = document.querySelector('.weather-box .temperature');
            /**
            const tempDetailed = document.querySelector('.weather-box .tempDetailed span');
             */
            const description = document.querySelector('.weather-box .description');
            const humidity = document.querySelector('.weather-details .humidity span');
            const wind = document.querySelector('.weather-details .wind span');

            switch (json.weather[0].main) {
                case 'Clear':
                    image.src = 'images/Animation-clear.gif';
                    break;

                case 'Rain':
                    image.src = 'images/Animation-rain.gif';
                    break;

                case 'Snow':
                    image.src = 'images/Animation-snow.gif';
                    break;

                case 'Clouds':
                    image.src = 'images/Animation-cloud.gif';
                    break;

                case 'Haze':
                    image.src = 'images/mist.png';
                    break;
                case 'Thunderstorm':
                    image.src = 'images/Animation-Thunderstorm.gif';
                    break;

                default:
                    image.src = '';
            }

            temperature.innerHTML = `${parseInt(json.main.temp)}<span>°C</span>`;

            description.innerHTML = `${json.weather[0].description}<span>. Feels like ${json.main.feels_like}</span>`;

            humidity.innerHTML = `${json.main.humidity}%`;
            wind.innerHTML = `${parseInt(json.wind.speed)}Km/h`;

            weatherBox.style.display = '';
            tableForecast.style.display = ''
            weatherDetails.style.display = '';
            weatherBox.classList.add('fadeIn');
            weatherDetails.classList.add('fadeIn');
            container.style.height = '750px'
            container.style.width = '850px';
            suggestionsBox.style.bottom = '660px'

            fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${location}&appid=${APIKey}`).then(response => response.json())
                .then(json => {
                    if (json.cod === '404') {
                        tableForecast.style.display = 'none';
                        return;
                    }

                    const images = document.querySelectorAll('.table-forecast img');

                    const jsonList = json.list.slice(0, 9);

                    jsonList.forEach((item, index) => {
                        if (index >= images.length) return;
                        const image = images[index];

                        switch (item.weather[0].main) {
                            case 'Clear':
                                image.src = 'images/Animation-clear.gif';
                                break;

                            case 'Rain':
                                image.src = 'images/Animation-rain.gif';
                                break;

                            case 'Snow':
                                image.src = 'images/Animation-snow.gif';
                                break;

                            case 'Clouds':
                                image.src = 'images/Animation-cloud.gif';
                                break;

                            case 'Haze':
                                image.src = 'images/mist.png';
                                break;

                            case 'Thunderstorm':
                                image.src = 'images/Animation-Thunderstorm.gif';
                                break;

                            default:
                                image.src = '';
                        }


                        for (let i = 0; i < 9; i++) {
                            const hour = document.querySelector(`.table-forecast .hour${i + 1}`);
                            const temp = document.querySelector(`.table-forecast .temp${i + 1}`);
                            const description = document.querySelector(`.table-forecast .description${i + 1}`);

                            hour.innerHTML = formatDateTime(jsonList[i].dt_txt);
                            temp.innerHTML = `${kelvinToCelsius(jsonList[i].main.temp_min)} / ${kelvinToCelsius(jsonList[i].main.temp_max)}`;
                            description.innerHTML = `${jsonList[i].weather[0].description}<span>. Feels like ${kelvinToCelsius(jsonList[i].main.feels_like)}</span>`;
                        }
                    });

                })

        })
})

document.addEventListener('click', (event) => {
    if (!searchInput.contains(event.target) && !suggestionsBox.contains(event.target)) {
        suggestionsBox.innerHTML = '';
    }
});