/*jshint node:true, eqnull:true, laxcomma:true, undef:true, indent:2, camelcase:false */
'use strict';


//  -- some requirements --
var jade = require('jade');
var Router = require('router');
var finalhandler = require('finalhandler');
var route = new Router();
var stylus = require('stylus');
var nib = require('nib');
var fs = require('fs');
var _static = require('node-static');
var http = require('http');


//  -- etc --
var _publicFiles = new _static.Server('./public', { headers: {'cache-control': 'no-cache, must-revalidate'}});
var PORT = process.env.PORT || 1337;
var HOST = process.env.HOST || '0.0.0.0';

//  -- build stylus file when server start --
stylus(fs.readFileSync('./public/static/css/style.styl', 'utf8'))
  .include(nib.path)
  .set('compress', true)
  .render(function(err, css) {
      if (err) { console.log(err); return; }
      fs.writeFile('./public/static/css/style.css', css, function (err_) {
        if (err_) { console.log(err_); return; }
      });
  });


//  -- serving static files (everything in public folder) --
route.all('/static/*', function (req, res) {
  _publicFiles.serve(req, res, function (err) {
    if (err) { console.log(err); return; }
  });
});

route.all('/avatars/*', function (req, res) {
  _publicFiles.serve(req, res, function (err) {
    if (err) { console.log(err); return; }
  })
});


//  -- set various routes (index in this case) --
route.get('/', function (req, res) {
  res.writeHead(200, {'Content-Type': 'text/html'});
  res.end(jade.renderFile('./views/index.jade', {}));
});


//  -- load apis --
route.use('/api/', require('./api/api'));


//  -- create server and enable routing --
var server = http.createServer(function(req, res) {
  route(req, res, finalhandler(req, res));
});

server.listen(PORT, HOST, function () { 
  console.log('[[ server is running at ' +  HOST + ' with port ' + PORT + ' ]]'); 
});