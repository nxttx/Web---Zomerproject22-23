import * as express from "express";
const router = express.Router();
import { addUser, getUserById, followUser, unfollowUser } from '../data/usersService.js';
import { getFeedByUserId, getPostsByUserId } from "../data/postsService.js";


// router.get('/', function(req, res, next) {
//   res.send('Hello World! From users.js');
// } );

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

/**
 * gets user by id
 * @route GET /users/{userId}
 * @group users - Operations about user
 * @param {integer} userId.path.required - user id
 * @returns {object} 200 - An array of user info
 */
router.get('/:userId', async function(req, res, next) {
  let userId = req.params.userId;
  
  let result = await getUserById(userId);

  if(result.rowCount == 0) {
    res.status(404).send(JSON.stringify({status: 'error', message: 'User not found'}));
    return;
  }

  // remove sign_in_code from result 
  delete result.rows[0].sign_in_code;

  // get all posts by user
  let posts = await getPostsByUserId(userId, 0);
  result.rows[0].posts = posts.rows;

  // if user is logged in, add feed to result
  if (req.user && req.user.id == userId) {
    let feed = await getFeedByUserId(userId, 500);
    result.rows[0].feed = feed.rows;
  }else {
    delete result.rows[0].email; // remove email from result if user is not logged in
  }


  res.status(200).send(JSON.stringify({status: 'success', message: 'User found', data: result.rows[0]}));
} );

/**
 * user follows another user
 * @route POST /users/{userId}/follow/{followId}
 * @group users - Operations about user
 * @param {integer} userId.path.required - user id
 * @param {integer} followId.path.required - user id to follow
 * @returns {object} 201 - An array of user info
 */
router.post('/:userId/follow/:followId', async function(req, res, next) {
  if (!req.user || req.user.id != req.params.userId) {
    res.status(401).send({status: 'error', message: 'Unauthorized'});
    return;
  }

  let userId = req.params.userId;
  let followId = req.params.followId;
  
  let result;
  try{
    result = await followUser(userId, followId);

  }catch(err) {
    if (err.code == 23505 && err.constraint == 'follows_user_id_following_id_key') {
      // unfollow user
      await unfollowUser(userId, followId);
      res.status(201).send(JSON.stringify({status: 'success', message: 'User unfollowed'}));
      return;
    }
  }
  res.status(201).send(JSON.stringify({status: 'success', message: 'User followed'}));
} );




export default router;
