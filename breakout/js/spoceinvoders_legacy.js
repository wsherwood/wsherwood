/**
 * spoceinvoder.js
 * Author: Willem Sherwood
 * For: ""
 * 2016
 */
var spaceInvaders = (function () {
    'use strict';

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
            function (callback, element) {
                window.setTimeout(callback, 1000 / 60);
            };
    }());
    
    var game;
    
    function animate() {
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
     * ImageRepo. Holds all the graphical assest.
     */
    var ImageRepo = (function () {
        // Private variables
        var empty = null,
            bg = new Image(),
            player = new Image(),
            invader = new Image();
        
        // Specify the source files
        bg.src = "../img/bg.png";
        player.src = "../img/ship.png";
        invader.src  = "../img/invader2.png";
        
        return { //Public interface
            background: bg,
            player: player,
            invader: invader
        };
    }());
    
    
    /**
     * Drawable object. De facto 'base class' for all
     * objects that can be drawn on canvas element.
     */
    function Drawable() {
        this.x = 0; // in px
        this.y = 0; // in px
        this.width = 0; //in px
        this.height = 0; //in px
        
        this.speed = 0; // float
        this.id = null;
        
        this.draw = function () {};
    }
    
    /**
     *
     */
    function Background(img) { // inherits from Drawable
        if (typeof img !== Image) {
            return null;
        }
        
        this.speed = 0.9;
        this.height = img.heigh;
        this.width = img.width;
        this.draw = function () {
            //Convert the position into an integer
            var intY = this.y >>> 0;
            //We don't need to convert x
            this.context.drawImage(ImageRepo.background, this.x, intY);
            this.context.drawImage(ImageRepo.background, this.x, intY - this.height);
            
            // Scroll the image when it exceeds the canvas height
            if (intY >= this.canvasHeight) {
                this.y = (0 - (this.height - this.context.height));
            }
        };
    }
    Background.prototype = new Drawable();

    function Player(img) {
        if (typeof img !== Image) {
            return null;
        }
        
        this.speep = 1.5;
        this.isLeft = false;
        this.isRight = false;
        
        // Draw code implementation
        this.draw = function () {
            if (this.left) {
                this.x = (this.x - this.speed) >>> 0;
            }
            if (this.right) {
                this.x = (this.x + this.speed) >>> 0;
            }
        };
        
        // Shooting Logic
        this.fire = function () {
        };
        
        // Player boundry logic
        this.checkBounds = function () {
            if (this.x <= 0) {
                this.x = 0;
            } else if (this.x + this.width >= this.context.width) {
                this.x = this.context.width - this.width;
            }
        };
    }
    Player.prototype = new Drawable();
    
    function Invader(img) {
        this.speed = 25; // Invaders have a specific method of movement
        this.isLeft = false;
        this.isRight = true;
        this.width = img.width;
        this.height = img.height;
        this.draw = function () {
            this.context.drawImage(ImageRepo.invader, this.x, this.y);
        };
    }
    Invader.prototype = new Drawable();
    
    function InvaderCollection() {
        this.speed = 10;
        this.numberOfCols = 11;
        this.xPadding = 5;
        this.yPadding = 13;
        this.isLeft = false;
        this.isRight = true;
        this.instance = false;
        
        function generateInvaders() {
            if (InvaderCollection.instance) {
                return InvaderCollection.invaders;
            }
            
            var invArr = [],
                i = 0;
            invArr.length = 11;
            
            for (i = 0; i < invArr.length; i++) {
                invArr[i] = new Invader();
                invArr[i].x = ((i * invArr[i].width) + InvaderCollection.xPadding);
                invArr[i].y = (Math.floor(i / InvaderCollection.numberOfCols) * InvaderCollection.yPadding);
                
            }
            
            InvaderCollection.instance = true;
            return invArr;
        }
        this.invaders = generateInvaders();
        
        this.draw = function () {
            this.invaders.forEach(function (inv) {
                inv.draw();
            });
        };
    }
    InvaderCollection.prototype = new Drawable();
    
    function Game() {
        this.width = null;
        this.height = null;
        this.background = null;
        this.player = null;
        this.invaderCollection = null;
        this.PAUSE = false;
        
        this.init = function () {
            // Create canvas elements
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
            
            document.getElementById('viewport').appendChild(this.playerCanvas);
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

                Invader.prototype.context = this.invaderContext;
                //Invader.prototype.context.scale(2.0, 2.0);
                Invader.prototype.canvasWidth = this.width;
                Invader.prototype.canvasHeight = this.height;

                this.InvaderCollection = new InvaderCollection();
                this.InvaderCollection.init(0, 0);

                return true;
            } else {
                return false;
            }
        };

        this.start = function () {
            animate();
        };
    }
    
    /**
     * Game Start
     */
    game = new Game();
    function init() {
        if (game.init()) {
            game.start();
        }
    }
    
    /**
     * Event Logic
     */
    function keyDownHandler(e) {
        var rightKey = "ArrowRight",
            leftKey = "ArrowLeft",
            shootKey = " ";
        
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
    
    function onFocusOut(e) {
        console.log("PAUSING");
        game.PAUSE = true;
    }
    
    function onFocus(e) {
        console.log("Resume");
        game.PAUSE = false;
    }
    
    document.addEventListener('onfocusout', onFocusOut, false);
    document.addEventListener('onfocus', onFocus, false);
    document.addEventListener('keydown', keyDownHandler, false);
    document.addEventListener('keyup', keyUpHandler, false);
}());