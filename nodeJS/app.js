/**
 * Express webapi framework
 */
import express from 'express';
import bodyParser from "body-parser";

import test from './routes/test.js';
import users from './routes/users.js';
import auth from './routes/auth.js';
import posts from './routes/posts.js';
import { getUserByToken } from './data/usersService.js';

const app = express();

// for local: 
let prefix = '/api';
prefix = '';

// middleware
app.use(bodyParser.json()); // makes req.body available
// custom middleware function
app.use(async function(req, res, next) {
  // find user by token 
  let token = req.headers['authorization']; // Express headers are auto converted to lowercase
  let user = (await getUserByToken(token)).rows[0];
  if (user){
    req.user = user;
  } else {
    req.user = false;
  }
  next();
});


// routes
app.use(prefix + '/test',  test);
app.use(prefix + '/users',  users);
app.use(prefix + '/auth',  auth);
app.use(prefix + '/posts',  posts);


// helloworld
app.get('/', function(req, res, next) {
  res.send('Hello World! From nodejs');
});




// start server
app.listen(80);