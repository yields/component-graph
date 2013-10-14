
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
