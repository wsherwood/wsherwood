function Invader() {
    'use strict';
    this.speed = 1;
    this.width = imageRepo.invader.width;
    this.isAlive = true;
    
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
    
    this.checkCollision = function () {
        var b = game.player.bullet;
        
        if (b.x >= this.x && (b.x + b.width) <= (this.x + this.width) &&
            b.y >= this.y && (b.y + b.height <= (this.y + this.width))) {
            b.isAlive = false;
            this.isAlive = false;
        }
    };
}
Invader.prototype = new Drawable();