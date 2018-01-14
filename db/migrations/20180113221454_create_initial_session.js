const TABLE_NAME = 'sessions';

exports.up = function(knex, Promise) {
  return knex.schema.createTableIfNotExists(
    TABLE_NAME,
    (table) => {
      table.charset('utf8mb4');
      table.collate('utf8mb4_unicode_ci');
      table.increments('id')
        .primary();
      table.integer('user_id', 10)
        .notNull()
        .unique()
        .unsigned()
        .references('users.id');
      table.text('user_agent');
      table.string('ipv4_address', 16);
      table.string('ipv6_address', 40);
      table.datetime('date_ended');
      table.datetime('date_created')
        .defaultTo(knex.fn.now());
    }
  );
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable(TABLE_NAME);
};
