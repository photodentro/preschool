

  function cubicInt(t, A, B){
      var weight = t*t*(3-2*t);
      return A + weight*(B-A);
  }

  function getR(iR, iY, iB) {
    // red
    var x0 = cubicInt(iB, 1.0, 0.163);
    var x1 = cubicInt(iB, 1.0, 0.0);
    var x2 = cubicInt(iB, 1.0, 0.5);
    var x3 = cubicInt(iB, 1.0, 0.2);
    var y0 = cubicInt(iY, x0, x1);
    var y1 = cubicInt(iY, x2, x3);
    return Math.ceil (255 * cubicInt(iR, y0, y1));
  }

  function getG(iR, iY, iB) {
    // green
    var x0 = cubicInt(iB, 1.0, 0.373);
    var x1 = cubicInt(iB, 1.0, 0.66);
    var x2 = cubicInt(iB, 0.0, 0.0);
    var x3 = cubicInt(iB, 0.5, 0.094);
    var y0 = cubicInt(iY, x0, x1);
    var y1 = cubicInt(iY, x2, x3);
    return Math.ceil (255 * cubicInt(iR, y0, y1));
  }

  function getB(iR, iY, iB) {
    // blue
    var x0 = cubicInt(iB, 1.0, 0.6);
    var x1 = cubicInt(iB, 0.0, 0.2);
    var x2 = cubicInt(iB, 0.0, 0.5);
    var x3 = cubicInt(iB, 0.0, 0.0);
    var y0 = cubicInt(iY, x0, x1);
    var y1 = cubicInt(iY, x2, x3);
    return Math.ceil (255 * cubicInt(iR, y0, y1));
  }
function ryb2rgb(rybsDict,cs){

  var maxClicks = Math.floor(255.0/cs);
  //the black controversy
  if ((rybsDict['R']==maxClicks * cs) 
      && (rybsDict['Y']==maxClicks * cs) 
      && (rybsDict['B']==maxClicks * cs)){
    return('#000000');
  }

  if ((rybsDict['R']== 0) 
      && (rybsDict['Y'] == 0)
      && (rybsDict['B'] == 0)){
    return('#ffffff');
  }


  r = (rybsDict['R']*cs) /255.0;
  y = (rybsDict['Y']*cs) /255.0;
  b = (rybsDict['B']*cs) /255.0;
  rgb_red   = getR(r,y,b);
  rgb_green = getG(r,y,b);
  rgb_blue  = getB(r,y,b);
  
  var rStr = Math.floor(rgb_red).toString(16);
  var gStr = Math.floor(rgb_green).toString(16);
  var bStr = Math.floor(rgb_blue).toString(16);
  if (rStr.length == 1){
    rStr = "0"+rStr;
  }
  if (gStr.length == 1){
    gStr = "0"+gStr;
  }
  if (bStr.length == 1){
    bStr = "0"+bStr;
  }
  var retStr = "#" + rStr + gStr + bStr;
  return(retStr);
}


function getRandomColor(cn,cs){
  //colornum and colorstep
  maxClicks = Math.floor(255.0/cs);
  var ryb = ['R','Y','B'];
  t = {};
  t['R'] = 0;
  t['Y'] = 0;
  t['B'] = 0;    
  for (var i=0; i<cn; i++){
    var ci = Math.floor(ryb.length*Math.random());//color index is 0,1 or 2
    ryb = ryb.splice(ryb[ci]);
    t[ryb[ci]] = Math.round(Math.random()*maxClicks);
}
  return(t);
}