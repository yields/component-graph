
/**
 * dependencies
 */

var page = require('page');
var graph = require('graph');
var tip = require('tip');
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
  var g = graph(input.value);

  // nodes, links
  var nodes, links;

  // remove
  d3.select('svg').remove();

  // add
  var el = d3
    .select('div')
    .append('svg')
    .attr('width', 700)
    .attr('height', 500);

  // hue
  var hue = Math.random() * 10 | 0;

  // layout
  var layout = d3
    .layout
    .force()
    .size([700, 500])
    .linkDistance(40)
    .on('tick', function(){
      nodes.attr('transform', function(n){
        return 'translate(' + n.x + ',' + n.y + ')';
      });
    });

  // node
  g.on('node', function(node){

    // update
    layout
    .nodes(g.nodes)
    .start();

    // node
    nodes = el
      .selectAll('circle.node')
      .data(g.nodes);

    // enter
    // TODO: color == size
    nodes
      .enter()
      .append('circle')
      .attr('class', 'node')
      .attr('title', function(n){ return n.repo; })
      .attr('r', function(n){ return n.parent ? 6 : 10; })
      .style('fill', d3.hsl(hue * 100, .7, .725))
      .style('stroke', d3.hsl(hue * 100, .6, .625))
      .on('click', function(e){ page('/' + e.repo); })
      .style('opacity', function(n){ return n.parent ? .7 : 1; })
      .call(layout.drag);
  });

  // built
  g.on('built', function(){
    nodes = el.selectAll('circle.node').data(g.nodes);
    links = el.selectAll('line.link').data(g.links);

    // update
    layout
      .nodes(g.nodes)
      .links(g.links)
      .start();

    // enter
    links
      .enter()
      .insert('line', '.node')
      .attr('class', 'link')
      .style('stroke', 'eee');

    // tick
    layout.on('tick', function(){
      links.attr('x1', function(n){ return n.source.x; });
      links.attr('y1', function(n){ return n.source.y; });
      links.attr('x2', function(n){ return n.target.x; });
      links.attr('y2', function(n){ return n.target.y; });
      nodes.attr('transform', function(n){
        return 'translate(' + n.x + ', ' + n.y + ')';
      });
    });

    // tip
    tip('[title]');
  });

  // build
  g.build();
});

/**
 * Boot
 */

page();
