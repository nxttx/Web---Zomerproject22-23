// /test route  
const express = require('express');
const router = express.Router();

router.get('/', function(req, res, next) {
  res.send('Hello World! From test.js');
} );

module.exports = router;
