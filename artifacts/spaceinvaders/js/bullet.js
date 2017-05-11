function Bullet() {
    'use strict';
    this.speed = 1;
    this.width = 5;
    this.height = 13;
    this.isAlive = false;
    this.color = "#ff0000";
    this.draw = function () {
        if (this.isAlive) {
            this.context.clearRect(this.x, this.y, this.width, this.height);
            this.y -= this.speed;
            this.context.fillStyle = this.color;
            this.context.fillRect(this.x, this.y, this.width, this.height);
            if (this.y + this.height <= 0) {
                this.isAlive = false;
            }
        }
    };
}
Bullet.protoype = new Drawable();