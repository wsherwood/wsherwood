function Concentration() {
  'use strict';
  
  var html = document.getElementById('concentrationgame');
  var self = this,
      i = 0;
  
  if (html === null || html === undefined) {
    html = document.createElement('div');
    html.id = 'concentrationgame';
    html.className = 'concentrationgame';
    
    //Attach the new html element to the page
    document.body.appendChild(html);
  }
  this.chosenLevel = 4;
  this.matches = 0;
  
  this.selectedCard1 = null;
  this.selectedCard2 = null;
  this.card1flipped = false;
  this.card2flipped = false;

  this.click = function (event) {
    // We need to connect the click event to our card
    // object
    var tar = (function (t) {
      for (i = 0; i < self.cards.length; i += 1) {
        if (self.cards[i].html === t) {
          return self.cards[i];
        }
      }
    }(event.target));
   
     if (this.classList.contains("selected") === true){
      console.log("card selected");
      if (self.card1flipped === false && self.card2flipped === false) {
        self.selectedCard1 = tar;
        self.card1flipped = true;
      } else if (self.card1flipped === true && self.card2flipped === false) {
        self.selectedCard2 = tar;
        self.card2flipped = true;
        if (self.selectedCard1.value === self.selectedCard2.value) {
          self.gameCardMatch(self.selectedCard1, self.selectedCard2);
        } else {
          self.gameCardMismatch(self.selectedCard1, self.selectedCard2);
        }
      }
    }
  };
  
  this.cards = [];
  
  for (i = 0; i < this.chosenLevel; i += 1) {
    this.cards.push(new Util.Card(i));
    this.cards.push(new Util.Card(i));
  }
  
  Util.shuffle(this.cards);
  
  for (i = 0; i < this.cards.length; i += 1) {
    html.appendChild(this.cards[i].html);
    this.cards[i].html.addEventListener('click', this.click);
  }
}

Concentration.prototype.resetVars = function () {
  'use strict';
  
  this.selectedCard1 = null;
  this.selectedCard2 = null;
  this.card1flipped = false;
  this.card2flipped = false;
  
  console.log(this);
};

Concentration.prototype.gameCardMatch = function (card1, card2) {
  'use strict';
  
  console.log(card1);
  console.log(card2);
  
  var self = this;
  
  card1.matched = true;
  card2.matched = true;
  
  window.setTimeout(function () {
    card1.html.classList.add('matched');
    card2.html.classList.add('matched');
  }, 300);
  
  window.setTimeout(function () {
    card1.html.classList.remove('selected');
    card2.html.classList.remove('selected');
  }, 1500);
  
  if (this.matches === this.chosenLevel) {
    this.gameWin();
  }
  this.resetVars();
};

Concentration.prototype.gameCardMismatch = function (card1, card2) {
  'use strict';
  
  window.setTimeout(function () {
    card1.html.classList.remove('selected');
    card2.html.classList.remove('selected');
    
    card1.selected = false;
    card2.selected = false;
  }, 900);
  this.resetVars();
};

Concentration.prototype.gameWin = function () {
  'use strict';
  
  var self = this;
  alert('You win!');
};

var game = new Concentration();