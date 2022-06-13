const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

canvas.width = 500;
canvas.height = 500;
cwCenter = canvas.width / 2;
chCenter = canvas.height / 2;
var w = canvas.width
var h = canvas.height

const colors = ['#2a9d8f', '#e9c46a', '#f4a261', '#e76f51'];

let mouse = {
  x: cwCenter,
  y: chCenter,
};

// Get distance between two pionts
function getDistance(x1, y1, x2, y2) {
  let distance = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
  return distance;
}

// Get mouse position based on canvas size
function getMousePosition(canvas, event) {
  let rect = canvas.getBoundingClientRect();
  mouse.x = event.clientX - rect.left;
  mouse.y = event.clientY - rect.top;
}

let mousedown = false;
canvas.addEventListener('mousedown', function (e) {
  mousedown = true;
  getMousePosition(canvas, e);
});
canvas.addEventListener('mouseup', function (e) {
  mousedown = false;
});
canvas.addEventListener('mousemove', function (e) {
  if (mousedown) {
    getMousePosition(canvas, e);
  }
});
 
  ctx.save();
  ctx.fillStyle = '#FFFFFF';
  ctx.rect(0, 0, w, h);
  ctx.fill();
  ctx.restore();

 
	function draw (points) {
  	ctx.beginPath();
    ctx.fillStyle = '#000';
    for (let i = 0, step = 0.001; i <= 1; i += step) {
      let [x, y] = getPointOnCurve(points, i);
      ctx.arc(x, y, 1, 0, 2 * Math.PI);
    }
    //ctx.fill();
  }

	/**
  * de Casteljau algorithm
  */
  function getPointOnCurve(points, t) {
    const len = points.length;
    if (len === 1) {
      return points[0];
    } else {
      let p = [];
      for (let i = 0; i < len - 1; i++) {
        const p1 = points[i],
          		p2 = points[i + 1];
        p.push([
          (1 - t) * p1[0] + t * p2[0],
          (1 - t) * p1[1] + t * p2[1]
        ]);
      }
      return getPointOnCurve(p, t);
    }
  }
  
  /**
  * de Casteljau split algorithm
  */
  function splitCurve(points, t, l, r) {
  	l.push(points[0]);
    r.push(points[points.length - 1]);
    
    if (points.length > 1) {
    	let p = [];
    	for (let i = 0; i < points.length - 1; i++) {
      	const p1 = points[i],
          		p2 = points[i + 1];
        p.push([
          (1 - t) * p1[0] + t * p2[0],
          (1 - t) * p1[1] + t * p2[1]
        ]);
    	}
      return splitCurve(p, t, l, r);
    }
  }

let guides = true;

// Main class
class CubicCurve {
  constructor(
    x1,
    y1,
    x2,
    y2,
    c1x,
    c1y,
    c2x,
    c2y,
    thickness,
    color,
    disMargin,
    guide
  ) {
    this.x1 = x1;
    this.y1 = y1;
    this.x2 = x2;
    this.y2 = y2;
    this.c1x = c1x;
    this.c1y = c1y;
    this.c2x = c2x;
    this.c2y = c2y;
    this.thickness = thickness;
    this.color = color;
    this.disMargin = disMargin;
    this.guide = guide;
  }

  draw() {
    // Cubic Bézier curve
    ctx.beginPath();
    //ctx.moveTo(this.x1, this.y1);
	
	const curvePoints = [
    [this.x1, this.y1],
    [this.c1x, this.c1y],
    [this.c2x, this.c2y],
    [this.x2, this.y2]
	];
	let l = [], r = [];
	splitCurve(curvePoints, 1, l, r);
	draw(l);

	
    //ctx.bezierCurveTo(this.c1x, this.c1y, this.c2x, this.c2y, this.x2, this.y2);
    ctx.lineWidth = 2 * this.thickness;
    ctx.strokeStyle = this.color;
    ctx.stroke();

    // Start and end points
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.x1, this.y1, this.thickness, 0, 2 * Math.PI); // Start point
    ctx.arc(this.x2, this.y2, this.thickness, 0, 2 * Math.PI); // End point
    ctx.fill();

    // Control point
    ctx.fillStyle = 'red';
    ctx.beginPath();
    ctx.arc(this.c1x, this.c1y, 5, 0, 2 * Math.PI);
    ctx.arc(this.c2x, this.c2y, 5, 0, 2 * Math.PI);
    ctx.fill();

    // Guides
    if (this.guide) {
      ctx.beginPath();
      ctx.moveTo(this.x1, this.y1);
      ctx.lineTo(this.c1x, this.c1y);
      ctx.lineTo(this.c2x, this.c2y);
      ctx.lineTo(this.x2, this.y2);
      ctx.lineWidth = this.thickness / 3;
      ctx.strokeStyle = colors[0];
      ctx.stroke();
    }
  }

  update() {
    if (getDistance(mouse.x, mouse.y, this.c1x, this.c1y) < disMargin) {
      this.c1x = mouse.x;
      this.c1y = mouse.y;
      mousedown === true ? (disMargin = 100) : (disMargin = 10);
    } else if (getDistance(mouse.x, mouse.y, this.c2x, this.c2y) < disMargin) {
      this.c2x = mouse.x;
      this.c2y = mouse.y;
      mousedown === true ? (disMargin = 100) : (disMargin = 10);
    }
  }
}

let width = 10;
let x1 = 100;
let x2 = 400;
let y1 = 250;
let y2 = 250;
let c1x = 200;
let c1y = 50;
let c2x = 300;
let c2y = 450;
let thickness = 1;
let disMargin = 10;
let point = new CubicCurve(
  x1,
  y1,
  x2,
  y2,
  c1x,
  c1y,
  c2x,
  c2y,
  thickness,
  colors[0],
  disMargin,
  false
);

const guideBtn = document.querySelector('#guide');
guideBtn.addEventListener('change', function () {
  if (this.checked) {
    point.guide = true;
  } else {
    point.guide = false;
  }
});

function animate() {
  requestAnimationFrame(animate);
  ctx.fillStyle = 'rgba(255, 255, 255)';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  point.draw();
  point.update();
}

animate();