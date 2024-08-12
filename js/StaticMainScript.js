

window.onload = function () {

  CONFIG.addLocationOption('airport-code', 'Airport', 'ATL or KATL')
  CONFIG.addLocationOption('zip-code', 'Postal', '00000')


  CONFIG.load();
  //preLoadMusic();
  //setMainBackground();
  resizeWindow();
  //setClockTime();
  if (!CONFIG.loop) {
    getElement("settings-container").style.display = 'block';
    guessZipCode();
  }
}


function scheduleTimeline(){

  setInformation();
}

function setInformation(){

  hideSettings();

}

//function setMainBackground(){
//  getElement('background-image');
//}

function hideSettings(){
  // Animate settings prompt out
  getElement('settings-prompt').classList.add('hide');
  getElement('settings-container').style.pointerEvents = 'none';

}



const baseSize = {
    w: 1,
    h: 1
}


window.onresize = resizeWindow;
function resizeWindow(){
  var ww = window.innerWidth;
  var wh = window.innerHeight;
  var newScale = 1;

  // compare ratios
  if(ww/wh < baseSize.w/baseSize.h) { // tall ratio
      newScale = ww / baseSize.w;
  } else { // wide ratio
      newScale = wh / baseSize.h;
  }

  getElement('render-frame').style.transform = 'scale(' + newScale + ',' +  newScale + ')';
}

function getElement(id){
  return document.getElementById(id);
}











