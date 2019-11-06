
exports.up = function(knex) {
    return knex.schema.createTable('NodeProject_01.individuals', table => {
        table.increments('id').primary();
        table.string('name').notNullable();
        table.string('email');
        table.string('cpf').unique().notNullable();
        table.string('rg').unique();
        table.string('gender', 1);
        table.string('mother_name');
        table.date('birth_date');
        table.timestamp('deleted_at');
        table.timestamp('updated_at');
        table.timestamp('created_at').defaultTo(knex.fn.now());
    });
};

exports.down = function(knex) {
    return knex.schema.dropTable('NodeProject_01.individuals');
};
