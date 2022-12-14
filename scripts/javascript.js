"use strict";

const currentTextStatus = document.getElementById("textCurrentStatus");
const currentTemperature = document.getElementById("currentTemp");
const currentLocation = document.getElementById("currentLocation");
const submitButton = document.getElementById("submit-location");
const testIconStatus = document.getElementById("dayStatusIcon1");

submitButton.addEventListener("click",()=>{
    const zipcode = document.getElementById("location-data").value;
    if(!zipcode){
        alert("Invalid zipcode.");
    }else{
        try{
            fetch(`https://api.openweathermap.org/geo/1.0/zip?zip=`+zipcode+`&appid=0c8635139e6e422b431bd6cbba0ad062`,{mode: "cors"})
            .then((response) => response.json())
            .then((data)=>{
                if(data.cod == "404"||data.cod == "400"){
                    Promise.reject(new Error('fail')).then(()=>{console.log('Resolved')}, ()=>{alert("Invalid Zipcode.")});
                }else{
                    let locationName = data.name + ", " + data.country;
                    console.log("lat: " + data.lat + "  lon: " + data.lon);
                    // Retrieve today's forecast
                    fetch(`https://api.openweathermap.org/data/2.5/weather?lat=`+data.lat+`&lon=`+data.lon+`&appid=0c8635139e6e422b431bd6cbba0ad062`,{mode: "cors"})
                    .then(response=>response.json())
                    .then(weatherData =>{
                        currentTextStatus.innerText = "Right now it's ";
                        currentLocation.innerText = "at " + locationName;
                        currentTemperature.innerText = Math.round((weatherData.main.temp - 273.15) * 9/5 + 32) + " F";
                        changeCurrentWeather(weatherData);
                        console.log(weatherData);
                    });
                    // Retrieve 5 day forecast
                    fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=`+data.lat+`&lon=`+data.lon+`&units=imperial&appid=0c8635139e6e422b431bd6cbba0ad062`,{mode: "cors"})
                    .then(response => response.json())
                    .then(forecastData =>{
                        let dayCount = 1;
                        console.log(forecastData);
                        for(let i = 0; i < 40; i += 8){
                            let temp1 = Math.round(forecastData.list[i].main.temp) + " F";
                            let date1 = new Date((forecastData.list[i].dt + (forecastData.city.timezone - (-14400))) * 1000);
                            let temp2 = Math.round(forecastData.list[i+4].main.temp) + " F";
                            let date2 = new Date((forecastData.list[i+4].dt + (forecastData.city.timezone - (-14400))) * 1000);

                            const dayElement = document.getElementById("day" + dayCount);
                            dayElement.children[1].innerText = date1.getHours()+":00";
                            dayElement.children[2].innerText = temp1;
                            changeForecastWeather(dayElement.children[3],forecastData.list[i],forecastData)
                            dayElement.children[4].innerText = date2.getHours()+":00";
                            dayElement.children[5].innerText = temp2;
                            changeForecastWeather(dayElement.children[6],forecastData.list[i+4],forecastData)
                            if(i===0){
                                dayElement.querySelectorAll(".dayName")[0].innerText = "Today";
                            }else{
                                dayElement.querySelectorAll(".dayName")[0].innerText = (new Date(forecastData.list[i].dt*1000)).toLocaleDateString("en-US", { weekday: "long" });
                            }
                            dayCount++
                        }
                        const infoModal = document.querySelectorAll(".info-modal")[0];
                        infoModal.style.visibility = "visible";
                    });
                }
            });
        }catch(error){
            console.log(error);
        }
    }
});
function changeForecastWeather(element, weatherData, locationData){
    const weatherCode = weatherData.weather[0].main;
    if(weatherCode==="Thunderstorm"){
        element.style.backgroundImage = `url('./images/thunderstorm.png')`;
    }else if(weatherCode==="Snow"){
        element.style.backgroundImage = `url(./images/snow.png)`;
    }else if(weatherCode==="Drizzle"||weatherCode==="Rain"){
        element.style.backgroundImage = `url('./images/rain-cloud.png')`;
    }else if(weatherCode==="Mist"||
    weatherCode==="Smoke"||
    weatherCode==="Haze"||
    weatherCode==="Dust"||
    weatherCode==="Fog"||
    weatherCode==="Sand"||
    weatherCode==="Ash"||
    weatherCode==="Squall"||
    weatherCode==="Tornado"){
        element.style.backgroundImage = `url('./images/fog.png')`;
    }else if(weatherCode==="Clear"){
        const date = new Date((weatherData.dt + (locationData.city.timezone-(-14400)) )* 1000);
        const sunriseDate = new Date((locationData.city.sunrise + (locationData.city.timezone-(-14400)) )* 1000);
        const sunsetDate = new Date((locationData.city.sunset + (locationData.city.timezone-(-14400)) )* 1000);
        const timeNow = date.getHours()*60 + date.getMinutes();
        const sunriseTime = sunriseDate.getHours()*60 + sunriseDate.getMinutes();
        const sunsetTime = sunsetDate.getHours()*60 + sunsetDate.getMinutes();


        if(timeNow>=sunriseTime && timeNow<sunsetTime){
            element.style.backgroundImage = `url('./images/sun.png')`;
        }else if(timeNow<sunriseTime || timeNow>=sunsetTime){
            element.style.backgroundImage = `url('./images/moon.png')`;
        }
    }else if(weatherCode==="Clouds"){
        element.style.backgroundImage = `url('./images/cloud.png')`;
    }
}
function changeCurrentWeather(weatherData){
    let date = new Date(weatherData.dt*1000);
    let hours = date.getHours();
    let minutes = date.getMinutes();
    let timeNow = hours*60 + minutes;
    console.log(timeNow)
    const weatherCode = weatherData.weather[0].main;
    const currentWeatherStatus = document.querySelectorAll(".weather-icon")[0];
    const backgroundWeatherStatus = document.querySelectorAll(".left-container")[0];
    backgroundWeatherStatus.className = "left-container";
    currentWeatherStatus.className = "weather-icon";
    if(weatherCode==="Thunderstorm"){
        currentWeatherStatus.classList.add("thunderstorm");
        backgroundWeatherStatus.classList.add("thunderstorm");
    }else if(weatherCode==="Snow"){
        currentWeatherStatus.classList.add("snow");
        backgroundWeatherStatus.classList.add("snow");
    }else if(weatherCode==="Drizzle"||weatherCode==="Rain"){
        currentWeatherStatus.classList.add("rain");
        backgroundWeatherStatus.classList.add("rain");
    }else if(weatherCode==="Mist"||
    weatherCode==="Smoke"||
    weatherCode==="Haze"||
    weatherCode==="Dust"||
    weatherCode==="Fog"||
    weatherCode==="Sand"||
    weatherCode==="Ash"||
    weatherCode==="Squall"||
    weatherCode==="Tornado"){
        currentWeatherStatus.classList.add("fog");
        backgroundWeatherStatus.classList.add("fog");
    }else if(weatherCode==="Clear"){
        let sixAM = 6*60;
        let eightPM = 20*60;

        if(timeNow<=sixAM || timeNow>=eightPM){
            currentWeatherStatus.classList.add("moon");
            backgroundWeatherStatus.classList.add("moon");
        }else if(timeNow>=sixAM || timeNow<=eightPM){
            currentWeatherStatus.classList.add("sun");
            backgroundWeatherStatus.classList.add("sun");
        }
    }else if(weatherCode==="Clouds"){
        currentWeatherStatus.classList.add("cloud");
        backgroundWeatherStatus.classList.add("cloud");
    }
}