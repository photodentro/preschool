/*
Copyright (C) 2018 Alkis Georgopoulos <alkisg@gmail.com>.
SPDX-License-Identifier: CC-BY-SA-4.0
*/
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

// Return a shuffled copy of the list
// If differentIndex==true, make sure that array[i] != i.
function shuffledArray(list, differentIndex) {
  var result = []; //result is random indexes
  var i;
  var j;
  var temp;

  // Fill the array with [0, ..., num-1]
  for (i = 0; i < list.length; i += 1) {
    result.push(i);
  }
  // Shuffle the array
  for (i = 0; i < list.length; i += 1) {
    j = random(list.length);
    temp = result[i];
    result[i] = result[j];
    result[j] = temp;
  }
  // Make sure that result[i] != i
  if (differentIndex) {
    for (i = 0; i < list.length; i += 1) {
      if (result[i] === i) {
        j = (i + 1) % list.length;
        temp = result[i];
        result[i] = result[j];
        result[j] = temp;
      }
    }
  }
  newList = [];
  for (i=0; i<list.length; i++){
    newList.push(list[result[i]]);
  }
  return newList;
}
function ge(element) {
  return document.getElementById(element);
}

function setAnimation(eleName,aniName,aniDur){
  /* Code for Chrome, Safari, and Opera */
  ge(eleName).classList.add(aniName);
  ge(eleName).style.animationName = aniName;
  ge(eleName).style.animationDuration = aniDur;
}

function onResize(event) {
  var w = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
  var h = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
  if (w / h < 640 / 360) {
    document.body.style.fontSize = sformat('{}px', 10 * w / 640);
  } else {
    document.body.style.fontSize = sformat('{}px', 10 * h / 360);
  }
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
  ge('help').style.display = '';
  ge('audiohelp').pause();
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

function pickCards(n){
  /*n cards for level*/
  cards = [];
  for (var i=0; i<n/2; i++){
    possibleAnimal = random(act.numOfAnimals);
    while (cards.indexOf(possibleAnimal)>=0){
      possibleAnimal = random(act.numOfAnimals);
    }
    cards.push(possibleAnimal);
  }
  return(shuffledArray(cards.concat(cards)));
}

function hideCard(id){
    ge(id).style.display = 'none';
    ge(id).src = 'resource/backcard.svg';
    var aid = 'a' + id;
    ge(aid).style.display = 'none';
}

function hideAllCards(){
  for (var i = 0; i<6; i++){
    for (var j = 0; j<3; j++){
        var id = 'r' + j.toString() + 'c' + i.toString();
        hideCard(id);
    }
  }
}

function openAnimation(animalId,cardId){
      setAnimation(cardId,'flipithide','0.5s');
      setAnimation(animalId,'flipitshow','0.5s');
      setTimeout(function(){
        ge(cardId).src = "resource/emptycard.svg";
        ge(animalId).style.display = "";
        setAnimation(cardId,'flipitshow','0.5s');
      },500);
    }

function onAnimalClick(event){
    var animalId = event.target.id;
    var cardId = animalId.substr(1);
    openCard(animalId,cardId);
}

function onCardClick(event){
  var cardId = event.target.id;
  var animalId = 'a' + event.target.id;
  openCard(animalId,cardId);
}

function openCard(animalId,cardId){
    var animalIndex = ge(animalId).animalIndex;
    if (act.cardsOpen.indexOf(cardId)>=0 || act.lock)
        return;
    ge('a'+animalIndex+'audio').play();
    act.cardsOpen.push(cardId);
    openAnimation(animalId,cardId);
    if (act.cardToCheck == -1){
        act.cardToCheck = animalIndex;
    }
    else{
        if (act.cardToCheck != animalIndex){
            act.lock = true;
            setTimeout(function(){act.lock = false;},2500);
            setTimeout(function(){
                card1 = act.cardsOpen[act.cardsOpen.length-1];
                card2 = act.cardsOpen[act.cardsOpen.length-2];
                closeCard(card1);
                closeCard(card2);
                act.cardToCheck = -1;
            },2000);
        }else{
            if (act.cardsOpen.length == act.tilesNumArr[act.level]){
                setTimeout(success,1000);
        }
        act.cardToCheck = -1;
    }
}
}
function success(){ 
    ge('balloongood').style.display = "block";
    ge('balloongood').style.position = "fixed";
    ge('balloongood').style.marginLeft = "auto";
    ge('balloongood').style.marginRight = "auto";
    ge('balloongood').style.zIndex = 100;
    setAnimation('balloongood','balloon','2s');
    setTimeout(onNext,2000);
}

function closeCard(cardId){
    var animalId = 'a' + cardId;
    act.cardsOpen.splice(act.cardsOpen.indexOf(cardId));
    setAnimation(cardId,'flipithide','0.5s');
    setAnimation(animalId,'flipithide','0.5s');
    
    setTimeout(function(){
      ge(cardId).src = "resource/backcard.svg";
      ge(animalId).style.display = "none";
      setAnimation(cardId,'flipitshow','0.5s');
    },500);
    setTimeout(function(){
      ge(cardId).src = "resource/backcard.svg";
      ge(animalId).style.display = "none";  
      act.canClick = true;
    },1000);
}

function initLevel(newLevel){
  ge('balloongood').style.display = 'none';
  setAnimation('balloongood','reset','0s');
  act.level = (newLevel + act.gridXArr.length) % act.gridXArr.length;
  ge('level').innerHTML = act.level + 1;
  act.cards = pickCards(act.tilesNumArr[act.level]);
  act.cardsOpen = [];
  act.cardToCheck = -1;
  hideAllCards();
  act.canClick = true;
  
  columns = act.gridXArr[act.level];
  rows = act.gridYArr[act.level];
  act.totalCards = rows*columns;
  for (var i = 0; i<columns; i++){
    for (var j = 0; j<rows; j++){
        var id = 'r' + j.toString() + 'c' + i.toString();      
        ge(id).row  = j;
        ge(id).col = i;
        ge(id).style.display = '';
        ge(id).style.padding = sformat('{}em',1/(3*rows));
        ge(id).style.height = sformat('{}em',30 / rows);
        ge(id).onclick = onCardClick;
        var aid = 'a' + id;
        var animalIndex = act.cards[i*rows+j];
        act.cardsOpen = [];
        var audioId = 'audio' + animalIndex;
        ge(aid).audioId = audioId;//attach audio to aid element
        ge(aid).src = ge('a' + animalIndex.toString()).src;
        ge(aid).animalIndex = animalIndex;
        ge(aid).style.width = sformat('{}em',(30 / rows) * 0.5);
        ge(aid).style.top = sformat('{}em',(30 / rows) * 0.1);
        ge(aid).style.left = sformat('{}em',(30 / rows) * 0.1);
        ge(aid).style.display = 'none';
        ge(aid).onclick = onAnimalClick;
    }
  }
}

function initActivity(event){
  act = {  
      // Internal level number is zero-based; but we display it as 1-based.
      // Levels:       0   1    2    3    4  
      // Card layout: 2x3 2x4  2x5  3x4  3x6 
      // Tiles number: 6   8   10   12   18  
      // Cards needed: 3   4    5    6    9  
      level: 0,
      numOfAnimals: 18,
      cards: [],
      openCards: [],
      cardToCheck: -1,
      tilesNumArr: [ 4,  6,  8,  10, 12, 18],
      gridXArr: [ 2,  3,  4,   5,  4,  6],
      gridYArr: [ 2,  2,  2,   2,  3,  3],
      canClick: true,
  };
  ge('balloongood').style.display = 'none';
  ge('bar_home').onclick = onHome;
  ge('bar_help').onclick = onHelp;
  ge('help').onclick = onHelpHide;
  ge('bar_about').onclick = onAbout;
  ge('bar_fullscreen').onclick = onFullScreen;
  ge('bar_previous').onclick = onPrevious;
  ge('bar_next').onclick = onNext;
  //hide everything
  for (var i = 0; i<6; i++){
    for (var j = 0; j<3; j++){
        var id = 'r' + j.toString() + 'c' + i.toString();
        ge(id).style.display = 'none';
    }
  }
  document.body.onresize = onResize;
  initLevel(0);
  onResize();
}

window.onerror = onError;
window.onload = initActivity;
// Call onResize even before the images are loaded
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', onResize);
} else {  // `DOMContentLoaded` already fired
  onResize();
}
