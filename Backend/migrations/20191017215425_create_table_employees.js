
exports.up = function(knex) {
    return knex.schema.createTable('NodeProject_01.employees', table => {
        table.increments('id').primary();
        table.string('name').notNullable();
        table.string('userName').unique().notNullable();
        table.string('email').unique();
        table.string('gender', 1);
        table.string('cpf').unique();
        table.timestamp('deleted_at');
        table.timestamp('updated_at');
        table.timestamp('created_at').defaultTo(knex.fn.now());
    });
};

exports.down = function(knex) {
    return knex.schema.dropTable('NodeProject_01.employees');
};
