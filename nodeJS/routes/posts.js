// /test route  
import * as express from "express";
const router = express.Router();

import { getPosts } from '../data/postsService.js';

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

export default router;
