import {getClient} from './psqlClient.js';

export async function addUser(username, email){
  const client = await getClient();
  let result;

  try { 

    let query = 'INSERT INTO users(username, email) VALUES($1, $2)';
    let values = [username, email];
    result = await client.query(query, values);
  }catch (err) {
    if(err.code == 23505 && err.constraint == 'users_email_key') {
      throw new Error('Email already exists');
    }
    else if(err.code == 23505 && err.constraint == 'users_username_key') {
      throw new Error('Username already exists');
    }
    else {
      throw err;
    }

  } finally {
    client.end();
  }
  return result
}

export async function getUserByEmail(email){
  const client = await getClient();
  let result;

  try { 

    // select everyting of users where email is equal to email and add amount of follows
    let query = 
    'SELECT  '+
    ' users.* '+
    ' , (SELECT COUNT(*) FROM follows WHERE follows.following_id = users.id) AS amountOfFollowers  '+
    'FROM users '+
    'WHERE email = $1';
    let values = [email];
    result = await client.query(query, values);
  }catch (err) {
    throw err;
  } finally {
    client.end();
  }
  return result
}

export async function updateUser(user){
  const client = await getClient();
  let result;

  try {
    let query = 'UPDATE users SET username = $1, email = $2, profile_picture = $3, status = $4, sign_in_code = $5 WHERE id = $6';
    let values = [user.username, user.email, user.profile_picture, user.status, user.sign_in_code, user.id];

    result = await client.query(query, values);
  }catch (err) {
    throw err;
  }
  finally {
    client.end();
  }
  return result
}



/**
 * gets user by token. If no user is found, returns false
 * @param {string} token
 * @returns {object} user
 */
export async function getUserByToken(token){
  const client = await getClient();
  let result;

  try { 

    // select everyting of users where token is equal to token and add amount of follows
    let query =
    'SELECT  '+
    ' users.* '+
    ' , (SELECT COUNT(*) FROM follows WHERE follows.following_id = users.id) AS amountOfFollowers  '+
    'FROM users '+
    'WHERE id = (SELECT user_id FROM token WHERE token = $1)';
    
    let values = [token];

    result = await client.query(query, values);
  }catch (err) {
    throw err;  
  }
  finally {
    client.end();
  }
  return result;
}

/**
 * gets user by id. If no user is found, returns false
 * @param {int} id
 * @returns {object} user
 */
export async function getUserById(id){
  const client = await getClient();
  let result;
  
  try {
    // select everyting of users where id is equal to id and add amount of follows
    let query =
    'SELECT  '+
    ' users.* '+
    ' , (SELECT COUNT(*) FROM follows WHERE follows.following_id = users.id) AS amountOfFollowers  '+
    'FROM users '+
    'WHERE id = $1';
    let values = [id];
    
    result = await client.query(query, values);
  }catch (err) {
    throw err;
  }
  finally {
    client.end();
  }
  return result;
}

/**
 * insert token into token table
 * @param {int} user_id
 * @param {string} token
 * @returns {boolean}
 */
export async function insertToken(user_id, token){
  const client = await getClient();
  let result;

  try { 

    let query = 'INSERT INTO token(user_id, token) VALUES($1, $2)';
    let values = [user_id, token];

    result = await client.query(query, values);
  }catch (err) {
    throw err;
  }
  finally {
    client.end();
  }
  return result;
}

/** 
 * user follows another user
 * @param {int} user_id
 * @param {int} following_id
 * @returns {boolean}
 */
export async function followUser(user_id, following_id){
  const client = await getClient();
  let result;

  try { 

    let query = 'INSERT INTO follows(user_id, following_id) VALUES($1, $2)';
    let values = [user_id, following_id];

    result = await client.query(query, values);
  }catch (err) {
    throw err;
  }
  finally {
    client.end();
  }
  return result;
}

/**
 * unfollow user
 * @param {int} user_id
 * @param {int} following_id
 * @returns {boolean}
 */
export async function unfollowUser(user_id, following_id){
  // check if user is already following
  const client = await getClient();
  let result;

  try { 

    let query = 'DELETE FROM follows WHERE user_id = $1 AND following_id = $2';
    let values = [user_id, following_id];

    result = await client.query(query, values);
  }catch (err) {
    throw err;
  }
  finally {
    client.end();
  }
  return result;
}
