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

      // set up API credentials
      mapboxgl.accessToken = "pk.eyJ1IjoiYmxhcmsiLCJhIjoiY2plaGZmaGR1MGZ3cTJ3bzZ6OHp5OGZzYyJ9.5dVrsWJk208YPShD-0HLsQ";
      const twcApiKey = "e1f10a1e78da46f5b10a1e78da96f525";

      // set up a promise for The Weather Company product metadata
      const timeSlices = fetch(
        "https://api.weather.com/v3/TileServer/series/productSet/PPAcore?apiKey=" +
          twcApiKey
      );



      // set up map
      const map = new mapboxgl.Map({
        container: "map", // container id
        style: "mapbox://styles/mapbox/streets-v11", // style URL
        center: [longitude, latitude], // starting position [lng, lat]
        zoom: 9, // starting zoom
      });



      // this function resolves the metadata promise,
      // extracts the most recent publish time for radar data,
      // and adds the radar layer to the map
      const addRadarLayer = () => {
        timeSlices
          .then((res) => res.json())
          .then((res) => {
            const radarTimeSlices = res.seriesInfo.radar.series;
            const latestTimeSlice = radarTimeSlices[0].ts;

            // insert the latest time for radar into the source data URL
            map.addSource("twcRadar", {
              type: "raster",
              tiles: [
                "https://api.weather.com/v3/TileServer/tile/radar?ts=" +
                  latestTimeSlice +
                  "&xyz={x}:{y}:{z}&apiKey=" +
                  twcApiKey,
              ],
              tileSize: 256,
            });

            // place the layer before the "aeroway-line" layer
            map.addLayer(
              {
                id: "radar",
                type: "raster",
                source: "twcRadar",
                paint: {
                  "raster-opacity": 0.5,
                },
              },
              "aeroway-line"
            );
          });
      };

      map.on("load", () => {
        addRadarLayer();
      });


}


