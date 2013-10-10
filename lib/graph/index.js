
/**
 * dependencies
 */

var Emitter = require('emitter');
var Batch = require('batch');
var Node = require('node');

/**
 * Export `Graph`
 */

module.exports = Graph;

/**
 * Initialize `Graph` with `repo`.
 *
 * @param {String} repo
 * @api public
 */

function Graph(repo){
  if (!(this instanceof Graph)) return new Graph(repo);
  this.node = new Node(repo);
}

/**
 * Mixins
 */

Emitter(Graph.prototype);

/**
 * Build the graph.
 *
 * @param {Function} fn
 * @return {Graph}
 * @api public
 */

Graph.prototype.build = function(fn){
  this.tree(this.node);
  return this;
};

/**
 * Recursively fetch nodes.
 *
 * @param {Node} node
 * @api private
 */

Graph.prototype.tree = function(node, fn){
  var self = this;
  node.json(function(err, node){
    if (err) return self.emit('error', err);

    // batch
    var batch = new Batch;

    // deps
    var deps = node.deps();

    // nodes, links
    self.nodes = self.nodes || [];
    self.links = self.links || [];

    // add
    self.links.push(node.link);
    self.nodes.push(node);

    // ready
    self.emit('node', node);

    // resolve deps
    deps.forEach(function(dep){
      batch.push(function(done){
        dep = new Node(dep, node);
        self.tree(dep, done);
      });
    });

    // all done
    batch.end(function(err){
      if (err) return self.emit('error', err);
      self.emit('built', self);
    });
  });
};
