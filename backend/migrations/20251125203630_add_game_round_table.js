/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function (knex) {
  await knex.schema.createTable('GameRounds', (table) => {
    table.uuid('gameRoundId').primary().defaultTo(knex.fn.uuid());

    table
      .uuid('gameSessionId')
      .notNullable()
      .references('gameSessionId')
      .inTable('GameSessions')
      .onDelete('CASCADE');

    table.jsonb('taskPayload').notNullable();

    table.string('userAnswer', 255);
    table.integer('scoreAwarded').defaultTo(0);

    table.timestamp('createdAt').defaultTo(knex.fn.now());
    table.timestamp('updatedAt').defaultTo(knex.fn.now());
  });
};

exports.down = async function (knex) {
  await knex.schema.dropTableIfExists('GameRounds');
};
