exports.up = function (knex) {
  return knex.schema.createTable('produtosWoo', function (table) {
    table.increments();
    table.string('idWoo');
    table.string('sku');
    table.string('nome');
    table.timestamps();
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable('produtosWoo');
};
