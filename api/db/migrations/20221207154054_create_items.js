/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable('items', table => {
    table.increments("id").primary();
    table.integer('userId').notNullable();
    table.foreign('userId').references('users.id').onDelete("CASCADE");
    table.string('itemName').notNullable();
    table.string('description', 1000);
    table.integer('quantity').notNullable();
    table.timestamps(true, true);
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.alterTable('items', table => {
    table.dropForeign('userId');
  })
  .then (function() {
      return knex.schema.dropTableIfExists('items');
  })
};
