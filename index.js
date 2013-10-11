
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
 * Middleware
 */

app.use(express.static(__dirname + '/build'));

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
