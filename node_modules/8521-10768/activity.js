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

function doPreventDefault(event) {
  event.preventDefault();
}

function onHome(event) {
  window.history.back();
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

function initActivity() {
  document.body.oncontextmenu = doPreventDefault;
  ge('bar_home').onclick = onHome;
  ge('bar_about').onclick = onAbout;
  ge('bar_fullscreen').onclick = onFullScreen;
  for (i = 0; i < document.images.length; i += 1) {
    document.images[i].ondragstart = doPreventDefault;
  }
}

window.onerror = onError;
window.onload = initActivity;
