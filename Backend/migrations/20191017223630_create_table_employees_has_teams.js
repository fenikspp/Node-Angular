
exports.up = function(knex) {
    return knex.schema.createTable('NodeProject_01.employees_has_teams', table => {
       table.integer('employee').references('id')
           .inTable('NodeProject_01.employees').notNullable();
       table.integer('team').references('id')
           .inTable('NodeProject_01.teams').notNullable();
    });
};

exports.down = function(knex) {
    return knex.schema.dropTable('NodeProject_01.employees_has_teams');
};
