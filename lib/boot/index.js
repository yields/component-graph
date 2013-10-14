
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
  var root;

  // root
  graph.on('root', function(node){
    stats.set('description', node.description || '');
    stats.set('repo', node.repo);
    dom('.stats').remove();
    dom('#app').append(stats.el);
    root = node;

    // sloc, size
    // TODO: clean up (superagent)
    var req = new XMLHttpRequest;
    req.open('POST', '/stats');
    req.setRequestHeader('Content-Type', 'application/json');
    req.onreadystatechange = done;
    req.send(JSON.stringify(root));

    function done(){
      if (4 != req.readyState) return;
      var obj;

      try {
        obj = JSON.parse(req.responseText);
        stats.set('sloc', obj.sloc);
        stats.set('size', obj.size);
      } catch (e) {}
    }
  });

  // nodes
  graph.on('node', function(node){
    if (root != node.parent) return;
    stats.set('deps', ++stats.deps);
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
