var cards = [
    {
      id : 0,
      src : '../img/HTML5_logo.png'
    }, {
      id : 1,
      src : '../img/CSS_Logo.png'
    }, {
      id : 2,
      src : '../img/JavaScript_logo.png'
    }, {
      id : 3,
      src : '../img/PHP_logo.svg'
    }
  ];

window.Util =  {
  util : this,
  shuffle : function (arr) {
    var i, k, t = 0;

    for (i = arr.length - 1; i > 0; i -= 1) {
      k = Math.floor(Math.random() * i);

      //swap position
      t = arr[i];
      arr[i] = arr[k];
      arr[k] = t;
    }
  },
  
    
  Card : function Card(index) {
    var self = this;
    
    this.html = document.createElement('div');
    this.html.style.backgroundImage = "url('../img/cardback_0.png')";
    this.html.className = 'outer_card';
    this.imgSrc = cards[index].src;
    this.value = index;
    this.html.innerHTML =  '<img class="inner_card" src="' + this.imgSrc + '"/>';

    this.matched = false;
    this.selected = false;

    this.html.addEventListener('click', function () {
      if (self.matched === false) {
        if (self.selected) {
          self.selected = false;
          self.html.classList.toggle('selected');
        } else {
          self.selected = true;
          self.html.classList.toggle('selected');
        }
      }
    });
  }
  
};