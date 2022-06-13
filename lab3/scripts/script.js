function setup() {
  createCanvas(512,512);
  background(255);
}

var x0 = -1;
var y0 = -1;
var x1 = -1;
var y1 = -1;
var vScale = 20;

function set_pixel(x,y,c) {
  set(x, y, c);
}

function draw_line() {
  
  var dx = Math.abs(x1-x0);
  var dy = Math.abs(y1-y0);
  
  var s1 = Math.sign(x1-x0);
  var s2 = Math.sign(y1-y0);
  
  var swap = 0;
  
  if(dy > dx){
    var temp = dx;
    dx = dy;
    dy = temp;
    swap = 1;
  }
  
  var dyCut = dy<<1;
  var dxCut = dx<<1;
  
  var D = dyCut - dx;
  
  for(var i = 0; i < dx; i++){
    
    set_pixel(x0, y0, 10);
    
    while (D >= 0){
      D -= dxCut;
      swap ? x0 += s1 : y0 += s2;
    }
    
    D += dyCut;
    swap ? y0 += s2 : x0 += s1;
    
  }
  
}

function mousePressed() {
  x0 = mouseX;
  y0 = mouseY;
}

function mouseDragged() {  
  x1 = mouseX;
  y1 = mouseY;  
  background(255);
  noStroke();
  fill('red');
  ellipse(x0-3,y0-3,6);
  fill('green');  
  ellipse(x1-3,y1-3,6);
}


function mouseReleased() {
  background(255);
  loadPixels();
	//rect(x * vScale + startingPoint, y * vScale + startingPoint, vScale, vScale);
  draw_line();
  updatePixels();
}
