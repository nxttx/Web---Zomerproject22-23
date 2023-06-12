// /test route  
import * as express from "express";
const router = express.Router();

import { getPosts, insertPost, likePost, insertComment, unlikePost} from '../data/postsService.js';

/**
 * gets all posts
 * @route GET /posts
 * @group posts - Operations about posts
 * @returns {object} 200 - An array of posts
 */
router.get('/', async function(req, res, next) {
  // if post limit is set, use it
  let limit = 0;
  if (req.query.limit) {
    limit = parseInt(req.query.limit); // convert to int
  }
  let posts = await getPosts(limit)
  res.send(posts.rows);

} );

/**
 * Post a new post
 * @route POST /posts
 * @group posts - Operations about posts
 * @param {string} content.body.required - post content
 * @returns {object} 201
 */
router.post('/', async function(req, res, next) {
  if (!req.user) {
    res.status(401).send({status: 'error', message: 'Unauthorized'});
    return;
  }
  // get user id
  let userId = req.user.id;
  // get content
  let content = req.body.content;
  // insert post
  try { 
    await insertPost(userId, content);
    res.status(201).send({status: 'success', message: 'Post added'});
  } catch (error) {
    res.status(500).send({status: 'error', message: error});
  }
} );

/**
 * likes a post
 * @route POST /posts/{postId}/like
 * @group posts - Operations about posts
 * @param {integer} postId.path.required - post id
 * @returns {object} 201
 * @returns {Error}  default - Unexpected error
 */
router.post('/:postId/like', async function(req, res, next) {
  if (!req.user) {
    res.status(401).send({status: 'error', message: 'Unauthorized'});
    return;
  }

  // get user id
  let userId = req.user.id;
  // get post id
  let postId = req.params.postId;
  // insert post
  try {
    await likePost(userId, postId);
    res.status(201).send({status: 'success', message: 'Post liked'});
  } catch (error) {
    //code:"23505"
// constraint:"likes_user_id_post_id_key"
    if (error.code == '23505' && error.constraint == 'likes_user_id_post_id_key') {
      try {
        await unlikePost(userId, postId);
        res.status(201).send({status: 'success', message: 'Post unliked'});
        return;
      }
      catch (error) {
        res.status(500).send({status: 'error', message: error});
        return;
      }
    }
    res.status(500).send({status: 'error', message: error});
    return;
  }
});

/**
 * comments a on a post
 * @route POST /posts/{postId}/comment
 * @group posts - Operations about posts
 * @param {integer} postId.path.required - post id
 * @param {string} content.body.required - comment content
 * @returns {object} 201
 */
router.post('/:postId/comment', async function(req, res, next) {
  if (!req.user) {
    res.status(401).send({status: 'error', message: 'Unauthorized'});
    return;
  }
  // get user id
  let userId = req.user.id;
  // get post id
  let postId = req.params.postId;
  // get content
  let content = req.body.content;
  // insert comment on post
  try {
    await insertComment(userId, postId, content);
    res.status(201).send({status: 'success', message: 'Comment added'});
  } catch (error) {
    res.status(500).send({status: 'error', message: error});
  }
});


export default router;
