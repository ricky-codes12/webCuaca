const APIKEY= "84082fdabb124c14add153504250509";
const city = document.querySelector(".city").textContent;

function getWeatherByCity(city) {
const URL = `https://api.weatherapi.com/v1/forecast.json?key=${APIKEY}&q=${city}`;   
    fetch(URL)
    .then(res => res.json())
    .then(data => {
        console.log(data);   
    }).catch(err =>{
        console.error(err);
    })
    console.log('helo');
    
}

window.onload = () =>{
    getWeatherByCity(city);
}