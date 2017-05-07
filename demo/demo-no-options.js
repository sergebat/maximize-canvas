var maximizeCanvas = require("../.");
var canvas = document.createElement('canvas');
canvas.width = 640;
canvas.height = 960;

var context = canvas.getContext("2d");
context.fillStyle = "green";
context.fillRect(0, 0, 640, 960);
maximizeCanvas(canvas);
