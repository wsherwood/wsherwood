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
    this.remainingInvaders = this.invaders.length;
    this.numberOfCalls = 0;
    
    this.checkCollision = function () {
        for (i = 0; i < this.invaders.length; i++) {
            this.invaders[i].checkCollision();
            if (!this.invaders[i].isAlive) {
                this.invaders.splice(i, 1);
                
                //clear the canvas of the dead invader
                game.invaderContext.clearRect(this.invaders[i].x, this.invaders[i].y, this.invaders[i].width, this.invaders[i].height);
            }
        }
    };
    
    this.draw = function () {
        this.numberOfCalls += 1;
        
        // Determine whether or not to update the invaders based
        // on the number of currently alive
        if (this.numberOfCalls % this.remainingInvaders === 0) {
            game.invaderContext.clearRect(0, 0, game.invaderCanvas.width, game.invaderCanvas.height);
            for (i = 0; i < this.invaders.length; i++) {
                this.invaders[i].draw();
            }
            if (this.change) {
                this.changeDirection();
                this.change = false;
            }
        }
    };
    
    this.changeDirection = function () {
        for (i = 0; i < this.invaders.length; i++) {
            this.invaders[i].speed = -this.invaders[i].speed;
            this.invaders[i].y += game.InvaderCollection.speed;
        }
    };
    
}
InvaderCollection.prototype = new Drawable();