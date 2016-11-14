"use strict"; //Script wrapper
//Global
var MS_PER_UPDATE = 100;
var canvas = document.getElementById("invaders");
var ctx = canvas.getContext("2d");
canvas.style.background = "#000";
console.log("JS Entered");
var invaders = [];
var DEBUG = true;

//"Objects"
var Player = {
    x: 50,
    y: 400,
    width: 64,
    height: function () { return this.width; },
    moveSpeed: 8,
    isLeft: false,
    isRight: false,
    isUp: false,
    isDown: false,

    fire: function (fn) { fn(); },
    
    move: function () {
        
        function left() {
            Player.x -= Player.moveSpeed;
        }
        function right() {
            Player.x += Player.moveSpeed;
        }
        function up() {
            Player.y -= Player.moveSpeed;
        }
        function down() {
            Player.y += Player.moveSpeed;
        }
        
        if (Player.isLeft) { left(); }
        if (Player.isRight) { right(); }
        if (Player.isUp) { up(); }
        if (Player.isDown) { down(); }
    },
    
    draw: function () {
        if (DEBUG) {console.log("Player.draw Entered"); }
        ctx.beginPath();
        ctx.rect(Player.x, Player.y, Player.height, Player.width);
        ctx.fillStyle = "#fff";
        ctx.fill();
        ctx.closePath();
    }
};

// Functions(

function Draw() {
    console.log("Draw Entered");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    Player.draw();   
}

//setInterval(Draw(), 10);//(lag / MS_PER_UPDATE));


// Events
function keyDown(e) {
    console.log("KeyDown");
    switch (e.keyCode) {
    case 37: // left
        Player.isLeft = true;
        break;
    case 38: // up
        Player.isUp = true;
        break;
    case 39: // right
        Player.isRight = true;
        break;
    case 40: // down
        Player.isDown = true;
        break;
    }
}

function keyUp(e) {
    switch (e.keyCode) {
    case 37: // left
        Player.isLeft = false;
        break;
    case 38: // up
        Player.isUp = false;
        break;
    case 39: // right
        Player.isRight = false;
        break;
    case 40: // down
        Player.isDown = false;
        break;
    }
    
}

function ProcessInput() {
    console.log("ProcessInput");
    Player.move();
}

function Update(Date) {
    console.log("Update");
    
}

function GameLoop() {
    console.log("GameLoop");
    // Get current time
    var lastTime = Date.now(),
        lag = 0.0;
    
    // Main loop
    while (true) {
        var currentTime = Date.now();
        var elapsed = currentTime - lastTime;
        lastTime = currentTime;
        lag += elapsed;
        
        ProcessInput();
        
        // Process game logic
        while (lag >= MS_PER_UPDATE ) {
            Update(elapsed);
            lag -= MS_PER_UPDATE;
            if( DEBUG ) { console.log("Lag Loop"); }
        }
        
        // Render
        Draw();
    }
}

function startGame() {
    console.log("startGame");
    document.addEventListener('keydown', keyDown, false);
    document.addEventListener('keyup', keyUp, false);
    GameLoop();
    
}

// on load
document.onload = startGame;