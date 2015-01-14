function process(canvas, imageData, func) {
    function setPixel(imageData, x, y, rgba) {
        var index = (x + y * imageData.width) * 4;
 
        for (var i = 0; i < 4; i++) {
            if (imageData.data[index + i] === 0){
                imageData.data[index + i] = rgba[i] * 255;
            }
        }
    }
 
    for (var y = 0; y < canvas.height; y++) {
        for (var x = 0; x < canvas.width; x++) {
            var result = func(new Point(x, y));
            setPixel(imageData, x, y, result);
        }
    }
}

function drawTriangle (canvas, imageData, triangle) {
    var padding = canvas.width * 0.1;
    
    triangle[0].color = [0.3, 0, 0, 0.4]; // red
    triangle[1].color = [0, 1, 0, 1]; // green
    triangle[2].color = [0, 0, 1, 1]; // blue

    var triangleGradient = function(point) {
        var DEFAULTCOLOR = [0, 0, 0, 0];
        var ret = [0, 0, 0, 0];

        for (var i = 0; i < 3; i++) {
            var v1 = triangle.edges[i][0];
            var v2 = triangle.edges[i][1];
            var v3 = triangle[i];
            var isect = intersectLines(v1, v2, v3, point);

            if (isect) {
                var pointVertexDist = distance(point, v3);
                var isectVertexDist = distance(isect, v3);

                if (pointVertexDist <= isectVertexDist) {
                    var lerpFac = 1 - pointVertexDist /
                        isectVertexDist;

                    for (var j = 0; j < ret.length; j++) {
                        ret[j] += v3.color[j] * lerpFac;
                    }
                } else {
                    return DEFAULTCOLOR;
                }
            } else {
                return DEFAULTCOLOR;
            }
        }

        return ret;
    }
    
    process(canvas, imageData, triangleGradient);
}