var aspectToRect = require('aspect-to-rect');
var fitRect = require('fit-rect');

module.exports = function (canvas, options, onResize) {
    return new CanvasBinding(canvas, options, onResize);
};

function CanvasBinding(canvas, options, onResize) {
    this.onResize = onResize;
    this.options = options || {};
    this.canvas = canvas;
    // Without intermediate DIV certain old 4.x native Android browsers
    // "duplicated" canvas on the screen
    // http://stackoverflow.com/questions/18271990/android-native-browser-duplicating-html5-canvas-fine-in-chrome
    // This is probably not much relevant in 2017, but the fix is easy and - probably - cannot cause much harm.
    this.canvasHolder = document.createElement("div");

    // Width/height not defined? Use canvas values as defaults.
    if (!this.options.hasOwnProperty("width")) {
        this.options.width = canvas.width;
    }
    if (!this.options.hasOwnProperty("height")) {
        this.options.height = canvas.height;
    }

    canvas.style.position = "absolute";
    this.canvasHolder.style.position = "absolute";
    this.canvasHolder.style.overflow = "hidden";
    this.canvasHolder.appendChild(this.canvas);
    document.body.appendChild(this.canvasHolder);

    var self = this;
    this.resizeHandler = function() {
        self._resize();
    };

    window.addEventListener('resize', this.resizeHandler);
    this.resizeHandler();
}

CanvasBinding.prototype.detach = function() {
    window.removeEventListener('resize', this.resizeHandler);
};

var canvasSize = {width: 0, height: 0};


CanvasBinding.prototype._resize = function() {
    var windowWidth = window.innerWidth;
    var windowHeight = window.innerHeight;
    if (windowHeight < 1) {
        windowHeight = 1;
    }
    if (windowWidth < 1) {
        windowWidth = 1;
    }

    aspectToRect(windowWidth / windowHeight, this.options, canvasSize);
    // Seeting canvas width/height to the same value will clear the canvas. This might be not desirable.
    if (this.canvas.width != canvasSize.width) {
        this.canvas.width = canvasSize.width;
    }
    if (this.canvas.height != canvasSize.height) {
        this.canvas.height = this.canvas.height;
    }
    var canvasPosition = fitRect([0, 0, canvasSize.width, canvasSize.height], [0, 0, windowWidth, windowHeight]);
    this.canvasHolder.style.left = canvasPosition[0] + "px";
    this.canvasHolder.style.top = canvasPosition[1] + "px";
    this.canvasHolder.style.width = this.canvas.style.width = canvasPosition[2] + "px";
    this.canvasHolder.style.height = this.canvas.style.height = canvasPosition[3] + "px";

    this.onResize && this.onResize(canvasSize.width, canvasSize.height);
};
