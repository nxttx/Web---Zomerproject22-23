/**
 * Express webapi framework
 */
var express = require('express');
var app = express();


// middleware

// routes
app.use('/test',  require('./routes/test'));

// helloworld
app.get('/', function(req, res, next) {
  res.send('Hello World! From nodejs');
});




// start server
app.listen(8080);