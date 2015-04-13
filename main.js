/*jshint browser:true, indent:2, laxcomma:true, loopfunc: true */
/*global NodeList, HTMLCollection */

(function () {
  'use strict';

  NodeList.prototype.forEach = Array.prototype.forEach;
  HTMLCollection.prototype.forEach = Array.prototype.forEach;

  NodeList.prototype.on = function (event, listener) {
    this.forEach(function (el) {
      el.addEventListener(event, listener);
    });
  };

  var canvas = document.getElementById('canvas');
  var canvasM = canvas.offsetWidth || canvas.offsetHeight;		// -- avatar is a square --
  var perRow = 6;
  var fillPerc = 0.4;
  
  Math.seedrandom('whale');

  if (canvas.getContext) {

  	var ctx = canvas.getContext('2d');

  	var colors = ['#7D1523', '#BD1F34', '#35233D'];
    var colorsLength = colors.length - 1;
    
  	var mulW = canvasM / perRow;
    var mulH = canvasM / (perRow + 1);
    
    ctx.rect(0,0,canvasM,canvasM);
    ctx.fillStyle = colors[2];
    ctx.fill();
    
  	for (var c = 0; c < perRow + 1; c++) {
      for (var r = 0; r <= perRow; r++) {
        
        var _r = r;
        if (c%2 == 0) {
          _r = _r - 0.5;
        }
        
        if (Math.random() > (1 - fillPerc)) {
          ctx.beginPath();
          ctx.moveTo(((_r - 0.5) * mulW), (c * mulH));
          ctx.lineTo(((_r + 0.5) * mulW), (c * mulH));
          ctx.lineTo((_r * mulW), ((c + 1) * mulH));
          
          ctx.fillStyle = colors[Math.round(Math.random() * colorsLength)];
          ctx.fill();
          ctx.closePath();
        }
        
        if (Math.random() > (1 - fillPerc)) {
          ctx.beginPath();
          ctx.moveTo(((_r + 1) * mulW), ((c + 1) * mulH));
          ctx.lineTo(((_r + 0.5) * mulW), (c * mulH));
          ctx.lineTo((_r * mulW), ((c + 1) * mulH));
          
          ctx.fillStyle = colors[Math.round(Math.random() * colorsLength)];
          ctx.fill();
          ctx.closePath();
        }
        

      }
  	}
    
    var img = canvas.toDataURL("image/png");
    console.log(img);

  }
  


  



})();