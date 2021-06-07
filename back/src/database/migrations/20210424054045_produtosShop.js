exports.up = function (knex) {
  return knex.schema.createTable('produtosShop', function (table) {
    table.increments()
    table.string('sku').unique()
    table.string('nome')
    table.string('preco')
    table.string('codigoGrupo')
    table.string('codigoClasse')
    table.string('codigoSubclasse')
    table.string('estoqueAtual')
    table.text('observacao1')
    table.json('precos')
    table.integer('precosCount')
    table.string('inativo')
    table.timestamps()
  })
}

exports.down = function (knex) {
  return knex.schema.dropTable('produtosShop')
}
