const searchWeather= document.querySelector(".searchweather");
const searchBar=document.querySelector(".search-bar");
const yourWeather=document.querySelector(".yourweather");
const locationButton=document.querySelector("[locationAccess]");
const welcomePage=document.querySelector(".welcome-page");
let latitude=null;
let longitude=null;
const API_key="ca25e5e855e3e266add96a66608290ba";
const placeName=document.querySelector("[placename]");
const flag=document.querySelector("[flag]");
const weatherDescription=document.querySelector("[weatherdescription]");
const temperature=document.querySelector("[temperature]");
const windSpeed=document.querySelector("[windspeed]");
const humidity=document.querySelector("[humidity]");
const cloud=document.querySelector("[cloud]");
const weatherPage=document.querySelector(".weather");
const loading=document.querySelector(".loading");
const inputBox=document.querySelector(".input-box");
const searchButton=document.querySelector("[searchbutton]");
const errorPage=document.querySelector("[errorpage]");
const errorMessage=document.querySelector("[errormessage]");
// searchweather and yourweather plus searchbar handling

let prevTab=yourWeather;
prevTab.classList.add("highlight");

function switchTab(currTab){
  if(currTab!=prevTab){
      if(errorPage.classList.contains("activate")) errorPage.classList.remove("activate");
      prevTab.classList.remove("highlight");
      prevTab=currTab;
      prevTab.classList.add("highlight");
      if(!searchBar.classList.contains("active-searchbar")){
        welcomePage.classList.add("inactive");
        searchBar.classList.add("active-searchbar");
        weatherPage.classList.remove("weather-active");
      }else{
        searchBar.classList.remove("active-searchbar");
        weatherPage.classList.remove("weather-active");
        checkStorageSession();
      }
  }
}

function checkStorageSession(){
    const location=sessionStorage.getItem("coordinates-key");
    if(!location){
       welcomePage.classList.remove("inactive"); 
    }else{
       const coordinates=JSON.parse(location);
       console.log(coordinates.latitude);
       getWeatherByLatLong(coordinates.latitude,coordinates.longitude);
    }
}

searchWeather.addEventListener("click",()=>{
    switchTab(searchWeather);
});

yourWeather.addEventListener("click",(e)=>{
    switchTab(yourWeather);
});

locationButton.addEventListener("click" , ()=>{
    welcomePage.classList.add("inactive");
    getLocation();
});

searchButton.addEventListener("click",()=>{
    if(inputBox.value){
      console.log(inputBox.value);
      getWeatherByCity(inputBox.value);
    }
})

inputBox.addEventListener("keyup",(e)=>{
    if (e.key === 'Enter') {
      if(inputBox.value){
        console.log(inputBox.value);
        if(errorPage.classList.contains("activate")) errorPage.classList.remove("activate");
        getWeatherByCity(inputBox.value);
      }
    }
});

function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showPosition);
  } else {
    alert("Geolocation is not supported by this browser.");
  }
}

function showPosition(position){
  latitude=position?.coords?.latitude;
  longitude=position?.coords?.longitude;
  const coordinates={latitude,longitude};
  sessionStorage.setItem("coordinates-key",JSON.stringify(coordinates));
  getWeatherByLatLong(latitude,longitude);
}


// for your location
async function getWeatherByLatLong(latitude,longitude){
   loading.classList.add("loading-active");
   try{
      const response= await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API_key}&units=metric`);
      const data=await response.json();
      loading.classList.remove("loading-active");
      weatherPage.classList.add("weather-active");
      displayData(data);
   }catch(e){
      loading.classList.remove("loading-active");
      if(searchBar.classList.contains("active-searchbar")) searchBar.classList.remove("active-searchbar");
      if(weatherPage.classList.contains("weather-active")) weatherPage.classList.remove("weather-active");
      errorPage.classList.add("activate");
      console.log(e);
      errorMessage.innerText=e;
   }
}

//for another city
async function getWeatherByCity(city){
  loading.classList.add("loading-active");
  try{
     const response= await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_key}&units=metric`);
     const data=await response.json();
     loading.classList.remove("loading-active");
     weatherPage.classList.add("weather-active");
     if(data.cod==="404"){
       loading.classList.remove("loading-active");
       if(weatherPage.classList.contains("weather-active")) weatherPage.classList.remove("weather-active");
       errorPage.classList.add("activate");
       errorMessage.innerText="Entered incorrect city name!!!";
       return;
     }
     displayData(data);
  }catch(e){
      loading.classList.remove("loading-active");
      if(weatherPage.classList.contains("weather-active")) weatherPage.classList.remove("weather-active");
      errorPage.classList.add("activate");
      console.log(e);
      errorMessage.innerText=e;
  }
}

function displayData(data){
  placeName.innerText=data.name;
  weatherDescription.innerText=data.weather[0].description;
  temperature.innerText=data.main.temp+` °C`;
  const id=data.weather[0].icon;
  windSpeed.innerText=data.wind.speed+` m/s`;
  humidity.innerText=data.main.humidity+`%`;
  cloud.innerText=data.clouds.all+`%`;
  //for weather img
  var _img = document.getElementById('id1');
  var newImg = new Image;
  newImg.onload = function() {
      _img.src = this.src;
  }
  newImg.src = `https://openweathermap.org/img/wn/${id}@2x.png`;
  //for flag
  var _icon=document.querySelector(".icon");
  var newFlag=new Image;
  newFlag.onload=function(){
      _icon.src=this.src;
  }
  newFlag.src=`https://flagcdn.com/60x45/${data?.sys?.country.toLowerCase()}.png`
}





// ca25e5e855e3e266add96a66608290ba
