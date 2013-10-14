
/**
 * dependencies
 */

var template = require('./template.html');
var reactive = require('reactive');
var Emitter = require('emitter');
var domify = require('domify');
var bytes = require('bytes');

/**
 * Export `StatsView`
 */

module.exports = StatsView;

/**
 * Initialize `StatsView` with `graph`.
 *
 * @param {Graph} graph
 * @api public
 */

function StatsView(graph){
  if (!(this instanceof StatsView)) return new StatsView(graph);
  var self = this;
  this.el = domify(template);
  this.set('description', '');
  this.set('repo', '');
  this.set('deps', 0);
  this.set('size', 0);
  this.set('sloc', 0);
  reactive(this.el, this, this);
}

/**
 * Mixin
 */

Emitter(StatsView.prototype);

/**
 * Set `prop` to `val`.
 *
 * @param {String} prop
 * @param {String} val
 * @return {StatsView}
 * @api public
 */

StatsView.prototype.set = function(prop, val){
  this[prop] = val;
  this.emit('change ' + prop);
  return this;
};

/**
 * Format bytes.
 *
 * @return {Number}
 * @api private
 */

StatsView.prototype.bytes = function(){
  return bytes(this.size || 0);
};
