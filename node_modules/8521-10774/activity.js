/*
Copyright (C) 2018 Alkis Georgopoulos <alkisg@gmail.com>.
SPDX-License-Identifier: CC-BY-SA-4.0*/

var act = null;
function onError(message, source, lineno, colno, error) {
  alert(sformat('Σφάλμα προγραμματιστή!\n'
    + 'message: {}\nsource: {}\nlineno: {}\ncolno: {}\nerror: {}',
  message, source, lineno, colno, error));
}

// ES6 string templates don't work in old Android WebView
function sformat(format) {
  var args = arguments;
  var i = 0;
  return format.replace(/{(\d*)}/g, function sformatReplace(match, number) {
    i += 1;
    if (typeof args[number] !== 'undefined') {
      return args[number];
    }
    if (typeof args[i] !== 'undefined') {
      return args[i];
    }
    return match;
  });
}

// Return an integer from 0 to num-1.
function random(num) {
  return Math.floor(Math.random() * num);
}

// Return a shuffled copy of an array.
function shuffle(a) {
  var result = a;
  var i;
  var j;
  var temp;

  for (i = 0; i < result.length; i += 1) {
    j = random(result.length);
    temp = result[i];
    result[i] = result[j];
    result[j] = temp;
  }
  return result;
}

function ge(element) {
  return document.getElementById(element);
}

function onResize(event) {
  var w = window.innerWidth;
  var h = window.innerHeight;
  if (w / h < 640 / 360) {
    document.body.style.fontSize = sformat('{}px', 10 * w / 640);
  } else {
    document.body.style.fontSize = sformat('{}px', 10 * h / 360);
  }
}

function doPreventDefault(event) {
  event.preventDefault();
}

function onHome(event) {
  window.history.back();
}

function onHelp(event) {
  ge('help').style.display = 'flex';
}

function onHelpHide(event) {
  ge('help').style.display = '';
}

function onAbout(event) {
  window.open('credits/index_DS_II.html');
}

function onFullScreen(event) {
  var doc = window.document;
  var docEl = doc.documentElement;
  var requestFullScreen = docEl.requestFullscreen || docEl.mozRequestFullScreen
    || docEl.webkitRequestFullScreen || docEl.msRequestFullscreen;
  var cancelFullScreen = doc.exitFullscreen || doc.mozCancelFullScreen
    || doc.webkitExitFullscreen || doc.msExitFullscreen;

  if (!doc.fullscreenElement && !doc.mozFullScreenElement
    && !doc.webkitFullscreenElement && !doc.msFullscreenElement) {
    requestFullScreen.call(docEl);
  } else {
    cancelFullScreen.call(doc);
  }
}

function reset(event) {
    act.page = 0;
    ge('pagenum').innerHTML = sformat('{}/4',act.page + 1);
    for (var i=0; i<4; i++){
      ge(sformat('page{}',i)).style.display = "none";
    }
    ge(sformat('page{}',act.page)).style.display = "inline";

    svg = ge('bc');
    while (svg.lastChild) {
      svg.removeChild(svg.lastChild);
    }
    for (var i=0; i<7; i++){
      for (var j=0; j<4; j++){
        act.cells[i][j].innerHTML = "";
      }
    }
    for (var i=0; i<28; i++){
      for (var j=0; j<4; j++){
        act.weather[i][j] = 0;
      }
    }
    act.answered = 0;
    ge('answered').innerHTML = sformat("Μαθητές που απάντησαν: {}",act.answered);
}

function nextPage(){
  act.page = (act.page+1)%4;

  ge('pagenum').innerHTML = sformat('{}/4',act.page + 1);
  for (var i=0; i<4; i++){
    ge(sformat('page{}',i)).style.display = "none";
  }
  ge(sformat('page{}',act.page)).style.display = "inline";


  for (var i=0; i<7; i++){
    for (var j=0; j<4; j++){
      if (act.weather[act.page*7+i][j] == 1){
        act.cells[i][j].innerHTML = sformat("<img id='im{}{}' src='resource/checkmark.svg'/>",i,j);
      }
      else{
        act.cells[i][j].innerHTML = ""; 
      }
    }
  }
}
function previousPage(){
  act.page = (act.page+3)%4;

  ge('pagenum').innerHTML = sformat('{}/4',act.page + 1);
  for (var i=0; i<4; i++){
    ge(sformat('page{}',i)).style.display = "none";
  }
  ge(sformat('page{}',act.page)).style.display = "inline";

  for (var i=0; i<7; i++){
    for (var j=0; j<4; j++){
      if (act.weather[act.page*7+i][j] == 1){
        act.cells[i][j].innerHTML = sformat("<img id='im{}{}' src='resource/checkmark.svg'/>",i,j);
      }
      else{
        act.cells[i][j].innerHTML = ""; 
      }
    }
  }
}
function drawBC(){
  var colors = ['#fa5562','#f1a176','#9fd77a','#6bca6c'];
  var svg = ge('bc');
  while (svg.lastChild) {
    svg.removeChild(svg.lastChild);
  }

  daysOfWeather = [];
  for (var j = 0; j < 4; j++) {
      daysOfWeather.push(0);
      for (i = 0; i < 28; i++){
        daysOfWeather[j] += act.weather[i][j];
      }
  }
  var svgns = "http://www.w3.org/2000/svg";
  
  var maxDays = daysOfWeather.reduce(function(a,b){return(Math.max(a,b))});
  if (maxDays<4){maxDays = 4;}

  for (var j = 0; j < 4; j++) {
      for (i = 0; i <daysOfWeather[j]; i++){
        var rect = document.createElementNS(svgns, 'rect');
        rect.setAttributeNS(null, 'x', sformat('{}em',0.1 + j*5 + 0.15*j));
        rect.setAttributeNS(null, 'y', sformat('{}em',22-((i+1)/maxDays)*22));
        rect.setAttributeNS(null, 'height', sformat('{}em',22/maxDays));
        rect.setAttributeNS(null, 'width', sformat('5em'));
        rect.setAttributeNS(null, 'fill', colors[j]);
        rect.setAttributeNS(null, 'stroke', '#aaaaaa');
        rect.setAttributeNS(null, 'stroke-width', '0.1em')
        svg.appendChild(rect);
      }
  }
}

function cellIndex(obj,isImage){
  if (isImage){
    rowString = obj.id[2];
    row = parseInt(rowString);
    colString = obj.id[3];
    col = parseInt(colString);
    return([row,col]);
  }
  else{
    rowString = obj.id[1];
    row = parseInt(rowString);
    colString = obj.id[2];
    col = parseInt(colString);
    return([row,col]);
  }
}

function cellClick(event){
  var cellij;
  if (event.target.tagName.toUpperCase() == 'IMG'){
    cellij = cellIndex(event.target,true);
  }
  else{
    cellij = cellIndex(event.target,false);
  }

  var i = cellij[0];
  var j = cellij[1];
  if (act.weather[act.page*7+i][j] == 1){
    act.cells[i][j].innerHTML = "";
    act.weather[act.page*7 + i][j] = 0;
    act.answered -= 1;
    ge('answered').innerHTML = sformat("Μαθητές που απάντησαν: {}",act.answered);
  }
  else{//remember to erase the other 1 if it's there
    for (var k=0; k<4; k++){
      if ((act.weather[act.page*7+i][k] == 1) && k!=j){
        act.weather[act.page*7+i][k] = 0;
        act.cells[i][k].innerHTML = "";
        act.answered -= 1;
      }
    }
    act.cells[i][j].innerHTML = sformat("<img id='im{}{}' src='resource/checkmark.svg'/>",i,j);
    act.weather[act.page*7+i][j] = 1;
    act.answered += 1;
    ge('answered').innerHTML = sformat("Μαθητές που απάντησαν: {}",act.answered);
  }
}
function init() {
  var i,j;
  act = {
    answered: 0,
    weather: [[0,0,0,0],
              [0,0,0,0],
              [0,0,0,0],
              [0,0,0,0],
              [0,0,0,0],
              [0,0,0,0],
              [0,0,0,0],
              [0,0,0,0],
              [0,0,0,0],
              [0,0,0,0],
              [0,0,0,0],
              [0,0,0,0],
              [0,0,0,0],
              [0,0,0,0],
              [0,0,0,0],
              [0,0,0,0],
              [0,0,0,0],
              [0,0,0,0],
              [0,0,0,0],
              [0,0,0,0],
              [0,0,0,0],
              [0,0,0,0],
              [0,0,0,0],
              [0,0,0,0],
              [0,0,0,0],
              [0,0,0,0],
              [0,0,0,0],
              [0,0,0,0]],
    cells: [],
    page: 0
  }
  for (i=0; i<7; i++){
    act.cells.push([])
    for (j=0; j<4; j++){      
      act.cells[i].push(ge(sformat('i{}{}',i,j)));
      act.cells[i][j].onclick = cellClick;
      act.cells[i][j].innerHTML = "";
    }
  }
  // Internal level number is zero-based; but we display it as 1-based.
  // We allow/fix newLevel if it's outside its proper range.
  onResize();
  // Create a <style> element for animations, to avoid CORS issues on Chrome
  // TODO: dynamically? document.head.appendChild(document.createElement('style'));
  // Install event handlers
  document.body.onresize = onResize;
  ge('bar_home').onclick = onHome;
  ge('bar_help').onclick = onHelp;
  ge('help').onclick = onHelpHide;
  ge('bar_about').onclick = onAbout;
  ge('bar_fullscreen').onclick = onFullScreen;
  ge('bar_reset').onclick = reset;
  ge('bar_graph').onclick = drawBC;
  ge('pagenum').innerHTML = sformat("{}/4",act.page + 1);
  ge('npButton').onclick = nextPage;
  ge('ppButton').onclick = previousPage;
  for (i = 0; i < document.images.length; i += 1) {
    document.images[i].ondragstart = doPreventDefault;
  }
}

window.onerror = onError;
window.onload = init;
// Call onResize even before the images are loaded
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', onResize);
} else {  // `DOMContentLoaded` already fired
  onResize();
}
