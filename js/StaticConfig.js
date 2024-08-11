window.CONFIG = {
  crawl: `☁ Welcome to KAOS!!!.... The Intellistar Emulator. ☁`,
  greeting: 'This is your weather',
  language: 'en-US', // Supported in TWC API
  countryCode: 'US', // Supported in TWC API (for postal key)
  units: 'e', // Supported in TWC API (e = English (imperial), m = Metric, h = Hybrid (UK)),
  unitField: 'imperial', // Supported in TWC API. This field will be filled in automatically. (imperial = e, metric = m, uk_hybrid = h)
  loop: false,
  locationMode: "POSTAL",
  secrets: {
    // Possibly deprecated key: See issue #29
    // twcAPIKey: 'd522aa97197fd864d36b418f39ebb323'
    //twcAPIKey: '21d8a80b3d6b444998a80b3d6b1449d3'
    twcAPIKey: 'e1f10a1e78da46f5b10a1e78da96f525'
  },

  // Config Functions (index.html settings manager)
  locationOptions:[],
  addLocationOption: (id, name, desc) => {
    CONFIG.locationOptions.push({
      id,
      name,
      desc,
    })
  },
  options: [],
  addOption: (id, name, desc) => {
    CONFIG.options.push({
      id,
      name,
      desc,
    })
  },
  submit: (btn, e) => {
    let args = {}
    const currentLoop = (localStorage.getItem('loop') === 'y')
    CONFIG.locationOptions.forEach((opt) => {
      args[opt.id] = getElement(`${opt.id}-text`).value
      args[`${opt.id}-button`] = getElement(`${opt.id}-button`).checked
      if (!currentLoop) {
        localStorage.setItem(opt.id, args[opt.id])
      }
    })
    args['countryCode'] = getElement('country-code-text').value
    if (!currentLoop) {
      localStorage.setItem('countryCode', args['countryCode'])
    }
    CONFIG.options.forEach((opt) => {
      args[opt.id] = getElement(`${opt.id}-text`).value
      if (!currentLoop) {
        localStorage.setItem(opt.id, args[opt.id])
      }
    })
    console.log(args)
    if (currentLoop) {
      if (localStorage.getItem('crawlText')) CONFIG.crawl = localStorage.getItem('crawlText')
      if (localStorage.getItem('greetingText')) CONFIG.greeting = localStorage.getItem('greetingText')
      if (localStorage.getItem('countryCode')) CONFIG.countryCode = localStorage.getItem('countryCode')
    } else {
      if (args.crawlText !== '') CONFIG.crawl = args.crawlText
      if (args.greetingText !== '') CONFIG.greeting = args.greetingText
      if (args.countryCode !== '') CONFIG.countryCode = args.countryCode
      if (args.loop === 'y') CONFIG.loop = true
    }
    
    if (args['airport-code-button']==true){ 
      CONFIG.locationMode="AIRPORT" 
      if(args['airport-code'].length==0){
        alert("Please enter an airport code")
        return
      }
    } 
    else { 
      CONFIG.locationMode="POSTAL" 
      if(!currentLoop && args['zip-code'].length==0){
        alert("Please enter a postal code")
        return
      }

    }
    
    zipCode = args['zip-code'] || localStorage.getItem('zip-code')
    airportCode = args['airport-code'] || localStorage.getItem('airport-code')
    
    CONFIG.unitField = CONFIG.units === 'm' ? 'metric' : (CONFIG.units === 'h' ? 'uk_hybrid' : 'imperial')
    fetchCurrentWeather();
  },
  load: () => {
    let settingsPrompt = getElement('settings-prompt')



    //<button class="setting-item settings-text" id="submit-button" onclick="checkZipCode();" style="margin-bottom: 10px;">Start</button>-->
    let btn = document.createElement('button')
    btn.classList.add('setting-item', 'settings-text', 'settings-input', 'button')
    btn.id = 'submit-button'
    btn.onclick = CONFIG.submit
    btn.style = 'margin-bottom: 10px;'
    btn.appendChild(document.createTextNode('Start'))
    settingsPrompt.appendChild(btn)
    if (CONFIG.loop || localStorage.getItem('loop') === 'y') {
      CONFIG.loop = true;
      hideSettings();
      CONFIG.submit()

    }
  }
}

CONFIG.unitField = CONFIG.units === 'm' ? 'metric' : (CONFIG.units === 'h' ? 'uk_hybrid' : 'imperial')



