
exports.up = function(knex) {
    return knex.schema.createTable('NodeProject_01.addresses', table => {
        table.increments('id').primary();
        table.string('uf', 3);
        table.string('county').defaultTo('Brasília');
        table.string('city');
        table.string('address');
        table.string('complement');
        table.timestamp('deleted_at');
        table.timestamp('updated_at');
        table.timestamp('created_at').defaultTo(knex.fn.now());
    })
};

exports.down = function(knex) {
    return knex.schema.dropTable('NodeProject_01.addresses');
};
