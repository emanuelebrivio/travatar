/*jshint node:true, eqnull:true, laxcomma:true, undef:true, indent:2, camelcase:false */
'use strict';

var url = require('url');


var router = require('router');
var api = router();


var S = require('string');
require('seedrandom');


var Canvas = require('canvas');
var fs = require('fs');
var path = require('path');



//  -- set various routes (index in this case) --
api.get('/avatar/get', function (req, res) {


  var params = url.parse(req.url, true).query;


  if (!params.email || params.email.trim() === '') {
    res.end(JSON.stringify({ error: 'no mail provided.'}, null, 2));
    return;
  }



  Math.seedrandom(params.email);



  var fileName = S(params.email).slugify().s;


  var canvasM = 100;
  var perRow = 6;
  var fillPerc = 0.4;


  //var Image = Canvas.Image;
  var canvas = new Canvas(canvasM, canvasM);
  var ctx = canvas.getContext('2d');


  var colors = ['#7D1523', '#BD1F34', '#35233D'];
  var colorsLength = colors.length - 1;
  var mulW = canvasM / perRow;
  var mulH = canvasM / (perRow + 1);

  ctx.rect(0, 0, canvasM, canvasM);
  ctx.fillStyle = colors[2];
  ctx.fill();

  for (var c = 0; c < perRow + 1; c++) {
    for (var r = 0; r <= perRow; r++) {

      var _r = r;

      if (c % 2 === 0) {
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

      if (c === (perRow - 1) && r === (perRow - 1)) {

        var __parentDir = path.dirname(process.mainModule.filename);

        var out = fs.createWriteStream(__parentDir + '/public/avatars/' + fileName + '.png');
        var stream = canvas.pngStream();
        stream.pipe(out);

      }

    }
  }





  res.end(JSON.stringify({'params': params, 'img': canvas.toDataURL('image/png')}, null, 2));

});



module.exports = api;