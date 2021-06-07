exports.up = function (knex) {
  return knex.schema.createTable("sincronia", function (table) {
    table.increments();
    table.string("codigoShop");
    table.string("codigoEcomece");
    table.timestamps();
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable("sincronia");
};
