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

function isEmpty(obj){
  return(obj.src.substr(obj.src.length-5)=='l.svg');
}

function generateStock() {
  var i;
  var result = [];  // Those are arrays of objects, not strings
  var imageObjects = [];
  for (i=0; i < act.levels[act.level].length; i++){
    imageObjects.push({$iname:sformat("resource/{}",act.levels[act.level][i]),$ord:i});
  }
  // Shuffle the alphabet so that afterwards the outword chars are shuffled  
  return(shuffle(imageObjects));
}

function ge(element) {
  return document.getElementById(element);
}

function setKeyframes(element, rule, duration) {
  var e = element;
  var i;
  var name = sformat('{}_animation', e.id);

  // The webkit* stuff is for old android webview versions
  e.style.animationName = '';
  e.style.webkitAnimationName = '';
  // First, delete the old animation for this element, if it exists
  for (i = 0; i < act.sheet.cssRules.length; i += 1) {
    if (act.sheet.cssRules[i].name === name) {
      act.sheet.deleteRule(i);
    }
  }
  // Now add the rule
  try {
    act.sheet.insertRule(sformat('@keyframes {} { {} }', name, rule), act.sheet.cssRules.length);
  } catch (err) {
    act.sheet.insertRule(sformat('@-webkit-keyframes {} { {} }', name, rule), act.sheet.cssRules.length);
  }
  void e.offsetWidth;  // https://css-tricks.com/restart-css-animation/
  // IE needs animationDuration before animationName
  e.style.animationDuration = duration || '2s';
  e.style.webkitAnimationDuration = e.style.animationDuration;
  e.style.animationName = name;
  e.style.webkitAnimationName = e.style.animationName;
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

function onPrevious(event) {
  initLevel(act.level - 1);
}

function onNext(event) {
  initLevel(act.level + 1);
}

// HTML5 drag and drop has various issues (e.g. drag image sizing)
// and not wide browser compatibility. So implement our own way.
// Also, make it work with touch events.
function onDown(obj, x, y) {
  act.dragobj = obj;
  ge('dragimg').style.display = 'block';
  ge('dragimg').src = act.dragobj.src;
  onMove(x, y);
}

function onMove(x, y) {
  var dri;

  if (!act.dragobj) {
    return;
  }
  dri = ge('dragimg');
  dri.style.left = sformat('{}px', x - Math.round(dri.clientWidth));
  dri.style.top = sformat('{}px', y - Math.round(dri.clientHeight));
}

function onUp(x, y) {
  var el;
  var dro;

  if (!act.dragobj) {
    return;
  }
  ge('dragimg').style.display = '';
  dro = act.dragobj;
  act.dragobj = null;
  el = document.elementFromPoint(x, y);
  console.log(el);
  if (!(el.className=="dimg")&&!(el.className=="simg")){
    return;
  }
  if (!el || !isEmpty(el)) {
    return;
  }
  el.$ord = dro.$ord;
  el.src = dro.src;
  dro.src = 'resource/l.svg';
  dro.$ord = -1;
  checkLevelOver();
}

function onMouseDown(event) {
  onDown(this, event.pageX, event.pageY);
}

function onDocumentMouseMove(event) {
  onMove(event.pageX, event.pageY);
}

function onDocumentMouseUp(event) {
  onUp(event.pageX, event.pageY);
}

function onTouchStart(event) {
  onDown(this, event.touches[0].clientX, event.touches[0].clientY);
  act.mouseX = event.touches[0].clientX;
  act.mouseY = event.touches[0].clientY;
  if (act.dragobj) {
    event.preventDefault();
  }
}

function onTouchMove(event) {
  onMove(event.touches[0].clientX, event.touches[0].clientY);
  act.mouseX = event.touches[0].clientX;
  act.mouseY = event.touches[0].clientY;
  if (act.dragobj) {
    event.preventDefault();
  }
}

function onTouchEnd(event) {
  if (act.dragobj) {
    event.preventDefault();
  }
  onUp(act.mouseX, act.mouseY);
}

function checkLevelOver() {
  var i;
  for (i = 0; i < act.levels[act.level].length; i += 1) {
    if (act.decrypted[i].$ord !== i) {
      return;
    }
  }


  for (i = 0; i < act.levels[act.level].length; i += 1) {
    setKeyframes(ge(sformat('d{}', i)), [
      sformat('from { transform: rotate({}deg); }', -360 * (2 * (i % 2) - 1)),
      'to { transform: rotate(0deg); }'].join('\n'), '3s');
  }
  setKeyframes(ge('stock'), [
    'from { opacity: 1; }',
    'to { opacity: 0; }'].join('\n'), '4s');
  setTimeout(initLevel, 4000, act.level + 1);
}

function initLevel(newLevel) {
  // Internal level number is zero-based; but we display it as 1-based.
  // We allow/fix newLevel if it's outside its proper range.
  var numLevels = 6;
  var i;

  act.level = (newLevel + numLevels) % numLevels;

  act.sstock = generateStock();

  for (i = 0; i < 5; i += 1) {
    if (i < act.sstock.length){
      act.stock[i].src = act.sstock[i].$iname;
      act.stock[i].$ord = act.sstock[i].$ord;
      act.stock[i].style.display = "";
    }
    else{
      act.stock[i].style.display = "none";
    }
  }
  for (i = 0; i < 5; i += 1){
    if (i < act.sstock.length){
      act.decrypted[i].src = 'resource/l.svg';
      setKeyframes(ge(sformat('d{}', i)), 'none');

      act.decrypted[i].$ord = -1;//you have to fill in the animals to
                                 //change $ord and win
      act.decrypted[i].style.display = "";
    }
    else{
      act.decrypted[i].style.display = "none";
    }
  }
  for (i = 0; i < 4; i += 1){
    if (i < act.sstock.length - 1){
      act.arr[i].style.display = "";
    }
    else{
      act.arr[i].style.display = "none";
    }
  }
  ge('level').innerHTML = act.level + 1;
}

function initActivity() {
  var i;
  ge('loading').style.display = "none";
  act = {
    level: 0,
    giftsNum: -1,
    stock: [],
    decrypted: [],
    arr: [],
    // lvl = 0: 1a, 1b, 1c
    // lvl = 1: 2a, 2b, 2c, 2d
    // lvl = 2: 3a, 3b, 3c, 3d
    // lvl = 3: 4a, 4b, 4c, 4d, 4e
    // lvl = 4: 5a, 5b, 5c ,5d
    // lvl = 5: 6a, 6b, 6c
    levels:  [['1a.jpg','1b.jpg','1c.jpg'],
              ['2a.jpg','2b.jpg','2c.jpg','2d.jpg'],
              ['3a.jpg','3b.jpg','3c.jpg','3d.jpg'],
              ['4a.jpg','4b.jpg','4c.jpg','4d.jpg','4e.jpg'],
              ['5a.jpg','5b.jpg','5c.jpg','5d.jpg'],
              ['6a.jpg','6b.jpg','6c.jpg']
             ],
    sheet: null,
    dragobj: null,
    mouseX: 0,  // The ontouchend event doesn't contain any coords,
    mouseY: 0,  // so we keep the last ontouchmove ones.
  };
  for (i = 0; i < 5; i += 1) {
    act.decrypted.push(ge(sformat('d{}', i)));
    act.decrypted[i].onmousedown = onMouseDown;
    act.decrypted[i].ontouchstart = onTouchStart;
  }
  for (i = 0; i < 4; i += 1) {
    act.arr.push(ge(sformat('ar{}',i)));
  }

  for (i = 0; i < 5; i += 1) {
    act.stock.push(ge(sformat('s{}', i)));
    act.stock[i].onmousedown = onMouseDown;
    act.stock[i].ontouchstart = onTouchStart;
  }
  onResize();
  // Create a <style> element for animations, to avoid CORS issues on Chrome
  act.sheet = document.styleSheets[0];
  // TODO: dynamically? document.head.appendChild(document.createElement('style'));
  // Install event handlers
  document.body.onresize = onResize;
  document.body.oncontextmenu = doPreventDefault;
  document.body.onmousemove = onDocumentMouseMove;
  document.body.onmouseup = onDocumentMouseUp;
  document.body.onmouseleave = onDocumentMouseUp;
  document.body.ontouchmove = onTouchMove;
  document.body.ontouchend = onTouchEnd;
  ge('bar_home').onclick = onHome;
  ge('bar_help').onclick = onHelp;
  ge('help').onclick = onHelpHide;
  ge('bar_about').onclick = onAbout;
  ge('bar_fullscreen').onclick = onFullScreen;
  ge('bar_previous').onclick = onPrevious;
  ge('bar_next').onclick = onNext;
  for (i = 0; i < document.images.length; i += 1) {
    document.images[i].ondragstart = doPreventDefault;
  }
  initLevel(act.level);
  //load all other level images after the first level is shown
  imgs = {1:[],2:[],3:[],4:[],5:[]};
  for (i=1; i<act.levels.length; i++){
    for (var j=0; j<act.levels[i].length; j++){
        imgs[i].push(new Image());
        imgs[i][j].src = sformat('resource/{}',act.levels[i][j]);
    }
}
}

window.onerror = onError;
window.onload = initActivity;
// Call onResize even before the images are loaded
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', onResize);
} else {  // `DOMContentLoaded` already fired
  onResize();
}
