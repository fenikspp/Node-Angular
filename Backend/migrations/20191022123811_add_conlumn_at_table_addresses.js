
exports.up = function(knex) {
    return knex.schema.alterTable('NodeProject_01.addresses', table => {
        table.string('cep');
    })
};

exports.down = function(knex) {
    return knex.schema.alterTable('NodeProject_01.addresses', table => {
        table.dropColumn('cep');
    })
};
