/*spreadsheet.js
  using 
  jquery.jexcel.js
  jquery.jcalendar.js
  Chart.bundle.min.js
  jquery.print.js*/

window.onload = init;



var labelsArr = [];
var dataArr = [];
var colorDict = {};
var distinctColor = ["Navy", "Red", "Green", "Yellow", "Blue", "Orange", "Purple", "Cyan", "Magenta", "Lime", 
  "Pink", "Teal", "Lavender", "Brown", "Beige", "Maroon", "Mint", "Olive", "Coral",  "Grey",];
var distinctColorIndex = 0;

function getColors(){
    var colorArray = [];
    for (var i=0; i<labelsArr.length; i++){
        colorArray.push(colorDict[labelsArr[i]]);
    }
    return(colorArray);
}


function redraw(cType){
    console.log(colorDict);
    /*avoid showing old data*/
    $("#chart-container").empty();
    $("#chart-container").html("<canvas id='myChart'>Your browser does not support HTML5</canvas>");
    ctx = document.getElementById("myChart");

    var data = $('#my').jexcel('getData', false);
    labelsArr = [];
    dataArr = [];
    data.forEach(function(item){
      labelsArr.push(item[0]);
      if (!colorDict[item[0]]){//if there is no color, assign next distinct color
        colorDict[item[0]] = distinctColor[distinctColorIndex];
        distinctColorIndex = (distinctColorIndex + 1)%distinctColor.length;
      }//if there is a colordict getColors will fetch when needed
      dataArr.push(item[1]);
    });

    cOptions = {};
    cOptions['bar'] = {
            animation:{
                onComplete: function(animation){
                        $("#printImg").attr('src', this.toBase64Image());
                }
            },
            legend: {
                display: false,
                
            },
            title: {
                display: true,
                fontColor: 'black',
                fontSize: 24,
                text: $('#title').val(),
            },
            showTooltips: false,
            scales: {
                yAxes: [{
                    gridLines: {//lineWidth: 5,
                                color: 'black'},
                    ticks: {
                        beginAtZero:true,
                        
                    }
                }],
                xAxes: [{
                    gridLines: {color: 'black'},
                    ticks: {fontColor: 'black'},

                }]
            }
        }
    cOptions['pie'] =  {animation:{
                onComplete: function(animation){
                        $("#printImg").attr('src', this.toBase64Image());
                }
            },
            legend: {
                display: false,
                
            },
            title: {
                display: true,
                fontColor: 'black',
                fontSize: 24,
                text: $('#title').val(),
            },
            showTooltips: false,
        }

    var myChart = new Chart(ctx, {
        type: cType,
        data: {
            labels: labelsArr,
            datasets: [{
                data: dataArr,
                backgroundColor: getColors(),
            }],
        },
        options: cOptions[cType]
    });

}

function init(){
    data = [
        [' ', 0],
    ];

    $('#my').jexcel({
        data:data,
        //onchange: function(){redraw();},
        colHeaders:  ['Είδος', 'Ποσότητα'],
        colWidths: [ 320, 80 ],
        columns: [
            { type: 'text'},
            { type: 'numeric' },
        ]
    });
    redraw('pie');
}
$('#title').change(function(){//redraw();
  });

function insertRow(){
    $('#my').jexcel('insertRow', 1);
}

function deleteRow(){
    var data = $('#my').jexcel('getData', false);
    $('#my').jexcel('deleteRow', data.length-1);
    //redraw();
}

function sortAsc(){
    $('#my').jexcel('orderBy',1,2);
    //redraw();
}

function sortDesc(){
    $('#my').jexcel('orderBy',1,1);
    //redraw();
}

function printDiv(){
    $('#printArea').css("display","block");
    newWin = window.open("",width=595,height=842);
    newWin.document.write($('#printArea').html());
    newWin.print();
    $('#printArea').css("display","none");
}

function redojexcel(){
    $('#my').jexcel('redo');
    //redraw();
}
function undojexcel(){
    $('#my').jexcel('undo');
    //redraw();
}