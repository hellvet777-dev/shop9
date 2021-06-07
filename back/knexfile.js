require('dotenv').config();

module.exports = {
  development: {
    client: 'mysql2',
    connection: {
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      port: process.env.DB_PORT,
    },
    migrations: {
      tableName: 'knex_migrations',
      directory: './src/database/migrations',
    },
  },

  production: {
    client: 'mysql2',
    connection: {
      host: 'mysql743.umbler.com',
      user: 'shopadm',
      password: 'h88y5RQcioiT',
      database: 'sp_produtos',
      port: 3306,
    },
    migrations: {
      tableName: 'knex_migrations',
      directory: './src/database/migrations',
    },
  },

  development2: {
    client: 'sqlite3',
    connection: {
      filename: './src/database/test.sqlite',
    },
  },
};
