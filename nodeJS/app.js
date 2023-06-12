/**
 * Express webapi framework
 */
import express from 'express';
import bodyParser from "body-parser";

import test from './routes/test.js';
import users from './routes/users.js';
import auth from './routes/auth.js';

const app = express();

// for local: 
let prefix = '/api';
prefix = '';

// middleware
app.use(bodyParser.json()); // makes req.body available

// routes
app.use(prefix + '/test',  test);
app.use(prefix + '/users',  users);
app.use(prefix + '/auth',  auth);


// helloworld
app.get('/', function(req, res, next) {
  res.send('Hello World! From nodejs');
});




// start server
app.listen(80);