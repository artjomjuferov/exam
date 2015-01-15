$(document).ready(function(){
  window.maxT = 30;
  window.maxColor = [0,0,255];
  window.minT = -30;
  window.minColor = [255,0,0];
  window.opacity = 1;

  var canvas = new Canvas('myCanvas');
  window.canvas = canvas;
  var points = createRandomPoints(canvas, 20);
  console.log(points);
  
  $("#imgInput").change(function(){
    canvas.getImageToBg(this);
    var image = new Image();
    image.src = canvas.element.toDataURL("image/png").replace("image/png", "image/octet-stream");
    window.bg = image;
  });

  $("#drawPoints").click(function () {
    for (var i = 0; i < points.length; i++) {
      canvas.drawPoint(new Point(points[i][0], points[i][1], points[i][2]));
    }
  });

  $("#triangulate").click(function () {
    var triangules = triangulate(points);
    
    var backCanvas = document.createElement('canvas');
    backCanvas.width = window.canvas.element.width;
    backCanvas.height = window.canvas.element.height;
    var ctx = backCanvas.getContext('2d');
    window.imageData = ctx.createImageData(backCanvas.width,
        backCanvas.height)
    for (var i = 0; i < triangules.length; i++) {
      drawTriangle(backCanvas, window.imageData, triangules[i]);
    }
    
    ctx.putImageData(window.imageData, 0, 0);
    window.trgImg = new Image()
    window.trgImg.src = backCanvas.toDataURL("image/png");
    
    var cnvs = window.canvas.element;
    cnvs.getContext("2d").drawImage(window.bg,0,0);
    cnvs.getContext("2d").drawImage(window.trgImg,0,0);
    
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