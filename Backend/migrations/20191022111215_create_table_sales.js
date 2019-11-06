
exports.up = function(knex) {
    return knex.schema.createTable('NodeProject_01.sales', table => {
        table.increments('id').primary();
        table.string('status').defaultTo('Sent');
        table.integer('seller').references('id')
            .inTable('NodeProject_01.employees').notNullable();
        table.integer('individual').references('id')
            .inTable('NodeProject_01.individuals');
        table.integer('company').references('id')
            .inTable('NodeProject_01.companies');
        table.timestamp('updated_at');
        table.timestamp('created_at').defaultTo(knex.fn.now());
    });
};

exports.down = function(knex) {
    return knex.schema.dropTable('NodeProject_01.sales');
};
