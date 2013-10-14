
/**
 * dependencies
 */

var component = require('component');
var request = require('https').request;
var parse = require('url').parse;
var byline = require('byline');
var Batch = require('batch');

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

exports.stats = function(obj, fn){
  var scripts = obj.scripts || [];
  var batch = new Batch;
  var ret = {};

  // throw
  batch.throws(true);

  // stats `file`
  scripts.forEach(function(src){
    batch.push(stats(obj, src));
  });

  // all done
  batch.end(function(err, arr){
    if (err) return fn(err);
    ret.sloc = 0;
    ret.size = 0;

    arr.forEach(function(obj){
      ret.sloc += obj.sloc;
      ret.size += obj.size;
    });

    fn(null, ret);
  });
};

/**
 * Get stats with `obj` and `src`.
 *
 * @param {Object} obj
 * @param {String} src
 * @return {Function}
 * @api private
 */

function stats(obj, src){
  return function(done){
    var url = raw(obj.repo, src);
    var stats = { size: 0, sloc: 0 };
    var cb = done.bind(null, null, stats);
    var req = request(parse(url));

    req.on('error', done);
    req.on('response', function(res){

      // stream
      byline(res)
      .on('error', done)
      .on('finish', cb)
      .on('data', count);

      // size
      stats.size += parseInt(res.headers['content-length']);

      // count
      function count(line){
        line = line.toString().trim();
        if (comment(line)) return;
        ++stats.sloc;
      }

      // comment
      var within;
      function comment(line){
        if (/^\*\//.test(line)) {
          within = false;
          return /^\*\/$/.test(line);
        }

        return within
          || (within = /^\/\*/.test(line))
          || /^\/\*.*\*\/$/.test(line)
          || /^\/\//.test(line);
      }
    }).end();
  };
}

/**
 * Get `raw` file path.
 *
 * @param {String} repo
 * @param {String} src
 * @return {String}
 * @api public
 */

function raw(repo, src){
  return 'https://raw'
    + '.github.com/'
    + repo + '/master/'
    + src;
}
