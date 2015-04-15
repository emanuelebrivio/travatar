/*jshint node:true, eqnull:true, laxcomma:true, undef:true, indent:2, camelcase:false */
'use strict';

var url = require('url');
var async = require('async');
var request = require('request');

var router = require('router');
var api = router();


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


  var canvasM = 100;
  var perRow = 6;
  var fillPerc = 0.4;


  //var Image = Canvas.Image;
  var canvas = new Canvas(canvasM, canvasM);
  var ctx = canvas.getContext('2d');

  var mulW = canvasM / perRow;
  var mulH = canvasM / (perRow + 1);






  async
    .waterfall(
      [

        function (callback) {

          request('http://www.colourlovers.com/api/palettes/top?format=json&numResults=100&hueRange=0,359', function (err_, resp_, body_) {
            //request('http://www.colourlovers.com/api/palettes/random?format=json', function (err_, resp_, body_) {
            if (err_) {
              callback(err_);
              return;
            }

            if (resp_.statusCode !== 200) {
              callback({'error': 'sc not 200'});
              return;
            }


            callback(null, JSON.parse(body_));


          });


        },


        function (_palettes, callback) {

          var randPalette = _palettes[Math.round((Math.random() * _palettes.length - 1))];
          callback(null, randPalette);
        },


        function (randPalette, callback) {

          var colors = randPalette.colors;
          colors = colors.map(function (c) { return '#' + c; });

          ctx.rect(0, 0, canvasM, canvasM);
          ctx.fillStyle = colors[Math.round( (Math.random() * colors.length - 1) )];
          ctx.fill();

          for (var c = 0; c <= perRow; c++) {
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


                ctx.fillStyle = colors[Math.round( (Math.random() * colors.length - 1) )];
                ctx.fill();
                ctx.closePath();
              }

              if (Math.random() > (1 - fillPerc)) {
                ctx.beginPath();
                ctx.moveTo(((_r + 1) * mulW), ((c + 1) * mulH));
                ctx.lineTo(((_r + 0.5) * mulW), (c * mulH));
                ctx.lineTo((_r * mulW), ((c + 1) * mulH));

                ctx.fillStyle = colors[Math.round( (Math.random() * colors.length - 1) )];
                ctx.fill();
                ctx.closePath();
              }

            }
          }


          var __parentDir = path.dirname(process.mainModule.filename);

          var out = fs.createWriteStream(__parentDir + '/public/avatars/' + params.email + '.png');
          var stream = canvas.pngStream();

          stream.on('data', function (chunk) {
            out.write(chunk);
          });

          stream.on('end', function () {
            callback(null, randPalette, '/avatars/' + params.email + '.png');
          });


        }


      ],

      function (err, randPalette, avatarURL) {
        if (err) {
          res.end(JSON.stringify(err, null, 2));
          return;
        }
        res.end(JSON.stringify({palette: randPalette, avatar: avatarURL, email: params.email}, null, 2));
      }
    );






});



module.exports = api;