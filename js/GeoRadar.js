function guessZipCode(){

  return;

  var zipCodeElement = getElement("zip-code-text");
  if(zipCodeElement.value != ""){
    return;
  }
  fetch(`https://api.wunderground.com/api/${CONFIG.secrets.wundergroundAPIKey}/geolookup/q/autoip.json`)
    .then(function(response) {
      //check for error
      if (response.status !== 200) {
        console.log("zip code request error");
        return;
      }
      response.json().then(function(data) {
        if(zipCodeElement.value == ""){
          zipCodeElement.value = data.location.zip;
        }
      });
    })
}


function fetchCurrentWeather(){
  let location = "";
  console.log(CONFIG.locationMode)
  if(CONFIG.locationMode=="POSTAL") {location=`postalKey=${zipCode}:${CONFIG.countryCode}`}
  else if (CONFIG.locationMode=="AIRPORT") {
    //Determine whether this is an IATA or ICAO code
    let airportCodeLength=airportCode.length;
    if(airportCodeLength==3){location=`iataCode=${airportCode}`}
    else if (airportCodeLength==4){location=`icaoCode=${airportCode}`}
    else {
      alert("Please enter a valid ICAO or IATA Code")
      console.error(`Expected Airport Code Lenght to be 3 or 4 but was ${airportCodeLength}`)
      return;
    }
  }
  else {

  }
  fetch(`https://api.weather.com/v3/location/point?${location}&language=${CONFIG.language}&format=json&apiKey=${CONFIG.secrets.twcAPIKey}`)
      .then(function (response) {
      response.json().then(function(data) {
        try {
          if(CONFIG.locationMode=="AIRPORT"){
            cityName = data.location.airportName
            .toUpperCase() //Airport names are long
            .replace("INTERNATIONAL","INTL.") //If a city name is too long, info bar breaks
            .replace("AIRPORT","") //This is an attempt to fix it
            .trim();
            console.log(cityName);
          } else {
            //Shouldn't City Name be the field City Name, not Display Name?
            cityName = data.location.city.toUpperCase();
          }
          latitude = data.location.latitude;
          longitude = data.location.longitude;
        } catch (err) {
          alert('Enter valid ZIP code');
          console.error(err)
          getZipCodeFromUser();
          return;
        }
              fetchRadarImages();

      })
    });
}

function fetchRadarImages(){

scheduleTimeline();
  //window.location.href = "https://radar.weather.gov/?settings=v1_"+mapSettings;

 
            TrimbleMaps.APIKey = '17CA0885B03A6B4FADBDC3D1A51DC0BD';
            const map = new TrimbleMaps.Map({
                container: 'map', // container id
                style: TrimbleMaps.Common.Style.TRANSPORTATION, // hosted style id
                center: [longitude, latitude], // starting position
                zoom: 6 // starting zoom
            });
            const ctrlClick = new TrimbleMaps.WeatherAlertClickControl();
            map.addControl(ctrlClick);






            const ctrlFilter = new TrimbleMaps.WeatherAlertFilterControl();
            map.addControl(ctrlFilter, 'top-right');
			
			
            map.on('load', function() {
                map.setWeatherAlertVisibility(true);
				map.setWeatherRadarVisibility(true);
            });

 



}



//////////////////////////////////////










