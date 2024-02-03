// import the knex library that will allow us to
// construct SQL statements
const knex = require('knex');
const config = {
  client: 'pg',
  connection: {
    host : 'localhost',
    port : 5432,
    user : 'postgres',
    password : '123',
    database : 'postgres'
  }
};

const db = knex(config);
// expose the created connection so we can
// use it in other files to make sql statements
module.exports = db;