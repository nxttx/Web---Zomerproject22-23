import pkg from 'pg';
const { Client } = pkg;

export async function getClient(){
  const client = new Client({
    user: 'zomerProject',
    host: 'psql',
    // host: 'localhost',
    database: 'zomerProject',
    password: 'Passw0rd',
    port: 5432,
  });
  await client.connect();
  return client;
}

