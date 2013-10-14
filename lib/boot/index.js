
/**
 * dependencies
 */

var GraphView = require('graph-view');
var StatsView = require('stats-view');
var Graph = require('graph');
var page = require('page');
var dom = require('dom');
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
 */

page('/:u/:c', function(ctx, next){
  input.value = ctx.params.u + '/' + ctx.params.c;
  var graph = new Graph(input.value);
  d3.select('svg').remove();
  var el = d3.select('#svg').append('svg');
  var view = new GraphView(el, graph);
  var stats = new StatsView(graph);

  // root
  graph.on('root', function(node){
    stats.set('description', node.description || '');
    stats.set('deps', node.deps().length);
    stats.set('repo', node.repo);
    dom('.stats').remove();
    dom('#app').append(stats.el);
  });

  // build
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
