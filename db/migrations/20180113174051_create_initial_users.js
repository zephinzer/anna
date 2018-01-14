const TABLE_NAME = 'users';

exports.up = function(knex, Promise) {
  return knex.schema.createTableIfNotExists(
    TABLE_NAME,
    (table) => {
      table.charset('utf8mb4');
      table.collate('utf8mb4_unicode_ci');
      table.increments('id')
        .primary();
      table.string('uuid', 64)
        .notNullable()
        .unique();
      table.string('handle', 64);
      table.string('primary_email', 128)
        .notNullable();
      table.string('secondary_email', 128);
      table.string('phone_number', 64);
      table.string('password', 255);
      table.string('name_full', 255);
      table.string('name_first', 64);
      table.string('name_middle', 64);
      table.string('name_last', 64);
      table.string('name_display', 128);
      table.timestamp('last_modified')
        .defaultTo(knex.fn.now());
      table.timestamp('date_created')
        .defaultTo(knex.fn.now());
    }
  );
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable(TABLE_NAME);
};
