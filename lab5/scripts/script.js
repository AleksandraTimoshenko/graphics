var canvas=document.getElementById("canvas");
var context=canvas.getContext("2d");
var cw=canvas.width;
var ch=canvas.height;

function reOffset(){
  var BB=canvas.getBoundingClientRect();
  offsetX=BB.left;
  offsetY=BB.top;        
}

var offsetX,offsetY;
reOffset();
window.onscroll=function(e){ reOffset(); }

context.lineWidth=2;
context.strokeStyle='blue';

var coordinates = [];
var isDone=false;

$('#done').click(function(){
  isDone=true;
});

$("#canvas").mousedown(function(e){
	handleMouseDown(e);
	fillPolygon();

});

function clear(){
	context.fillStyle = "white";
	context.fillRect(0, 0, canvas.width, canvas.height);
	context.fillStyle = "black";
}
clear();

function handleMouseDown(e){
  if(isDone || coordinates.length>10){return;}

  // tell the browser we're handling this event
  e.preventDefault();
  e.stopPropagation();

  mouseX=parseInt(e.clientX-offsetX);
  mouseY=parseInt(e.clientY-offsetY);
  coordinates.push({x:mouseX,y:mouseY});
  drawPolygon();
}

var i = 0, pFirst, p1, p2;
const lines = createLines()

function drawPolygon(){
	context.clearRect(0,0,cw,ch);
	clear();
	
	context.beginPath();
	context.lineWidth = 1;
		context.strokeStyle = 'black';
	context.moveTo(coordinates[0].x, coordinates[0].y);
	for(index=1; index<coordinates.length;index++) {
	context.lineTo(coordinates[index].x, coordinates[index].y);
	}
	
	p2 = P2(coordinates[coordinates.length-1].x, coordinates[coordinates.length-1].y);
	if (pFirst === undefined) { pFirst = p2 };
	if (p1 !== undefined) { lines.addLine(L2(p1, p2)) }
	p1 = p2;
	
	context.closePath();
	context.stroke();
}

var isFill=false;

$('#fill').click(function(){
  isFill=true;
});

var imgData = context.getImageData(0,0,canvas.width,canvas.height);
// { data: [r,g,b,a,r,g,b,a,r,g,..], ... }

// После нажатия на кнопку fill надо так же нажать и на canvas, чтобы сработала функция
function fillPolygon(){
	if(!isFill){return;}
	lines.addLine(L2(p2, pFirst));// по хорошему это должно быть  когда Lines закончится строиться в методе drawPolygon, в конце
	scanlinePoly(lines, "#000")
	console.log(lines)
}

function setPixel(x, y/*imageData, x, y, r, g, b, a*/) {
    /*var index = 4 * (x + y * imageData.width);
    imageData.data[index+0] = r;
    imageData.data[index+1] = g;
    imageData.data[index+2] = b;
    imageData.data[index+3] = a;*/
	context.beginPath();
	context.fillRect( x, y, 1, 1 );
	context.lineWidth = 1;
	context.strokeStyle = 'black';
    context.stroke();
}

function isBlack(imgData, x, y){
	var pixel = getPixelXY(imgData, x, y);
	//console.log(pixel);
   if(pixel[0]==pixel[1] && pixel[1]==pixel[2] && pixel[2]===0){
      return true
   }
   return false
}

function getPixel(imgData, index) {
  var i = index*4, d = imgData.data;
  return [d[i],d[i+1],d[i+2],d[i+3]] // Returns array [R,G,B,A]
}

// AND/OR

function getPixelXY(imgData, x, y) {
  return getPixel(imgData, y*imgData.width+x);
}

const scanlinePoly = (lines, col) => {
    const b = lines.getBounds();
    var x, y, xx;
    ctx.fillStyle = col;
    b.left = Math.floor(b.left);
    b.top = Math.floor(b.top);
    for (y = b.top; y <= b.bottom; y ++) {
        // update 
        // old line was const ly = lines.getLinesAtY(y).sortLeftToRightAtY(y);
        // changed to
        const ly = lines.getLinesAtY(y + 0.5).sortLeftToRightAtY(y + 0.5);
        x = b.left - 1; 
        while(x <= b.right) {
            const nx1 = ly.nextLineFromX(x);
            if (nx1 !== undefined) {
                const nx2 = ly.nextLineFromX(nx1);
                if (nx2 !== undefined) {
                    const xS = Math.floor(nx1); 
                    const xE = Math.floor(nx2);
					/*
                    for (xx = xS; xx < xE; xx++) {
                        ctx.fillRect(xx, y, 1, 1);
                    }
					*/
					ctx.fillRect(xS, y, xE - xS, 1)
                    x = nx2;
                } else { break }
            } else { break }
        }
    }
}

function createLines(linesArray = []) {
     return   Object.assign(linesArray, {
        addLine(l) { this.push(l) },
        getLinesAtY(y) { return createLines(this.filter(l => atLineLevelY(y, l))) },
        sortLeftToRightAtY(y) {
            for (const l of this) { l.dist = l.p1.x + l.slope * (y - l.p1.y) }
            this.sort((a,b) => a.dist - b.dist);
            return this;
        },
        nextLineFromX(x) { // only when sorted
            const line = this.find(l => l.dist > x);
            return line ? line.dist : undefined;
        },
        getBounds() {
            var top = Infinity, left = Infinity;
            var right = -Infinity,  bottom = -Infinity;
            for (const l of this) {
                top = Math.min(top, l.p1.y, l.p2.y);
                left = Math.min(left, l.p1.x, l.p2.x);
                right = Math.max(right, l.p1.x, l.p2.x);
                bottom = Math.max(bottom, l.p1.y, l.p2.y);
            }
            return {top, left, right, bottom};
        },
    });
}

const createStar = (x, y, r1, r2, points) => {
    var i = 0, pFirst, p1, p2;
    const lines = createLines()
    while (i < points * 2) {
        const r = i % 2 ? r1 : r2;
        const ang = (i / (points * 2)) * Math.PI * 2;
        p2 = P2(Math.cos(ang) * r + x, Math.sin(ang) * r + y);
        if (pFirst === undefined) { pFirst = p2 };
        if (p1 !== undefined) { lines.addLine(L2(p1, p2)) }
        p1 = p2;
        i++;
    }
    lines.addLine(L2(p2, pFirst));    
    return lines;
}
const ctx = canvas.getContext("2d");

const P2 = (x = 0,y = 0) => ({x, y}); // point с 2 параметрами
const L2 = (p1 = P2(), p2 = P2()) => ({p1, p2, slope: (p2.x - p1.x) / (p2.y - p1.y)}); // line с 2-мя параметрами (точками)
const atLineLevelY = (y, l) => l.p1.y < l.p2.y && (y >= l.p1.y && y <= l.p2.y) || (y >= l.p2.y && y <= l.p1.y);
