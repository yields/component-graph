
/**
 * dependencies
 */

var app = require('./');

/**
 * `PORT`
 */

var port = process.env.PORT || 3000;

/**
 * Listen `PORT`
 */

app.listen(port, function(){
  console.log('component-graph on %d', port)
});
