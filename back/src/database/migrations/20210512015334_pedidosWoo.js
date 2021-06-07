exports.up = function (knex) {
  return knex.schema.createTable('pedidosWoo', function (table) {
    table.increments();
    table.string('transaction_id');
    table.string('total');
    table.string('status');
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable('pedidosWoo');
};
