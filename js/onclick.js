
function airports() {

  localStorage.setItem('loop', 'n');
  CONFIG.loop = false;
  
  window.parent.location.href= 'airports.html';

}



function zipcodes() {

  localStorage.setItem('loop', 'n');
  CONFIG.loop = false;
  
  window.parent.location.href= 'zipcodes.html';

}




function radaralerts() {

  localStorage.setItem('loop', 'y');
  CONFIG.loop = true;
  
  window.parent.location.href= 'MobileTrimble.html';

}




function radarfull() {

  localStorage.setItem('loop', 'y');
  CONFIG.loop = true;
  
  window.parent.location.href= 'MobileMapBox.html';

}






function nws() {

  localStorage.setItem('loop', 'n');
  CONFIG.loop = false;
  location.href = "fullscrn.html";
}






function mapbox() {

  localStorage.setItem('loop', 'y');
  CONFIG.loop = true;
  location.href = "mapbox.html";
}






function intellistar() {

  localStorage.setItem('loop', 'n');
  CONFIG.loop = false;

  window.location.reload();
}



