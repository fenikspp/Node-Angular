
exports.up = function(knex) {
    return knex.schema.createTable('NodeProject_01.companies_has_phones', table => {
        table.integer('company').references('id')
            .inTable('NodeProject_01.companies').notNullable();
        table.integer('phone').references('id')
            .inTable('NodeProject_01.phones').notNullable();
    });
};

exports.down = function(knex) {
    return knex.schema.dropTable('NodeProject_01.companies_has_phones');
};
