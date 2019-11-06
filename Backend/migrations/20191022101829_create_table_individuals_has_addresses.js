
exports.up = function(knex) {
    return knex.schema.createTable('NodeProject_01.individuals_has_addresses', table => {
        table.integer('individual').references('id')
            .inTable('NodeProject_01.individuals').notNullable();
        table.integer('address').references('id')
            .inTable('NodeProject_01.addresses').notNullable();
    });
};

exports.down = function(knex) {
    return knex.schema.dropTable('NodeProject_01.individuals_has_addresses');
};
