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
    this.player = new Image();
    this.invader = new Image();
    
    //Source file
    this.background.src = "../img/bg.png";
    this.player.src = "../img/ship.png";
    this.invader.src = "../img/invader.png";
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
    this.id = null;
    
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

function Player() { //inherits from drawable
    this.speed = 1;
    this.isLeft = false;
    this.isRight = false;
    
    //Draw code implementataion
    this.draw = function () {
        if (this.isLeft) {
            this.x -= this.speed;
        }
        
        if (this.isRight) {
            
        }
    };
} Player.prototype = new Drawable();

/***
 * Game object. Holds the objects and data for the game.
 */
function Game() {
    /*
     * Constructor gets canvas information and context. 
     * Returns true if canvas is supported else false,
     * halting the script.
     */
    this.width;
    this.height;
    
    this.init = function() {
        
        //Grab the canvas element
        this.bgCanvas = document.getElementById('background');
        this.width = this.bgCanvas.getAttribute('WIDTH');
        this.height = this.bgCanvas.getAttribute('HEIGHT');
        this.bgCanvas.setAttribute('Z-INDEX', 1);
        
        this.playerCanvas = document.createElement('CANVAS');
        this.playerCanvas.setAttribute('WIDTH',this.width);
        this.playerCanvas.setAttribute('HEIGHT',64);
        this.playerCanvas.setAttribute('ID', 'player');
        this.bgCanvas.setAttribute('Z-INDEX', 2);
        
        this.invaderCanvas = document.createElement('CANVAS');
        this.invaderCanvas.setAttribute('WIDTH',this.width);
        this.invaderCanvas.setAttribute('HEIGHT',this.height);
        this.invaderCanvas.setAttribute('ID', 'invader');
        this.bgCanvas.setAttribute('Z-INDEX', 2);

        
        //Append the player canvas
        document.getElementById('viewport').appendChild(this.playerCanvas);
        
        //Append the invader canvas
        document.getElementById('viewport').appendChild(this.invaderCanvas);
        
        //Test to see if background is even supported
        if (this.bgCanvas.getContext) {
            
            this.bgContext = this.bgCanvas.getContext('2d');
            this.playerContext = this.playerCanvas.getContext('2d');
            this.invaderCanvas = this.invaderCanvas.getContext('2d');
            
            //Init the objects to contain their context and canvas info
            Background.prototype.context = this.bgContext;
            Background.prototype.canvasWidth = this.bgCanvas.width;
            Background.prototype.canvasHeight= this.bgCanvas.height;
            
            
            //Creat the new background object.
            this.background = new Background();
            this.background.init(0,0);
            
            Player.prototype.context = this.playerContext;
            Player.prototype.canvasWidth = this.playerCanvas.width;
            Player.prototype.canvasHeight = this.playerCanvas.height;
            
            this.player = new Player();
            this.player.init(0,0);
            
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
    game.player.draw();
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