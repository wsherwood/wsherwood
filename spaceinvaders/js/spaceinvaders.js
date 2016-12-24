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
var imageRepo = new ImageRepo();
/***
 * Animation loop.
 */
function animate() {
    'use strict';
    if (typeof game !== undefined && !game.PAUSE) {
        window.requestAnimFrame(animate);
        game.background.draw();
        game.player.draw();
        game.player.bullet.draw();
        game.InvaderCollection.checkCollision();
        game.InvaderCollection.draw();
    } else {
        return;
    }
}

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
            
            Bullet.prototype.context = this.invaderContext;
            Bullet.prototype.canvasWidth = this.width;
            Bullet.prototype.canvasHeigh = this.height;
            
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