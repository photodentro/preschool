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

function openPage(pageName, elmnt) {
  var i, tabcontent, tablinks;
  tabcontent = document.getElementsByClassName("tabcontent");
  for (i = 0; i < tabcontent.length; i++) {
    tabcontent[i].style.display = "none";
  }
  tablinks = document.getElementsByClassName("tablink");
  for (i = 0; i < tablinks.length; i++) {
    tablinks[i].style.backgroundColor = "Transparent";
  }
  ge(pageName).style.display = "block";
  elmnt.style.backgroundColor = "#e6e6e6";
}

function doPreventDefault(event) {
  event.preventDefault();
}

function onHome(event) {
  window.history.back();
}

function onHelp(event) {
  ge('help').style.display = 'flex';
  ge('helpaudio').play();
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

function onPrevious(event) {
  initLevel(act.level - 1);
}

function onNext(event) {
  initLevel(act.level + 1);
}

function initLevel(newLevel) {
  act.level = (newLevel + act.numLevels) % act.numLevels;
  ge('level').innerHTML = act.level+1;
  ge('defaultOpen').click();
  ge('narration').src = 'resource/narration' + act.level + '.mp3';
  ge('description').innerHTML = act.descriptions[act.level];
  // ge('monster').style.background = "white url('resource/monster0.svg') no-repeat center center";
  ge('monster').setAttribute('style', "    background: white url('resource/monster" + act.level + ".svg') no-repeat center center;    -webkit-background-size: contain;    -moz-background-size: contain;    -o-background-size: contain;    background-size: contain;    box-sizing: border-box;");
}

function initActivity() {
  act = {
    level: 0,
    numLevels: 15,
    descriptions: [
      '<h2>Τερατάκι 1</h2><p>Είναι στρογγυλό και μαλλιαρό, έχει ένα μάτι, βγάζει τη γλώσσα του και είναι πορτοκαλί.</p>',
      '<h2>Τερατάκι 2</h2><p>Μοιάζει με πατάτα, έχει δύο μάτια, έχει δύο μπλε κεραίες και μέσα από το στόμα του φαίνονται τα δόντια του.</p>',
      '<h2>Τερατάκι 3</h2><p>Μοιάζει με σύννεφο, είναι μωβ, έχει δύο πράσινα κερατάκια, έχει δύο μάτια και μέσα από το στόμα του φαίνονται τα δόντια του.</p>',
      '<h2>Τερατάκι 4</h2><p>Είναι στρογγυλό, είναι γαλάζιο, έχει δύο κεραίες, έχει δύο πορτοκαλί φτερά, έχει μόνο ένα μάτι και δύο μεγάλα στρογγυλά δόντια.</p>',
      '<h2>Τερατάκι 5</h2><p>Είναι στρογγυλο και μπλε. Έχει τρία μάτια, λίγα κίτρινα μαλλιά, δύο άσπρα κερατάκια, χαμογελάει και μέσα από το στόμα του φαίνονται τρία δόντια.</p>',
      '<h2>Τερατάκι 6</h2><p>Είναι πράσινο και τα μάτια του είναι σαν τηλεσκόπιο. Φοράει ένα κίτρινο στέμμα, έχει έξι πράσινες τρίχες και δύο μεγάλα μυτερά δόντια.</p>',
      '<h2>Τερατάκι 7</h2><p>Μοιάζει με μία σταγόνα νερού, είναι ροζ και είναι λυπημένο, έχει δύο μάτια και δύο δόντια. Τα μαλλιά του είναι κίτρινα και φουντωντά.</p>',
      '<h2>Τερατάκι 8</h2><p>Είναι στρογγυλό και μπλε.  Έχει μάτια σαν σαλιγκάρι, τα μαλλιά του είναι σκούρα μπλε και μοιάζουν με καρφάκια. Έχει ένα μεγάλο στόμα και χαμογελάει. Ανάμεσα στα 4 δόντα του έχει κενό.</p>',
      '<h2>Τερατάκι 9</h2><p>Είναι  γκρι και μοιάζει με βάτραχο, έχει δύο μεγάλα μάτια, κίτρινα μαλλιά και ένα μεγάλο στραβό χαμόγελο με τρία δόντια.</p>',
      '<h2>Τερατάκι 10</h2><p>Μοιάζει με σκουφάκι, είναι κόκκινο έχει ένα μάτι μικρό και από πάνω ένα πιο μεγάλο.  Μέσα από το στόμα του φαίνονται 4 μυτερά δόντια. Τα μαλλιά του είναι κίτρινα και φουντωτά.</p>',
      '<h2>Τερατάκι 11</h2><p>Είναι κίτρινο, έχει ένα μεγάλο καρούμπαλο και πάνω στο καρούμπαλο έχει πράσινα μαλλιά. Τα μάτια του είναι σαν σαλιγκάρι. Το στόμα του είναι στραβό και έχει μόνο ένα μεγάλο δόντι.</p>',
      '<h2>Τερατάκι 12</h2><p>Μοιάζει με μικρό κουτί, είναι λαχανί, και έχει τρία μάτια σαν σαλιγκαριού. Έχει κίτρινα μουστάκια δεξιά και αριστερά και μια μεγάλη κόκκινη γλώσσα.</p>',
      '<h2>Τερατάκι 13</h2><p>Μοιάζει με κάλτσα και είναι μπλε. Έχει δύο μεγάλα μάτια, έξι κίτρινες τρίχες και ένα στρογγυλό ανοιχτό στόμα με δύο μικρά στραβά δόντια.</p>',
      '<h2>Τερατάκι 14</h2><p>Είναι μπλε και μοιάζει με αστέρι. Έχει πέντε μάτια και ένα μωβ μικρό κλειστό στόμα.</p>',
      '<h2>Τερατάκι 15</h2><p>Μοιάζει με ένα φουσκωτό ψάρι και είνα μπλε. Έχει δύο μεγάλα μάτια, κίτρινα μαλλιά και ένα κλειστό στόμα με τρία μυτερά δόντια.</p>',
    ],
  };
  document.body.oncontextmenu = doPreventDefault;
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
}

window.onerror = onError;
window.onload = initActivity;
