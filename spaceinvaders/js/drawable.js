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