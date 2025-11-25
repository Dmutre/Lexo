/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function (knex) {
  await knex.schema.createTable('GameSessions', (table) => {
    table.uuid('gameSessionId').primary().defaultTo(knex.fn.uuid());

    table.uuid('userId').notNullable().references('userId').inTable('Users').onDelete('CASCADE');

    table
      .enu('mode', ['PARTIALS', 'LETTERS'], {
        useNative: true,
        enumName: 'GameMode',
      })
      .notNullable()
      .index();

    table
      .enu('status', ['ACtIVE', 'FINISHED'], {
        useNative: true,
        enumName: 'GameSessionStatus',
      })
      .notNullable()
      .defaultTo('active')
      .index();

    table.integer('score').notNullable().defaultTo(0);

    table.timestamp('startedAt').defaultTo(knex.fn.now());
    table.timestamp('endedAt');

    table.timestamp('createdAt').defaultTo(knex.fn.now());
    table.timestamp('updatedAt').defaultTo(knex.fn.now());
  });
};

exports.down = async function (knex) {
  await knex.raw('DROP TYPE IF EXISTS game_mode');
  await knex.raw('DROP TYPE IF EXISTS game_session_status');
  await knex.schema.dropTableIfExists('GameSessions');
};
