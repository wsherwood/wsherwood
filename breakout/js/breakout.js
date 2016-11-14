/***
 * Start Game
 */
var game = new Game();

function init() {
    if (game.init()) {
        game.start();
    }
}

/**
  * Image repo. Load in all the graphical assest initially
  * in order to lower the overhead during the game.
  * Is a singleton pattern...
  */
var imageRepo = new function () {
    //Background property
    this.empty = null;
    this.background = new Image();
    
    //Source file
    this.background.src = "../img/bg.png";
}

/**
 * Drawable object prototype. The effective 'base' class
 * for all the objects that can or will be drawn on a canvas
 * element.
 */
function Drawable() {
    //Constructor
    this.init = function (posX, posY) {
        //Default variables
        this.x = posX;
        this.y = posY;
    }
    this.speed = 0;
    this.canvasWidth = 0;
    this.canvasHeight = 0;
    
    //Abstract fucntion to be overridden.
    this.draw = function () {
    };
}

/** 
 * Concrete background class object. Inherits from drawable
 * drawn on it's own canvas.
 */
function Background() {
    this.speed = 1; // move speed in px
    
    //Implementation of the draw code
    this.draw = function () {
        console.log("Backgroun y is: " + this.y);
        this.y += this.speed;
        this.context.drawImage(imageRepo.background, this.x, this.y);
        //Draw a dupelicate image on top for the infinite scrolling effect
        this.context.drawImage(imageRepo.background, this.x, this.y - this.canvasHeight);
        
        //When the image gets scrolled off the screen. Move it to the top.
        if (this.y >= this.canvasHeight) { 
            this.y = 0; 
        }
    };
}

//Set the background ot inherit properties from Drawable
Background.prototype = new Drawable();

/***
 * Game object. Holds the objects and data for the game.
 */
function Game() {
    /*
     * Constructor gets canvas information and context. 
     * Returns true if canvas is supported else false,
     * halting the script.
     */
    this.init = function() {
        //Grab the canvas element
        this.bgCanvas = document.getElementById('background');
        //Test to see if background is even supported
        if (this.bgCanvas.getContext) {
            this.bgContext = this.bgCanvas.getContext('2d');
            
            //Init the objects to contain their context and canvas info
            Background.prototype.context = this.bgContext;
            Background.prototype.canvasWidth = this.bgCanvas.width;
            Background.prototype.canvasHeight= this.bgCanvas.height;
            
            //Creat the new background object.
            this.background = new Background();
            this.background.init(0,0);
            return true;
        } else {
            return false;
        }
    };
    
    this.start = function() {
        animate();
    };
}


/***
 * Animation loop.
 */
function animate() {
    requestAnimFrame( animate );
    game.background.draw();
}

/***
 * requestAnim shim by Paul Irish
 * Finds the first API that works to optimize the animation
 */
window.requestAnimFrame = (function () {
    return window.requestAnimationFrame    ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame    ||
        window.oRequestAnimationFrame      ||
        window.msRequestAnimationFrame     ||
        function( callback, element ) {
            window.setTimeout( callback, 1000/60 );
        };
})();