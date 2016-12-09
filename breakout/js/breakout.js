/***
 * requestAnim shim by Paul Irish
 * Finds the first API that works to optimize the animation
 */
window.requestAnimFrame = (function () {
    'use strict';
    return window.requestAnimationFrame    ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame    ||
        window.oRequestAnimationFrame      ||
        window.msRequestAnimationFrame     ||
        function (callback, element) {
            window.setTimeout(callback, 1000 / 60);
        };
}());

var game;
/***
 * Animation loop.
 */
function animate() {
    'use strict';
    if (typeof game !== undefined && !game.PAUSE) {
        window.requestAnimFrame(animate);
        game.background.draw();
        game.player.draw();
        game.InvaderCollection.draw();
    } else {
        return;
    }
}


/**
  * Image repo. Load in all the graphical assest initially
  * in order to lower the overhead during the game.
  * Is a singleton pattern... sort of...
  */
var imageRepo = (function () {
    'use strict';
    
    // "Private" variables
    var empty = null,
        bg = new Image(),
        py = new Image(),
        inv = new Image();
    
    //Background property
    
    //Source file
    bg.src = "bg.png";
    py.src = "ship.png";
    inv.src = "invader2.png";

    
    function addImg(imgName, srcPath) {
        imageRepo[imgName.toString()] = new Image();
        imageRepo[imgName.toString()].src = srcPath.toString();
    }
    
    return { // public interface
        background: bg,
        player: py,
        invader: inv,
        getImage: function (name) {
            if (imageRepo[name]) {
                return imageRepo[name];
            }
        },
        add: function (name, src) {
            addImg(name, src);
            return;
        }
    };
}());

/**
 * Drawable object prototype. The effective 'base' class
 * for all the objects that can or will be drawn on a canvas
 * element.
 */
function Drawable() {
    'use strict';

    //Constructor
    this.init = function (posX, posY) {
        //Default variables
        this.x = posX;
        this.y = posY;
    };
    this.speed = 0;
    this.canvasWidth = 0;
    this.canvasHeight = 0;
    this.width = 0;
    this.height = 0;
    this.id = null;
    
    //Abstract fucntion to be overridden.
    this.draw = function () {};
}

/** 
 * Concrete background class object. Inherits from drawable
 * drawn on it's own canvas.
 */
function Background() { //inherits from drawable
    'use strict';
    this.speed = 1; // move speed in px
    
    //Implementation of the draw code
    this.draw = function () {
        try {
            this.y += this.speed;
            this.context.drawImage(imageRepo.background, this.x, this.y);
            //Draw a dupelicate image on top for the infinite scrolling effect
            // TODO: CHANGE THE BACKGROUND SCROLLING LOGIC. 
            // PERHAPS CREATE A SCROLLABLE PROTOTYPE AS WELL AS A METHOD FOR WINDOW RESIZE
            this.context.drawImage(imageRepo.background, this.x, this.y - imageRepo.background.height);

            //When the image gets scrolled off the screen. Move it to the top.
            if (this.y >= this.canvasHeight) {
                this.y = 0 - (imageRepo.background.height - this.canvasHeight); // This should work for any image size
            }
        } catch (err) {
            console.log(err.message);
        }
    };
}

//Set the background ot inherit properties from Drawable
Background.prototype = new Drawable();

function VertScan() {
    'use strict';
    this.speed = 0.01;
    this.width = 40;
    
    this.draw = function () {
        this.context.clearRect(Math.floor(this.x), 0, this.width, this.canvasHeight);
    };
    this.move = function () {
        this.x += this.speed;
        if (this.x > this.canvasWidth) {
            this.x = 0;
        }
    };
}
VertScan.prototype = new Drawable();

function Player() { //inherits from drawable
    'use strict';
    this.speed = 1;
    this.isLeft = false;
    this.isRight = false;
    
    //Draw code implementataion
    this.draw = function () {
        if (this.isLeft) {
            this.x -= this.speed;
        }
        
        if (this.isRight) {
            this.x += this.speed;
        }
        this.checkBounds();
        this.context.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
        try {
            this.context.drawImage(imageRepo.player, this.x, this.y);
        } catch (err) {
            console.log(err.message);
        }
    };
    
    // Shooting logic
    this.fire = function () {
    };
    
    // Player boundry logic.
    this.checkBounds = function () {
        if (this.x <= 0) {
            this.x = 0;
        } else if (this.x + this.width >= this.canvasWidth) {
            this.x = this.canvasWidth - this.width;
        }
    };
    
}
Player.prototype = new Drawable();

function Invader() {
    'use strict';
    this.speed = 1;
    this.width = imageRepo.invader.width;
    
    this.draw = function () {
        try {
            this.x += this.speed;
            this.context.drawImage(imageRepo.invader, this.x, this.y);
            this.checkBounds();
        } catch (err) {
            console.log(err.message);
        }
    };
    
    this.checkBounds = function () {
        if (this.x + this.width >= this.canvasWidth) {
            game.InvaderCollection.change = true;
        } else if (this.x <= 0) {
            game.InvaderCollection.change = true;
        }
    };
}
Invader.prototype = new Drawable();

function InvaderCollection() {
    'use strict';
    this.speed = 10;
    this.isRight = true;
    this.instance = false;
    this.change = false;
    var i = 0;
    
    this.generateInvaders = function () {
        if (InvaderCollection.instance) {
            return InvaderCollection.invaders;
        }
        
        var invArr = [],
            i = 0;
        invArr.length = 55;

        for (i = 0; i < invArr.length; i += 1) {
            invArr[i] = new Invader();
            invArr[i].init((i % 11 * (invArr[i].width + 5) + 14), (Math.floor(i / 11) * 22) + 32);
            invArr[i].id = 'inv' + i;
            //console.log(invArr[i].x + " " + invArr[i].y);
        }
        
        InvaderCollection.instance = true;
        return invArr;
    };
    
    this.invaders = this.generateInvaders();
    
    this.draw = function () {
        game.invaderContext.clearRect(0, 0, game.invaderCanvas.width, game.invaderCanvas.height);
        for (i = 0; i < this.invaders.length; i++) {
            this.invaders[i].draw();
        }
        if (this.change) {
            this.changeDirection();
            this.change = false;
        }
        //inv.checkBounds();
    };
    
    this.changeDirection = function () {
        for (i = 0; i < this.invaders.length; i++) {
            this.invaders[i].speed = -this.invaders[i].speed;
            this.invaders[i].y += game.InvaderCollection.speed;
        }
    };
    
}
InvaderCollection.prototype = new Drawable();


/***
 * Game object. Holds the objects and data for the game.
 */
function Game() {
    'use strict';
    /*
     * Constructor gets canvas information and context. 
     * Returns true if canvas is supported else false,
     * halting the script.
     */
    this.width = null;
    this.height = null;
    this.background = null;
    this.player = null;
    this.InvaderCollection = null;
    this.PAUSE = false;
    
    this.init = function () {
        
        //Grab the canvas element
        this.bgCanvas = document.getElementById('background');
        this.width = this.bgCanvas.getAttribute('WIDTH');
        this.height = this.bgCanvas.getAttribute('HEIGHT');
        this.bgCanvas.setAttribute('Z-INDEX', 1);
        
        this.playerCanvas = document.createElement('CANVAS');
        this.playerCanvas.setAttribute('WIDTH', this.width);
        this.playerCanvas.setAttribute('HEIGHT', 64);
        this.playerCanvas.setAttribute('ID', 'playerCanvas');
        this.bgCanvas.setAttribute('Z-INDEX', 2);
        
        this.invaderCanvas = document.createElement('CANVAS');
        this.invaderCanvas.setAttribute('WIDTH', this.width);
        this.invaderCanvas.setAttribute('HEIGHT', this.height);
        this.invaderCanvas.setAttribute('ID', 'invaderCanvas');
        this.bgCanvas.setAttribute('Z-INDEX', 3);

        
        //Append the player canvas
        document.getElementById('viewport').appendChild(this.playerCanvas);
           
        //Append the invader canvas
        document.getElementById('viewport').appendChild(this.invaderCanvas);
        
        //Test to see if background is even supported
        if (this.bgCanvas.getContext) {
            this.bgContext = this.bgCanvas.getContext('2d');
            this.playerContext = this.playerCanvas.getContext('2d');
            this.invaderContext = this.invaderCanvas.getContext('2d');
            
            //Init the objects to contain their context and canvas info
            Background.prototype.context = this.bgContext;
            Background.prototype.canvasWidth = this.bgCanvas.width;
            Background.prototype.canvasHeight = this.bgCanvas.height;
            
            
            //Creat the new background object.
            this.background = new Background();
            this.background.init(0, 0);
            
            Player.prototype.context = this.playerContext;
            Player.prototype.canvasWidth = this.playerCanvas.width;
            Player.prototype.canvasHeight = this.playerCanvas.height;
            
            this.player = new Player();
            this.player.init(0, 0);
            this.player.width = imageRepo.player.width;
            
            Invader.prototype.context = this.invaderContext;
            Invader.prototype.canvasWidth = this.width;
            Invader.prototype.canvasHeight = this.height;
            
            this.InvaderCollection = new InvaderCollection();
            this.InvaderCollection.init(0, 0);
            this.InvaderCollection.generateInvaders();
            
            this.vericalLine = new VertScan();
            this.vericalLine.init(0, 0);
            this.vericalLine.canvasWidth = this.width;
            this.vericalLine.canvasHeight = this.height;
            
            return true;
        } else {
            return false;
        }
    };
    
    this.start = function () {
        animate();
    };
}

function resize() {
    'use strict';
    var view = Array.from(document.querySelectorAll('canvas')),
        w = window.innerWidth,
        h = window.innerHeight,
        ratio = (view[0].style.height / view[0].style.width),
        i = 0;
    
    console.log(h);
    console.log(w);
    console.log(view[0].style.width);
    
    for (i = 0; i < view.length; ++i) {
        view[i].style.width = (ratio * w) + 'px';
        view[i].style.height = ((1 / ratio) * h) + 'px';
    }
}


/**
 * Game start
 */
game = new Game();

function init() {
    'use strict';
    if (game.init()) {
        game.start();
        resize();
    }
}


/*****
 * Event logic
 */
function keyDownHandler(e) {
    'use strict';
    var rightKey = "ArrowRight",
        leftKey  = "ArrowLeft",
        shootKey = " ";
    
    // Exits the function if it's repeated
    if (e.repeat) { return; }
    
    if (e.key === rightKey) {
        game.player.isRight = true;
    }
    
    if (e.key === leftKey) {
        game.player.isLeft = true;
    }
    
    if (e.key === shootKey) {
        game.player.fire();
    }
}

function keyUpHandler(e) {
    'use strict';
    var rightKey = "ArrowRight",
        leftKey = "ArrowLeft",
        shootKey = " ";
    
    if (e.key === rightKey) {
        game.player.isRight = false;
    }
    
    if (e.key === leftKey) {
        game.player.isLeft = false;
    }
}

function onBlur(e) {
    'use strict';
    console.log("PAUSING");
    game.PAUSE = true;
}

function onFocus(e) {
    'use strict';
    console.log('Resuming');
    game.PAUSE = false;
}

//Action listener
//set Action listeners
document.addEventListener('keydown', keyDownHandler, false);
document.addEventListener('keyup', keyUpHandler, false);