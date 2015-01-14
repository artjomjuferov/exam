$(document).ready(function(){
  window.maxT = 100;
  window.maxColor = "red";
  window.minT = -100;
  window.minColor = "blue";
  window.opacity = 1;

  var canvas = new Canvas('myCanvas');
  
  var points = [];//createRandomPoints(canvas, 20);
  points.push(new Point(50,50,-10));
  points.push(new Point(250,50,10));
  points.push(new Point(250,150,-90));

  $("#imgInput").change(function(){
    canvas.getImageToBg(this);
    var image = new Image();
    image.src = canvas.element.toDataURL("image/png").replace("image/png", "image/octet-stream");
    canvas.bg = image;
  });

  $("#drawPoints").click(function () {
    for (var i = 0; i < points.length; i++) {
      canvas.drawPoint(points[i]);
    }
  });

  $("#triangulate").click(function () {
    var triangules = triangulate(points);
    for (var i = 0; i < triangules.length; i++) {
      canvas.drawTriangle(triangules[i]);
    }
  });
});



var triangulate = function(points){
  var vertices = new Array(points.length);
  for (var i = 0; i < points.length; i++) {
    vertices[i] = [points[i].x, points[i].y]; 
  }

  var triangles = Delaunay.triangulate(vertices);
  var resultTriangles = [];
  for(i = triangles.length; i; ) {
    --i;
    var p1 = new Point(vertices[triangles[i]][0], vertices[triangles[i]][1], points[triangles[i]].z);
    --i;
    var p2 = new Point(vertices[triangles[i]][0], vertices[triangles[i]][1], points[triangles[i]].z);
    --i; 
    var p3 = new Point(vertices[triangles[i]][0], vertices[triangles[i]][1], points[triangles[i]].z);
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
    arr.push(new Point(x,y,z));
  };
  return arr;
}


/////////////////////////////////////////////////////////////////////
function Triangle(point1, point2, point3){
  this.p1 =  point1;
  this.p2 =  point2;
  this.p3 =  point3;
  this.getMinPoint();
  this.getMaxPoint();
};
Triangle.prototype.getMinPoint = function() {
  this.minPoint = new Point(0,0,100000);  
  if (this.p1.z <= this.minPoint.z) jQuery.extend(this.minPoint, this.p1);
  if (this.p2.z <= this.minPoint.z) jQuery.extend(this.minPoint, this.p2);
  if (this.p3.z <= this.minPoint.z) jQuery.extend(this.minPoint, this.p3);
};
Triangle.prototype.getMaxPoint = function() {
  this.maxPoint = new Point(0,0,-100000);  
  if (this.p1.z >= this.maxPoint.z) this.maxPoint = this.p1;
  if (this.p2.z >= this.maxPoint.z) this.maxPoint = this.p2;
  if (this.p3.z >= this.maxPoint.z) this.maxPoint = this.p3;
};


/////////////////////////////////////////////////////////////////////
function Side(point1, point2){
  this.p1 = point1;
  this.p2 = point2;
} 


/////////////////////////////////////////////////////////////////////
function Point(_x, _y, _z) {
  this.x =  Number(_x);
  this.y =  Number(_y);
  this.z =  Number(_z);
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
Canvas.prototype.drawTriangle = function (triangle){
  var ctx = this.ctx();
  ctx.globalAlpha = window.opacity;
  ctx.beginPath();
  
  // var minP = triangle.minPoint;
  // var maxP = triangle.maxPoint;
  
  var gradient = ctx.createLinearGradient(minP.x, minP.y, maxP.x, maxP.y);
  
  var startG = Math.abs(minP.z-window.minT)/Math.abs(window.maxT-window.minT);  
  var stopG = Math.abs(maxP.z-window.minT)/Math.abs(window.maxT-window.minT);
  
  gradient.addColorStop(String(startG), window.minColor);
  gradient.addColorStop(String(stopG), window.maxColor);

  ctx.moveTo(triangle.p1.x,triangle.p1.y);
  ctx.lineTo(triangle.p2.x,triangle.p2.y);
  ctx.lineTo(triangle.p3.x,triangle.p3.y);
  
  ctx.fillStyle = gradient;
  ctx.fill();
  
  ctx.stroke();
  ctx.restore();
};

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