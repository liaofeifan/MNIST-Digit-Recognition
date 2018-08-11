var clickX = new Array();
var clickY = new Array();
var dragClick = new Array();
var size = 1;

var canvas;
var canvasElem;

$(document).ready(function(){
    canvas = document.getElementById("drawingCanvas").getContext("2d");
    canvasElem = document.getElementById("drawingCanvas");

    console.log("loaded cavnas js");
    
    width = canvasElem.getBoundingClientRect().width;
    height = canvasElem.getBoundingClientRect().height;
    // width = 28;
    // height = 28;
    
    canvas.canvas.width = width;
    canvas.canvas.height = height;

    canvas.fillRect(0,0, canvas.canvas.width, canvas.canvas.height);
    
    var paint;
    
    $("#drawingCanvas").mousedown(function(e){
        var mouseX = e.pageX - this.offsetLeft;
        var mouseY = e.pageY - this.offsetTop;
        
        paint = true;
        addClick(e.pageX - this.offsetLeft, e.pageY - this.offsetTop);
        redraw(canvas);
    });
    
    $("#drawingCanvas").mousemove(function(e){
        if(paint){
            addClick(e.pageX - this.offsetLeft, e.pageY - this.offsetTop, true);
            redraw(canvas);
        }
    });
    
    $("#drawingCanvas").mouseup(function (e){
        paint = false;
    });
    
    $("#drawingCanvas").mouseleave(function (e){
        paint = false;
    });
    
    function addClick(x, y, dragging){
        clickX.push(x);
        clickY.push(y);
        dragClick.push(dragging);
    }
});

function redraw(theCanv){
    theCanv.clearRect(0, 0, theCanv.canvas.width, theCanv.canvas.height);
    canvas.fillRect(0, 0, canvas.canvas.width, canvas.canvas.height);

    theCanv.lineJoin = "round";
    theCanv.lineWidth = size; 
    theCanv.strokeStyle = "white";

    for(let i = 0; i < clickX.length; i++){
        theCanv.beginPath();
        if(dragClick[i] && i){
            theCanv.moveTo(clickX[i-1], clickY[i-1]);
        }else{
            theCanv.moveTo(clickX[i]-1, clickY[i]-1);
        }
        theCanv.lineTo(clickX[i], clickY[i]);

        theCanv.closePath();
        theCanv.stroke();
    }
}

function resize(scale){
    currentwidht = canvasElem.width;
    currentheight = canvasElem.height;
    ratioW = currentwidht / scale;
    ratioH = currentheight / scale;

    for(let i = 0; i < clickX.length; i++){
        clickX[i] = Math.floor(clickX[i] / ratioW);
        clickY[i] = Math.floor(clickY[i] / ratioH);
    }
}

function clear(){
    canvas.clearRect(0,0, canvas.canvas.width, canvas.canvas.height);
    clickX = [];
    clickY = [];
    dragClick = [];   
}

function convert(canv){
    var imagedata = canv.getImageData(0,0, canv.canvas.width, canv.canvas.height);
    var data = imagedata.data;

    for(let i=0; i<imagedata.data.length;i+=4){
        var alpha = data[i+3];
        if(alpha > 90){
            alpha = alpha;
            data[i+3] = alpha;
        }
        else{
            alpha = 0;
            data[i+3] = 255;
        }
        data[i] = alpha;
        data[i + 1] = alpha;
        data[i + 2] = alpha;
    }
    canv.putImageData(imagedata, 0, 0);
}

function changesize(num){
    document.getElementById('one').classList.remove("font-weight-bold");
    document.getElementById('one').style.fontSize = '1.75rem';
    document.getElementById('two').classList.remove("font-weight-bold");
    document.getElementById('two').style.fontSize = '1.75rem';
    document.getElementById('three').classList.remove("font-weight-bold");
    document.getElementById('three').style.fontSize = '1.75rem';
    document.getElementById('four').classList.remove("font-weight-bold");
    document.getElementById('four').style.fontSize = '1.75rem';
    document.getElementById('five').classList.remove("font-weight-bold");
    document.getElementById('five').style.fontSize = '1.75rem';

    size = num;
}