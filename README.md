# maximize-canvas

Stretches canvas to the entire window proportionally. Avoids "black bars". Made for 2D mobile web games.

## Installation

```
$ npm install maximize-canvas
``` 
 
## How to use it?  
  
 ```javascript
  
 var maximizeCanvas = require("maximize-canvas");
 var canvas = document.createElement('canvas');
 var canvasBinding = maximizeCanvas(
     canvas,
     {
         width: 640,
         height: {min: 712, max: 1136} 
     },
     function() {
         // Optional onResize callback. Do your game relayout.
     }
 );
 ``` 
## What's going on in the above code?
Let's say the game is portrait: 
  
  * Canvas width is fixed: 640 pixels
  * Minimum height: 712 pixels (below that the gameplay would have been clipped)
  * Maximum height: 1136 (because we don't want black bars, and our background art is 640x1136)

maximize-canvas call does the following:

 * Appends canvas to window object
 * Starts listening for window.resize event
 * Keeps canvas width fixed, and adjusts height to match the device aspect ratio on each resize
 * Scale canvas up with CSS to cover the entire screen
    
## What if my game is landscape? 

You guessed it right! 

 ```javascript
 var maximizeCanvas = require("maximize-canvas");
 var canvas = document.createElement('canvas');
 var canvasBinding = maximizeCanvas(
     canvas,
     {
         width: {min: 1024, max: 2048},
         height: 768  
     },
     function() {
         // Optional onResize callback
     }
 );
 ```

## Can we support both orientations? 

Yes, best matching config will be picked automatically.

```javascript
var maximizeCanvas = require("maximize-canvas");
var canvas = document.createElement('canvas');
var canvasBinding = maximizeCanvas(
    canvas, [
        {
            width: 640, 
            height: {min: 800, max: 1200}
        },        
        {
            width: {min: 800, max: 1200}, 
            height: 640
        }
    ],
    function() {
        // Optional onResize callback
    }
);
```

## Why another canvas "fit" module? Don't we have enough? 

OK, all canvas scaling snippets I found do one of the following:

1. Fix canvas resolution (ex: 640x960), then scale canvas proportionally with CSS to fit the screen
2. Or set canvas.width/canvas.height to the size of the device window.

With option 1 you'll have "black bars" around canvas. 

Option 2 is very flexible, but: 
* You'll be drawing on a huge full-screen canvas - might be slow
* Your game will have to scale the sprites to any arbitrary resolution. Not every engine supports it, and in pre-WebGL
world it is also slow.
* You are on your own with corner cases (very wide or very narrow game window, for example)
 
