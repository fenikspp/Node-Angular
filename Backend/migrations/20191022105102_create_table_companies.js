
exports.up = function(knex) {
    return knex.schema.createTable('NodeProject_01.companies', table => {
        table.increments('id').primary();
        table.string('name').notNullable();
        table.string('email');
        table.string('cnpj').unique().notNullable();
        table.string('type');
        table.timestamp('deleted_at');
        table.timestamp('updated_at');
        table.timestamp('created_at').defaultTo(knex.fn.now());
    });
};

exports.down = function(knex) {
    return knex.schema.dropTable('NodeProject_01.companies');
};
