(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.maximize_canvas = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var aspectToRect = require('aspect-to-rect');
var fitRect = require('fit-rect');

module.exports = function (canvas, options, onResize) {
    return new CanvasBinding(canvas, options, onResize);
};

function CanvasBinding(canvas, options, onResize) {
    this.onResize = onResize;
    this.options = options;
    this.canvas = canvas;
    // Without intermediate DIV certain old 4.x native Android browsers
    // "duplicated" canvas on the screen
    // http://stackoverflow.com/questions/18271990/android-native-browser-duplicating-html5-canvas-fine-in-chrome
    // This is probably not much relevant in 2017, but the fix is easy and - probably - cannot cause much harm.
    this.canvasHolder = document.createElement("div");

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
    this.canvas.width = canvasSize.width;
    this.canvas.height = canvasSize.height;

    var canvasPosition = fitRect([0, 0, canvasSize.width, canvasSize.height], [0, 0, windowWidth, windowHeight]);
    this.canvasHolder.style.left = canvasPosition[0] + "px";
    this.canvasHolder.style.top = canvasPosition[1] + "px";
    this.canvasHolder.style.width = this.canvas.style.width = canvasPosition[2] + "px";
    this.canvasHolder.style.height = this.canvas.style.height = canvasPosition[3] + "px";

    this.onResize && this.onResize();
};

},{"aspect-to-rect":2,"fit-rect":3}],2:[function(require,module,exports){
module.exports = function aspectToRect(aspectRatio, options, result) {
    var r = result || {width: 0, height: 0};
    if (aspectRatio <= 0) {
        r.width = r.height = 0;
        return r;
    }

    if (Array.isArray(options)) {
        var bestW = 0, bestH = 0, bestDistance = Number.MAX_VALUE;
        for (var i = 0; i < options.length; ++i) {
            singleAspectToRect(aspectRatio, options[i], r);
            var newDistance = Math.abs(r.width / r.height - aspectRatio);
            if (newDistance < bestDistance) {
                bestW = r.width;
                bestH = r.height;
                bestDistance = newDistance;
            }
        }
        r.width = bestW;
        r.height = bestH;
    }
    else {
        singleAspectToRect(aspectRatio, options, r);
    }

    return r;
};

function singleAspectToRect(aspectRatio, options, r) {
    var minWidth = 0, maxWidth = Number.MAX_VALUE, minHeight = 0, maxHeight = Number.MAX_VALUE;
    var minMaxDefined;

    if (options.width) {
        minMaxDefined = false;
        if (options.width.hasOwnProperty("min")) {
            minMaxDefined = true;
            minWidth = +options.width.min;
        }
        if (options.width.hasOwnProperty("max")) {
            minMaxDefined = true;
            maxWidth = +options.width.max;
        }
        if (!minMaxDefined) {
            minWidth = maxWidth = +options.width;
        }
    }

    if (options.height) {
        minMaxDefined = false;
        if (options.height.hasOwnProperty("min")) {
            minMaxDefined = true;
            minHeight = +options.height.min;
        }
        if (options.height.hasOwnProperty("max")) {
            minMaxDefined = true;
            maxHeight = +options.height.max;
        }
        if (!minMaxDefined) {
            minHeight = maxHeight = +options.height;
        }
    }

    var w1 = minWidth;
    var h1 = w1 / aspectRatio;
    if (h1 < minHeight) {
        h1 = minHeight;
    }
    if (h1 > maxHeight) {
        h1 = maxHeight;
    }
    var a1 = w1/h1;

    var h2 = minHeight;
    var w2 = h2 * aspectRatio;
    if (w2 < minWidth) {
        w2 = minWidth;
    }
    if (w2 > maxWidth) {
        w2 = maxWidth;
    }
    var a2 = w2/h2;

    if (Math.abs(a1 - aspectRatio) < Math.abs(a2 - aspectRatio)) {
        r.width = w1;
        r.height = h1;
    }
    else {
        r.width = w2;
        r.height = h2;
    }

}

},{}],3:[function(require,module,exports){
/**
 * Fits one rectangle into another
 * @param  {Array} rect   [x,y,w,h]
 * @param  {Array} target [x,y,w,h]
 * @param  {String} mode   ['contain' (default) or 'cover']
 * @return {Array}        [x,y,w,h]
 */
function fitRect(rect, target, mode) {
    mode = mode || 'contain';

    var sw = target[2]/rect[2];
    var sh = target[3]/rect[3];
    var scale = 1;

    if (mode == 'contain') {
        scale = Math.min(sw, sh);
    }
    else if (mode == 'cover') {
        scale = Math.max(sw, sh);
    }

    return [
        target[0] + (target[2] - rect[2]*scale)/2,
        target[1] + (target[3] - rect[3]*scale)/2,
        rect[2]*scale,
        rect[3]*scale
    ]
}

module.exports = fitRect;

},{}]},{},[1])(1)
});