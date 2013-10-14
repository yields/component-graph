
/**
 * dependencies
 */

var component = require('component');

/**
 * Get a component `json` with `repo` and `fn`.
 *
 * @param {String} repo
 * @param {Function} fn
 * @api public
 */

exports.json = function(repo, fn){
  component.info(repo, 'master', fn);
};

/**
 * Get stats of `repo` with `fn`.
 *
 * @param {Object} obj
 * @param {Function} fn
 * @api public
 */

exports.stats = function(obj, fn){};
