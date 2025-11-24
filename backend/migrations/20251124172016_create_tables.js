/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function (knex) {
  await knex.schema.createTable('Users', (table) => {
    table.uuid('userId').primary().defaultTo(knex.fn.uuid());

    table.string('username', 50).notNullable().unique().index();
    table.string('email', 120).notNullable().unique().index();

    table.string('password', 255).notNullable();
    table.string('avatarUrl', 255);

    table.integer('experience').notNullable().defaultTo(0).index();

    table.timestamp('createdAt').defaultTo(knex.fn.now());
    table.timestamp('updatedAt').defaultTo(knex.fn.now());
  });
};

exports.down = async function (knex) {
  await knex.schema.dropTableIfExists('Users');
};
