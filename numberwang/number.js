function Game() {
    'use strict';
    this.secretNumber = Math.floor((Math.random() * 50) + 1);
    this.outputElem = document.getElementById("feedback");
    this.numberOfGuess = 0;
    
    this.checkGuess = function () {
        var num = parseInt(document.getElementById("number").value, 10);
        
        if (this.numberOfGuess >= 5) {
            alert("You failed to guess the number!!! \n It was " + num);
            this.init();
        } else if (num === this.secretNumber) {
            alert("You guess the number!!!");
            this.init();
        } else if (num < this.secretNumber) {
            this.outputElem.innerHTML = "Too low!";
            this.numberOfGuess += 1;
        } else if (num > this.secretNumber) {
            this.outputElem.innerHTML = "Too High!";
            this.numberOfGuess += 1;
        }
    };
    
    this.init = function () {
        this.outputElem.innerHTML = "";
        document.getElementById("number").value = 1;
        this.numberOfGuess = 0;
        this.secretNumber = Math.floor((Math.random() * 50) + 1);
    };
}

this.game = new Game();