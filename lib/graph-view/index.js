
/**
 * dependencies
 */

var f = require('to-function');
var d3 = require('d3');

/**
 * Export `GraphView`
 */

module.exports = GraphView;

/**
 * Initialize `GraphView` with `el` and `graph`.
 *
 * @param {Selection} el
 * @param {Graph} graph
 * @api public
 */

function GraphView(el, graph){
  if (!(this instanceof GraphView)) return new GraphView(el, graph);
  this.hue = 100 * (Math.random() * 10 | 0);
  graph.on('built', this.built.bind(this));
  graph.on('node', this.add.bind(this));
  this.graph = graph;
  this.el = el;
}

/**
 * Get the layout.
 *
 * @return {ForceLayout}
 * @api private
 */

GraphView.prototype.layout = function(){
  if (this._layout) return this._layout;
  var tick = this.tick.bind(this);
  var el = this.el[0][0];
  var rect = el.getBoundingClientRect();
  return this._layout = d3
    .layout
    .force()
    .size([rect.width, rect.height])
    .charge(-50)
    .linkDistance(30)
    .on('tick', tick);
};

/**
 * Get circles selection.
 *
 * @return {Selection}
 * @api private
 */

GraphView.prototype.circles = function(){
  return this.el.selectAll('circle')
};

/**
 * Get lines selection.
 *
 * @return {Selection}
 * @api private
 */

GraphView.prototype.lines = function(){
  return this.el.selectAll('line');
};

/**
 * on tick.
 *
 * @api private
 */

GraphView.prototype.tick = function(){
  var circles = this.circles();
  var lines = this.lines();
  lines.attr('x1', f('source.x'));
  lines.attr('y1', f('source.y'));
  lines.attr('x2', f('target.x'));
  lines.attr('y2', f('target.y'));
  circles.attr('transform', function(n){
    return 'translate(' + n.x + ', ' + n.y + ')';
  });
};

/**
 * Add a node.
 *
 * @param {Node} node
 * @api private
 */

GraphView.prototype.add = function(node){
  var nodes = this.graph.nodes;
  var layout = this.layout();
  var circles = this.circles();

  // layout
  layout
  .nodes(nodes)
  .start();

  // circles
  circles
  .data(nodes)
  .enter()
  .append('circle')
  .attr('title', f('repo'))
  .attr('r', f('parent ? 6 : 10'))
  .attr('fill', d3.hsl(this.hue, .7, .7))
  .attr('stroke', d3.hsl(this.hue, .6, .6))
  .style('opacity', f('parent ? .7 : 1'))
  .call(layout.drag);
};

/**
 * on built
 *
 * @api private
 */

GraphView.prototype.built = function(){
  var nodes = this.graph.nodes;
  var links = this.graph.links;
  var children = [];
  var self = this;

  // layout
  this
  .layout()
  .nodes(nodes)
  .links(links)
  .start();

  // lines
  this
  .lines()
  .data(links)
  .enter()
  .insert('line', 'circle')
  .style('stroke', 'eee');
};
