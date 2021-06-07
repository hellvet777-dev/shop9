const knex = require('knex');
const configuration = require('../../knexfile');
const config = configuration[process.env.DB_CONNECTION || 'test'];
const connection = knex(config);
module.exports = connection;
