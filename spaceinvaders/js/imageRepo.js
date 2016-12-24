/**
  * Image repo. Load in all the graphical assest initially
  * in order to lower the overhead during the game.
  * Is a singleton pattern... sort of...
  */
function ImageRepo() {
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
        ImageRepo[imgName.toString()] = new Image();
        ImageRepo[imgName.toString()].src = srcPath.toString();
    }
    
    return { // public interface
        background: bg,
        player: py,
        invader: inv,
        getImage: function (name) {
            if (ImageRepo[name]) {
                return ImageRepo[name];
            }
        },
        add: function (name, src) {
            addImg(name, src);
            return;
        }
    };
}