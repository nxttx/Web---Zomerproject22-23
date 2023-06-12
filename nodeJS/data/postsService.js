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
    "FROM posts "+ 
    "  INNER JOIN users "+
    "    ON posts.user_id = users.id "+
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