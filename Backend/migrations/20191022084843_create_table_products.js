
exports.up = function(knex) {
    return knex.schema.createTable('NodeProject_01.products', table => {
        table.increments('id').primary();
        table.string('name').notNullable();
        table.string('segment').notNullable();
        table.integer('points');
        table.float('price');
        table.timestamp('deleted_at');
        table.timestamp('updated_at');
        table.timestamp('created_at').defaultTo(knex.fn.now());
    });
};

exports.down = function(knex) {
    return knex.schema.dropTable('NodeProject_01.products');
};
