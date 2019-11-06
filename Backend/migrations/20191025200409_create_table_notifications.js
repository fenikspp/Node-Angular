
exports.up = function(knex) {
    return knex.schema.createTable('NodeProject_01.notifications', table => {
        table.increments('id').primary();
        table.integer('from').references('id')
            .inTable('NodeProject_01.employees');
        table.integer('to').references('id')
            .inTable('NodeProject_01.employees');
        table.string('subject').notNullable();
        table.binary('content').notNullable();
        table.timestamp('sent_date').defaultTo(knex.fn.now());
    });
};

exports.down = function(knex) {
    return knex.schema.dropTable('NodeProject_01.notifications');
};
