
/**
 * dependencies
 */

var GraphView = require('graph-view');
var Graph = require('graph');
var page = require('page');
var d3 = require('d3');

/**
 * Input
 */

var input = document.querySelector('input');

/**
 * show
 */

input.onkeyup = function(e){
  if (13 != e.which) return;
  e.preventDefault();
  page('/' + e.target.value);
};

/**
 * `user/component`
 *
 * TODO: clean this up
 */

page('/:u/:c', function(ctx, next){
  input.value = ctx.params.u + '/' + ctx.params.c;
  var graph = new Graph(input.value);
  d3.select('svg').remove();
  var el = d3.select('#svg').append('svg');
  var view = new GraphView(el, graph);
  graph.build();

  // click
  view.on('click', function(n){
    var to = '/' + n.repo;
    if (ctx.path != to) page(to);
  });
});

/**
 * Boot
 */

page();
