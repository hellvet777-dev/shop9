exports.up = function (knex) {
  return knex.schema.createTable('tokens', function (table) {
    table.increments();
    table.string('token');
    table.datetime('expireAt');
    table.timestamps();
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable('tokens');
};
