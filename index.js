
/**
 * dependencies
 */

var component = require('./lib/component');
var express = require('express');

/**
 * Export `app`
 */

var app = module.exports = express();

/**
 * Middleware
 */

app.use(express.json());
app.use(express.static(__dirname + '/build'));

/**
 * GET `/:user/:name`
 */

app.get('/:user/:name', function(req, res, next){
  if (req.accepts('html')) return next();
  var params = req.params;
  var pkg = params.user + '/' + params.name;
  component.json(pkg, function(err, obj){
    if (err) return next(err);
    res.send(obj);
  });
});

/**
 * POST `/stats`
 */

app.post('/stats', function(req, res){
  component.stats(req.body, function(err, stats){
    if (err) return req.next(err);
    res.send(stats);
  });
});

/**
 * GET `*`
 */

app.get('*', function(req, res, next){
  if (!req.accepts('html')) return next();
  res.sendfile(__dirname + '/app.html');
});
