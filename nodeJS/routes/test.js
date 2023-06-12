// /test route  
import * as express from "express";
const router = express.Router();

router.get('/', function(req, res, next) {
  res.send('Hello World! From test.js');
} );

export default router;
