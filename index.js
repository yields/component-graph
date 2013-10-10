
/**
 * dependencies
 */

var component = require('component')
var express = require('express');

/**
 * Export `app`
 */

var app = module.exports = express();

/**
 * serve `build.js`
 */

app.get('/build.js', function(req, res){
  res.type('js');
  res.sendfile(__dirname + '/build/build.js');
});

/**
 * serve `build.css`
 */

app.get('/build.css', function(req, res){
  res.type('css');
  res.sendfile(__dirname + '/build/build.css');
});

/**
 * GET `/:user/:name`
 */

app.get('/:user/:name', function(req, res, next){
  if (req.accepts('html')) return next();
  var params = req.params;
  var pkg = params.user + '/' + params.name;
  component.info(pkg, 'master', function(err, obj){
    if (err) return res.send(404, {});
    res.send(obj);
  });
});

/**
 * GET `*`
 */

app.get('*', function(req, res, next){
  if (!req.accepts('html')) return next();
  res.sendfile(__dirname + '/app.html');
});
