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

 
const frameCount = 10; // total intervals
const startMinutes = -180; // start time offset relative to now, where negative means past
const endMinutes = 0;

const MAPBOX_TOKEN = 'pk.eyJ1IjoiYmxhcmsiLCJhIjoiY2plaGZmaGR1MGZ3cTJ3bzZ6OHp5OGZzYyJ9.5dVrsWJk208YPShD-0HLsQ';
const AERIS_ID = 'wgE96YE3scTQLKjnqiMsv';
const AERIS_KEY = 'SVG2gQFV8y9DjKR0BRY9wPoSLvrMrIqF9Lq2IYaY';
const NUM_COLORS = '256'; // set to empty string for true color png
const TILE_SIZE = 256;

// layer to include on the map
// uncomment more layers or add more!
const layers = [
 	//'land-terrain',
    //'alerts:50',
    //'satellite',
    'radar:75:blur(0)',
    //'stormcells',
	//'radar-global',
	//'satellite-infrared-color',
	//'stormreports',
	//'lightning-strike-density',
	//'lightning-strikes-5m-icons',
	//'lightning-flash-5m-icons',
	//'temperatures-text',
	//'dew-points-text',
	//'fires-obs-points',
	//'surface-analysis-pressure-text',
	//'surface-analysis-fronts',
	//'fradar'

];

function getTilePath(server, interval) {
	return `https://maps${server}.aerisapi.com/${AERIS_ID}_${AERIS_KEY}/${layers.join(',')}/{z}/{x}/{y}/${interval}min.png${NUM_COLORS}`;
}



// Create the Mapbox map instance
mapboxgl.accessToken = 'pk.eyJ1IjoiYmxhcmsiLCJhIjoiY2plaGZmaGR1MGZ3cTJ3bzZ6OHp5OGZzYyJ9.5dVrsWJk208YPShD-0HLsQ';
const map = new mapboxgl.Map({
	container: 'map',
	style: 'mapbox://styles/mapbox/bright-v9',
	center: [longitude, latitude],
	zoom: 9,
	projection: 'mercator'
});



function addRasterLayer(map, interval, opacity = 0) {
	const id = `amp-${layers.join('::')}-${interval}`;
	map.addSource(id, {
		type: 'raster',
		tiles: [1, 2, 3, 4].map((s) => getTilePath(s, interval)),
		tileSize: TILE_SIZE,
		attribution: '<a href="https://www.aerisweather.com/">Xweather</a>'
	});
	map.addLayer({
		id, 
		type: 'raster',
		source: id,
		minzoom: 0,
		maxzoom: 22,
		paint: {
			'raster-opacity': opacity,
			'raster-opacity-transition': {
				duration: 0,
				delay: 0
			}
		}
	});

	return id;
}

function setRasterLayerOpacity(map, id, opacity) {
	map.setPaintProperty(id, 'raster-opacity', opacity);
}

map.on('load', () => {
	const interval = (endMinutes - startMinutes) / frameCount;
	// set up the animation frames and layers
	const frames = [];
	for (let i = 0; i < frameCount; i += 1) {
		const opacity = (i === 0) ? 1 : 0;
		const timeOffset = startMinutes + interval * i;
		const id = addRasterLayer(map, timeOffset, opacity);
		frames.push(id);
	}



	// wait time determines how long to wait and allow frames to load before
	// beginning animation playback
	const waitTime = 0;

	// step time determines the time in milliseconds each frame holds before advancing
	const stepTime = 1000;

	let currentOffset = 0;
	let previousOffset = currentOffset;

	setTimeout(() => {
		setInterval(() => {
			previousOffset = currentOffset;
			currentOffset += 1;
			if (currentOffset === frames.length - 1) {
				currentOffset = 0;
			}
			setRasterLayerOpacity(map, frames[previousOffset], 0);
			setRasterLayerOpacity(map, frames[currentOffset], 1);
		}, stepTime);
	}, waitTime);
});

map.setView(e.latlng, map.getZoom(), {
  "animate": true,
  "pan": {
    "duration": 10
  }
});
 

}














