
exports.up = function(knex) {
    return knex.schema.createTable('NodeProject_01.sales_has_products', table => {
        table.integer('sale').references('id')
            .inTable('NodeProject_01.sales').notNullable();
        table.integer('product').references('id')
            .inTable('NodeProject_01.products').notNullable();
    });
};

exports.down = function(knex) {
    return knex.schema.dropTable('NodeProject_01.sales_has_products');
};
