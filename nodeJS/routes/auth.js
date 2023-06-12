import fetch from 'node-fetch';
import * as express from "express";
import {getUserByEmail, updateUser, getUserByToken, insertToken} from '../data/usersService.js';
const router = express.Router();

router.get('/', function(req, res, next) {
  res.send('Hello World! From auth.js');
} );

/**
 * request code
 * @route GET /auth/requestCode
 * @group auth - Operations about auth
 * @param {string} email.query.required - email
 * @returns {object} 200 - status and message
 */
router.get('/requestCode', async function(req, res, next) {
  
  let email = req.query.email;
  let code = Math.floor(Math.random() * 100000);

  // get user by email
  let user;
  try{
    user = await getUserByEmail(email);
  }catch(err){
    if (err.code == 23505 && err.constraint == "users_email_key") {
      res.status(400).json({status: "error", message: "Email already exists"});
      return;
    }
    else {
      res.status(400).json({status: "error", message: "Something went wrong"});
      return;
    }
  }
  if(user.rowCount == 0){
    res.status(400).json({status: "error", message: "Email not found"});
    return;
  }

  // update user with code
  console.log(user.rows[0]);
  user = user.rows[0];
  user.sign_in_code = code;
  try{
    await updateUser(user);
  }catch(err){
    res.status(400).json({status: "error", message: "Something went wrong"});
    return;
  }

  // send email with code
  let request = await fetch(`http://mailserver/sendLoginToken.php?to=${user.email}&code=${code}`);
  let response = await request.json();
  if(response.status == "error"){
    res.status(400).json({status: "error", message: "Something went wrong"});
    return;
  }

  res.status(200).json({status: "success", message: "Code sent"});
});

/**
 * login
 * @route POST /auth/login
 * @group auth - Operations about auth
 * @param {string} email.query.required - email
 * @param {string} code.query.required - code
 * @returns {object} 200 - status, token 
 * @returns {object} 500 - status, message
 */
router.post('/login', async function(req, res, next) {
  // get email and code from request
  let email = req.body.email;
  let code = req.body.code;

  // get user by email`
  let user;
  try{
    user = await getUserByEmail(email);
  }catch(err){
    console.log(err);
    // Email not found
    res.status( 400 ).json({status: "error", message: "Email not found"});
    return;
  }

  // check if code is correct
  user = user.rows[0];
  console.log(user.sign_in_code, code)
  if(user.sign_in_code != code){
    res.status(403).json({status: "error", message: "Code is incorrect"});
    return;
  }

  // update user with code
  user.sign_in_code = null;
  try{
    await updateUser(user);
  }catch(err){
    res.status(400).json({status: "error", message: "Something went wrong"});
    return;
  }

  // create token random token 
  // check if token is unique
  // if not unique, create new token
  let token;
  do {
    token = "NodeJS" +  Math.floor(Math.random() * 100000000000000000000000);
    console.log( (await getUserByToken(token)).rows );
  } while ((await getUserByToken(token)).rows.length != 0);

  // insert token
  try{
    await insertToken(user.id, token);
  }catch(err){
    res.status(400).json({status: "error", message: "Something went wrong"});
    return;
  }

  // return token
  res.status(200).json({status: "success", token: token});
});
   
      
export default router;
