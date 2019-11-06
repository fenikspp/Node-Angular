
exports.up = function(knex) {
    return knex.schema.createTable('NodeProject_01.teams', table => {
       table.increments('id').primary();
       table.string('name').notNullable();
       table.integer('supervisor').references('id')
           .inTable('NodeProject_01.employees').unique();
        table.timestamp('deleted_at');
        table.timestamp('updated_at');
        table.timestamp('created_at').defaultTo(knex.fn.now());
    });
};

exports.down = function(knex) {
    return knex.schema.dropTable('NodeProject_01.teams');
};
