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

    let query = 'SELECT * FROM users WHERE email = $1';
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

    let query = 'SELECT * FROM users WHERE id = (SELECT user_id FROM token WHERE token = $1)';
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