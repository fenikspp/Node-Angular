
exports.up = function(knex) {
    return knex.schema.createTable('NodeProject_01.individuals_has_phones', table => {
        table.integer('individual').references('id')
            .inTable('NodeProject_01.individuals').notNullable();
        table.integer('phone').references('id')
            .inTable('NodeProject_01.phones').notNullable();
    });
};

exports.down = function(knex) {
    return knex.schema.dropTable('NodeProject_01.individuals_has_phones');
};
