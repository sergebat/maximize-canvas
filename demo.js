var maximizeCanvas = require("./");
var canvas = document.createElement('canvas');
maximizeCanvas(
    canvas,
    {
        width: {min: 712, max: 1024},
        height: 640
    },
    function() {
        // Draw canvas content on each resize
        var context = canvas.getContext("2d");

        // Clear canvas and put coordinates into it's center
        context.clearRect(0, 0, canvas.width, canvas.height);
        context.transform(1, 0, 0, 1, canvas.width / 2, canvas.height / 2);

        // Simulate fixed resolution 1024x640 game background (which can be clipped on the sides if needed,
        // but it does not make sense to extend canvas beyond it)
        context.fillStyle = "red";
        context.fillRect(-512, -320, 1024, 640);

        // Simualte fixed resolution 712x640 main game area (which must always be visible)
        context.fillStyle = "blue";
        context.fillRect(-356, -320, 712, 640);
    }
);


