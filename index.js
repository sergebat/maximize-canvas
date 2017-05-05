var aspectToRect = require('aspect-to-rect');
var fitRect = require('fit-rect');

module.exports = function (canvas, options, onResize) {
    return new MaximizedCanvas(canvas, options, onResize);
};

function MaximizedCanvas(canvas, options, onResize) {
    this.onResize = onResize;
    this.options = options;
    this.canvas = canvas;

    canvas.style.position = "absolute";
    document.body.appendChild(canvas);

    var self = this;
    this.resizeHandler = function() {
        self._resize();
    };

    window.addEventListener('resize', this.resizeHandler);
    this.resizeHandler();
}

MaximizedCanvas.prototype.detach = function() {
    window.removeEventListener('resize', this.resizeHandler);
};

var canvasSize = {width: 0, height: 0};

MaximizedCanvas.prototype._resize = function() {
    var windowWidth = window.innerWidth;
    var windowHeight = window.innerHeight;
    if (windowHeight < 1) {
        windowHeight = 1;
    }
    if (windowWidth < 1) {
        windowWidth = 1;
    }

    aspectToRect(windowWidth / windowHeight, this.options, canvasSize);
    this.canvas.width = canvasSize.width;
    this.canvas.height = canvasSize.height;

    var canvasPosition = fitRect([0, 0, canvasSize.width, canvasSize.height], [0, 0, windowWidth, windowHeight]);
    this.canvas.style.left = canvasPosition[0] + "px";
    this.canvas.style.top = canvasPosition[1] + "px";
    this.canvas.style.width = canvasPosition[2] + "px";
    this.canvas.style.height = canvasPosition[3] + "px";

    this.onResize && this.onResize();
};
