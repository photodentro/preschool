/*
Copyright (C) 2018 Alkis Georgopoulos <alkisg@gmail.com>.
SPDX-License-Identifier: CC-BY-SA-4.0
*/
var act = null;  // activity object, see initActivity()

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


function ge(element) {
  return document.getElementById(element);
}

function setAnimation(eleName,aniName,aniDur){
  // Code for Chrome, Safari, and Opera
  ge(eleName).style.WebkitAnimationName = aniName;
  // Standard syntax
  ge(eleName).style.animationName = aniName;
  ge(eleName).style.animationDuration = aniDur;
}

function onResize(event) {
  var w = window.innerWidth;
  var h = window.innerHeight;
  if (w / h < 16 / 9) {
    document.body.style.fontSize = sformat('{}px', w / (16*5));
  } else {
    document.body.style.fontSize = sformat('{}px', h / (9*5));
  }
}

function doPreventDefault(event) {
  event.preventDefault();
}

function onPrevious(event) {
  initLevel((act.level - 1) % act.numLevels)
}

function onNext(event) {
  initLevel((act.level + 1) % act.numLevels);
}

function onHome(event) {
  window.history.back();
}

function onHelp(event) {
  ge('dialog').style.display = 'flex';
  ge('feedback').style.display = 'none';
  ge('help').style.display = 'flex';
  ge('audiohelp').currentTime = 0;
  ge('audiohelp').play();
}

function onHelpHide(event) {
  ge('audiohelp').pause();
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

function onColorChange(event) {
  ge('combinedlight').style.fill = ryb2rgb(act.workingColor,act.colorStep[act.level]);
}

function changeColor(event,color,add){
  //color is 'R','Y','B'
  //add True for plus False for minus
  var maxClicks = Math.floor(255.0/act.colorStep[act.level]);
  if (!add){
    if (act.workingColor[color] > 0){
      act.workingColor[color] -= 1;
    }
  }
  else{
    if (act.workingColor[color] < maxClicks){
      act.workingColor[color] += 1;
    } 
  }
  onColorChange(event);
}
function onPlusRed(event){
  changeColor(event,'R',true );
}

function onMinusRed(event){
  changeColor(event,'R',false);
}

function onPlusYellow(event){
  changeColor(event,'Y',true );
}

function onMinusYellow(event){
  changeColor(event,'Y',false);
}

function onPlusBlue(event){
  changeColor(event,'B',true );
}

function onMinusBlue(event){
  changeColor(event,'B',false);
}

function onButtonOk(event){
  var msg = "Χρειάζεται:<br/>";
  var cnames = {'R':'κόκκινο','Y':'κίτρινο','B':'μπλε'};
  var enCnames = {'R':'red','Y':'yellow','B':'blue'};
  for (i = 0; i<Object.keys(cnames).length; i++){
    var item = Object.keys(cnames)[i];
    if (act.workingColor[item]<act.targetColor[item]){
      msg += "<div style='color:" + enCnames[item] + ";text-shadow:1px 1px gray'> + " + cnames[item] + "</div><br/>";
    }
    else{
      if (act.workingColor[item]>act.targetColor[item]){
        msg += "<div style='color:" + enCnames[item] + ";text-shadow:1px 1px gray'> - " + cnames[item] + "</div><br/>";
      }
    }
    
  }
  if (ryb2rgb(act.workingColor,act.colorStep[act.level]) != ryb2rgb(act.targetColor,act.colorStep[act.level])){
    ge('dialog').style.display = 'none';
    ge('feedback').innerHTML = msg;
    ge('feedback').style.display = '';
    ge('help').style.display = 'flex';
  }
  else{
    setTimeout(onNext,1000);
    setAnimation('cont','disappear','1s');
    setAnimation('combinedCircle','disappear','1s');
  }
}
function initLevel(newLevel) {
  
  setAnimation('cont','','0s');
  setAnimation('combinedCircle','','0s');

  if (newLevel == 0){
    act.targetColors = [];
  }
  act.level = newLevel;//newLevel is from 0 to max
  ge('level').innerHTML = act.level + 1;
  t = getRandomColor(act.colorNum[act.level],act.colorStep[act.level]);
  while (act.targetColors.indexOf(ryb2rgb(t,act.colorStep[act.level])) >= 0){
    t = getRandomColor(act.colorNum[act.level],act.colorStep[act.level]);
  }
  act.targetColor = t;
  act.targetColors.push(ryb2rgb(t,act.colorStep[act.level]));
  console.log(act.targetColors);
  document.body.style.backgroundColor = ryb2rgb(act.targetColor,act.colorStep[act.level]);
  act.workingColor = {'R':0,'Y':0,'B':0};
  onColorChange();
}


function initActivity() {
  document.body.onresize = onResize;
  document.body.oncontextmenu = doPreventDefault;

  ge('bar_home').onclick = onHome;
  ge('bar_help').onclick = onHelp;
  ge('bar_previous').onclick = onPrevious;
  ge('bar_next').onclick = onNext;  
  ge('help').onclick = onHelpHide;
  ge('bar_about').onclick = onAbout;
  ge('bar_fullscreen').onclick = onFullScreen;
  ge('plusR').onclick = onPlusRed;
  ge('minusR').onclick = onMinusRed;
  ge('plusY').onclick = onPlusYellow;
  ge('minusY').onclick = onMinusYellow;
  ge('plusB').onclick = onPlusBlue;
  ge('minusB').onclick = onMinusBlue;
  ge('buttonOk').onclick = onButtonOk;
  for (i = 0; i < document.images.length; i += 1) {
    document.images[i].ondragstart = doPreventDefault;
  }
  act = {
    level: 0,
    colorStep: [255, 255, 255, 255, 255, 255,125,125,125,125, 75, 75, 75, 75],
    colorNum:  [  1,   1,   2,   2,   3,   3,  2,  2,  3,  3,  2,  3,  3,  3],
    numLevels: 14,
    workingColor: {'R':0,'Y':0,'B':0},
    targetColor: {'R':0,'Y':0,'B':0},
    targetColors : [],
    sheet:  null,
  };
  onColorChange();
  onResize();
  act.sheet = document.styleSheets[0];
  initLevel(act.level);
}

window.onerror = onError;
window.onload = initActivity;
// Call onResize even before the images are loaded
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', onResize);
} else {  // `DOMContentLoaded` already fired
  onResize();
}




