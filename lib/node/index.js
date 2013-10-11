
/**
 * Export `Node`
 */

module.exports = Node;

/**
 * Initialize component `Node` with `repo`.
 *
 * @param {String} repo
 * @param {Node} parent
 * @api public
 */

function Node(repo, parent){
  if (!(this instanceof Node)) return new Node(repo);
  this.parent = parent;
  this.repo = repo;
  this.nodes = [];
  this.link = {
    source: parent || this,
    target: this
  };
}

/**
 * Get the node dependencies.
 *
 * @return {Array}
 * @api public
 */

Node.prototype.deps = function(){
  return Object.keys(this.dependencies || {}) || [];
};

/**
 * Merge `obj` with self.
 *
 * @param {Object} obj
 * @api public
 */

Node.prototype.merge = function(obj){
  for (var k in obj) this[k] = obj[k];
  return this;
};

/**
 * Get the component `json` calling `fn(err, obj)`.
 *
 * @param {Function} fn
 * @api private
 */

Node.prototype.json = function(fn){
  var req = new XMLHttpRequest;
  var self = this;
  req.open('GET', '/' + this.repo);
  req.setRequestHeader('Accept', 'application/json');
  req.onreadystatechange = done;
  req.onerror = fn;
  req.send();

  function done(){
    if (4 != req.readyState) return;
    try {
      var obj = JSON.parse(req.responseText);
      self.merge(obj);
      fn(null, self);
    } catch (e) {
      fn(e);
    }
  }
};
