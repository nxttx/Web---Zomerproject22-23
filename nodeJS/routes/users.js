import * as express from "express";
const router = express.Router();
import { addUser } from '../data/usersService.js';


router.get('/', function(req, res, next) {
  res.send('Hello World! From users.js');
} );

/**
 * Creates a new user
 * @route POST /users
 * @group users - Operations about user
 * @param {string} username
 * @param {string} email
 * @returns {object} 201 - An array of user info
 */
router.post('/', async function(req, res, next) {
  let username = req.body.username;
  let email = req.body.email;

  let result = await addUser(username, email);

  if(result.rowCount == 0) {
    res.status(500).send(JSON.stringify({status: 'error', message: 'User not added'}));
  }

  res.status(201).send(JSON.stringify({status: 'success', message: 'User added'}));
} );


export default router;
