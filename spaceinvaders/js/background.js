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