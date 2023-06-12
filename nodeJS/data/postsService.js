import {getClient} from './psqlClient.js';

export async function getPosts(limit){
  const client = await getClient();
  let result;

  try { 

    let query = 
    "SELECT "+ 
    "  posts.id "+ 
    " ,posts.content "+ 
    " ,posts.created_at "+ 
    " ,users.username " + 
    " ,to_char(posts.created_at AT TIME ZONE 'Europe/Amsterdam', 'YYYY-MM-DD HH24:MI:SS') as created_at_amsterdam " +
    " ,count(likes.id) as likes "+
    "FROM posts "+ 
    "  INNER JOIN users "+
    "    ON posts.user_id = users.id "+
    "  LEFT JOIN likes "+
    "    ON posts.id = likes.post_id "+
    "GROUP BY posts.id, users.username "+
    "ORDER BY posts.created_at DESC ";

    if (limit > 0){
      result = await client.query(query+ "LIMIT $1", [limit]);
    } else {
      result = await client.query(query);
    }

  }catch (err) {
   
    throw err;

  } finally {
    client.end();
  }
  return result
}

export async function insertPost(userId, content){
  const client = await getClient();
  let result;

  try { 

    result = await client.query(
      "INSERT INTO posts (user_id, content) VALUES ($1, $2)", 
      [userId, content]
    );

  }catch (err) {
   
    throw err;

  } finally {
    client.end();
  }
  return result
}

export async function likePost(userId, postId){
  const client = await getClient();
  let result;

  try { 

    result = await client.query(
      "INSERT INTO likes (user_id, post_id) VALUES ($1, $2)", 
      [userId, postId]
    );

  }catch (err) {
   
    throw err;

  } finally {
    client.end();
  }
  return result
}

export async function unlikePost(userId, postId){
  const client = await getClient();
  let result;

  try { 

    result = await client.query(
      "DELETE FROM likes WHERE user_id = $1 AND post_id = $2", 
      [userId, postId]
    );

  }catch (err) {
   
    throw err;

  } finally {
    client.end();
  }
  return result
}

export async function insertComment(userId, postId, content){
  const client = await getClient();
  let result;

  try { 

    result = await client.query(
      "INSERT INTO comments (user_id, post_id, content) VALUES ($1, $2, $3)", 
      [userId, postId, content]
    );

  }catch (err) {
   
    throw err;

  } finally {
    client.end();
  }
  return result
}
