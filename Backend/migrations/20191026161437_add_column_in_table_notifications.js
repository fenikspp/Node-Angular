
exports.up = function(knex) {
    return knex.schema.alterTable('NodeProject_01.notifications', table => {
        table.string('status').defaultTo('sent');
    })
};

exports.down = function(knex) {
    return knex.schema.alterTable('NodeProject_01.notifications', table => {
        table.dropColumn('status');
    })
};
