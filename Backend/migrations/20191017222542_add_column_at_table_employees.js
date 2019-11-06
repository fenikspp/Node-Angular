
exports.up = function(knex) {
    return knex.schema.alterTable('NodeProject_01.employees', table => {
        table.string('type').defaultTo('seller');
        table.string('password').notNullable();
    })
};

exports.down = function(knex) {
    return knex.schema.alterTable('NodeProject_01.employees', table => {
        table.dropColumn('type');
        table.dropColumn('password')
    })
};
