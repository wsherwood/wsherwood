/*jslint devel: true, nomen: true, sloppy: true, vars: true*/

function Box() {
  
}
Box.prototype = (document.createElement('div'));

var b = new Box();

console.log(b);