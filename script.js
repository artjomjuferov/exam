$(document).ready(function(){
  window.maxT = 100;
  window.maxColor = "red";
  window.minT = -100;
  window.minColor = "blue";
  window.opacity = 1;

  var canvas = new Canvas('myCanvas');
  window.canvas = canvas;
  var points = createRandomPoints(canvas, 20);
  // points.push([50,50,-10]);
  // points.push([250,50,10]);
  // points.push([250,150,-90]);
  // points.push([5,5,-10]);
  // points.push([20,50,10]);
  // points.push([50,150,-90]);


  $("#imgInput").change(function(){
    canvas.getImageToBg(this);
    var image = new Image();
    image.src = canvas.element.toDataURL("image/png").replace("image/png", "image/octet-stream");
    canvas.bg = image;
  });

  $("#drawPoints").click(function () {
    for (var i = 0; i < points.length; i++) {
      canvas.drawPoint(new Point(points[i][0], points[i][1], points[i][2]));
    }
  });

  $("#triangulate").click(function () {
    var triangules = triangulate(points);
    var cnvs = window.canvas.element;
    var ctx = cnvs.getContext("2d");
    window.imageData = ctx.createImageData(cnvs.width,
        cnvs.height)
    for (var i = 0; i < triangules.length; i++) {
      drawTriangle(cnvs, window.imageData, triangules[i]);
    }
    ctx.putImageData(window.imageData, 0, 0);
  });
});



var triangulate = function(points){
  var vertices = new Array(points.length);
  for (var i = 0; i < points.length; i++) {
    vertices[i] = [points[i][0], points[i][1]]; 
  }
  var triangles = Delaunay.triangulate(vertices);
  var resultTriangles = [];
  for(i = triangles.length; i; ) {
    --i;
    var p1 = [vertices[triangles[i]][0], vertices[triangles[i]][1], points[triangles[i]][2]];
    --i;
    var p2 = [vertices[triangles[i]][0], vertices[triangles[i]][1], points[triangles[i]][2]];
    --i; 
    var p3 = [vertices[triangles[i]][0], vertices[triangles[i]][1], points[triangles[i]][2]];
    resultTriangles.push(new Triangle(p1,p2,p3));
  }
  return resultTriangles;
}

var createRandomPoints = function(canvas, amount){
  var arr = []
  for (var i = 0; i < amount; i++) {
    var x = parseInt(Math.random()*canvas.element.width);
    var y = parseInt(Math.random()*canvas.element.height);
    var z = parseInt((Math.random()-0.5)*100);
    arr.push([x,y,z]);
  };
  return arr;
}

/////////////////////////////////////////////////////////////////////
function Canvas (_id) {
  this.element = document.getElementById(_id);
}
Canvas.prototype.ctx = function() {
  return this.element.getContext('2d');
};
Canvas.prototype.drawSide = function(side) {
  var ctx = this.ctx();
  ctx.beginPath();
  ctx.moveTo(side.p1.x,side.p1.y);
  ctx.lineTo(side.p2.x,side.p2.y);
  ctx.stroke();
};
// Canvas.prototype.drawTriangle = function (triangle, maxT, minT){
//   var ctx = this.ctx();
//   ctx.globalAlpha = window.opacity;
//   ctx.beginPath();
  
//   var minP = triangle[1];
//   var maxP = triangle[0];

//   var gradient = ctx.createLinearGradient(minP.x, minP.y, maxP.x, maxP.y);
  
//   var startG = Math.abs(minP.t-window.minT)/Math.abs(window.maxT-window.minT);  
//   var stopG = Math.abs(maxP.t-window.minT)/Math.abs(window.maxT-window.minT);
  
//   console.log(minP);
//   console.log(maxP);
  
//   gradient.addColorStop(String(startG), window.minColor);
//   gradient.addColorStop(String(stopG), window.maxColor);

//   ctx.moveTo(triangle[0].x,triangle[0].y);
//   ctx.lineTo(triangle[1].x,triangle[1].y);
//   ctx.lineTo(triangle[2].x,triangle[2].y);
  
//   ctx.fillStyle = gradient;
//   ctx.fill();
  
//   ctx.stroke();
//   ctx.restore();
// };

Canvas.prototype.drawPoint = function (point){
  var r = 5;
  var ctx = this.ctx();
  ctx.beginPath();
  ctx.arc(point.x, point.y, r, 0, 2 * Math.PI, false);
  ctx.fill();
  ctx.stroke();
};
Canvas.prototype.clearCanvas = function(){
  var ctx = this.ctx();
  ctx.clearRect(0, 0, this.element.width, this.element.height);
  if (this.backgroung !== undefined){
    ctx.drawImage(this.backgroung, 0, 0);
  }
}
Canvas.prototype.getImageToBg = function(input){
  var img = document.createElement('img');
  var ctx = this.ctx();
  if (input.files && input.files[0]){
    var reader = new FileReader();
    reader.onload = function (e){
      img.src = e.target.result;
      img.height = 300;
      img.width = 500;
      ctx.drawImage(img, 0, 0);
    }
    reader.readAsDataURL(input.files[0]);
  }
  return img;
};