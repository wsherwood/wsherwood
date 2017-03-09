//ship.js
function Player() { //inherits from drawable
    'use strict';
    this.speed = 1;
    this.bullet = new Bullet(0, 0);
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
        if (!this.bullet.isAlive) {
            this.bullet.x = this.x + (this.width / 2);
            this.bullet.y = game.invaderCanvas.height - this.canvasHeight - this.bullet.height;
            this.bullet.isAlive = true;
        }
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