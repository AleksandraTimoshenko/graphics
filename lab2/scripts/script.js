'use strict';
window.onload = function () {
    var canvas,
        context,
        x1,
        y1,
        x2,
        y2,
		x1y1 = [],
		x2y2 = [],
		result = [],
		box = [500, 100, 800, 400],
        isDown = false, //flag we use to keep track
        windowHeight,
        windowWidth,
        canvasBackgroundColor = 'whiteSpace';
    
    windowHeight = window.innerHeight;
    windowWidth = window.innerWidth;
    
    canvas = document.getElementById('canvas');
    canvas.height = windowHeight;
    canvas.width = windowWidth;
    
    canvas.style.backgroundColor = canvasBackgroundColor;
    
    context = canvas.getContext('2d');
    
	function drawBox(){
		context.beginPath();
      	context.rect(500, 100, 300, 300);
     	context.fillStyle = 'yellow';
      	context.fill();
      	context.lineWidth = 5;
     	context.strokeStyle = 'black';
     	context.stroke();
	}
	drawBox();
    canvas.onmousedown = function (event) {
        event = event || window.event;

        // Now event is the event object in all browsers.
        GetStartPoints();
    };
    
    canvas.onmouseup = function (event) {
        event = event || window.event;
		result = [];
		x1y1 = [];
		x2y2 = [];
        // Now event is the event object in all browsers.
        GetEndPoints();
        
		console.log(x1);
		console.log(y1);
		console.log(x2);
		console.log(y2);
		
		
		lineclip([[x1, y1], [x2, y2]], // line
							box,
							result);
		console.log(result);
		x1y1 = result[0][0];
		x2y2 = result[0][1];
		console.log("x1y1: " + x1y1);
		console.log("x2y2: " + x2y2);
		x1 = x1y1[0];
		y1 = x1y1[1];
		x2 = x2y2[0];
		y2 = x2y2[1];
		
        context.beginPath();
		//context.arc(x1, y1,5, 0, Math.PI*2);
        context.moveTo(x1, y1);
		//context.arc(event.offsetX, event.offsetY,5, 0, Math.PI*2);
        context.lineTo(x2, y2);
        context.stroke();
    };
    
    
    function GetStartPoints() {
      // This function sets start points
        x1 = event.clientX;
        y1 = event.clientY;
    }
    
    function GetEndPoints() {
      // This function sets end points
        x2 = event.clientX;
        y2 = event.clientY;
    }
	
	// intersect a segment against one of the 4 lines that make up the bbox

function intersect(a, b, edge, bbox) {
    return edge & 8 ? [a[0] + (b[0] - a[0]) * (bbox[3] - a[1]) / (b[1] - a[1]), bbox[3]] : // top
        edge & 4 ? [a[0] + (b[0] - a[0]) * (bbox[1] - a[1]) / (b[1] - a[1]), bbox[1]] : // bottom
        edge & 2 ? [bbox[2], a[1] + (b[1] - a[1]) * (bbox[2] - a[0]) / (b[0] - a[0])] : // right
        edge & 1 ? [bbox[0], a[1] + (b[1] - a[1]) * (bbox[0] - a[0]) / (b[0] - a[0])] : null; // left
}

// bit code reflects the point position relative to the bbox:

//         left  mid  right
//    top  1001  1000  1010
//    mid  0001  0000  0010
// bottom  0101  0100  0110

function bitCode(p, bbox) {
    var code = 0;

    if (p[0] < bbox[0]) code |= 1; // left
    else if (p[0] > bbox[2]) code |= 2; // right

    if (p[1] < bbox[1]) code |= 4; // bottom
    else if (p[1] > bbox[3]) code |= 8; // top

    return code;
}

// Cohen-Sutherland line clippign algorithm, adapted to efficiently
// handle polylines rather than just segments

const lineclip = function (points, bbox, result) {

    var len = points.length,
        codeA = bitCode(points[0], bbox),
        part = [],
        i, a, b, codeB, lastCode;

    if (!result) result = [];

    for (i = 1; i < len; i++) {
        a = points[i - 1];
        b = points[i];
        codeB = lastCode = bitCode(b, bbox);

        while (true) {

            if (!(codeA | codeB)) { // accept
                part.push(a);

                if (codeB !== lastCode) { // segment went outside
                    part.push(b);

                    if (i < len - 1) { // start a new line
                        result.push(part);
                        part = [];
                    }
                } else if (i === len - 1) {
                    part.push(b);
                }
                break;

            } else if (codeA & codeB) { // trivial reject
                break;

            } else if (codeA) { // a outside, intersect with clip edge
                a = intersect(a, b, codeA, bbox);
                codeA = bitCode(a, bbox);

            } else { // b outside
                b = intersect(a, b, codeB, bbox);
                codeB = bitCode(b, bbox);
            }
        }

        codeA = lastCode;
    }

    if (part.length) result.push(part);

    return result;
}
	
};

