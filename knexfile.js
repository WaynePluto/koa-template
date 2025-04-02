// Update with your config settings.

/**
 * @type { Object.<string, import("knex").Knex.Config> }
 */
module.exports = {
  development: {
    client: 'mysql2',
    connection: {
      host: '127.0.0.1',
      database: 'my_db',
      user: 'root',
      password: '',
    },
    migrations: {
      directory: ['./scripts/migrations'],
    },
    seeds: {
      directory: './scripts/seeds',
    },
  },
}
