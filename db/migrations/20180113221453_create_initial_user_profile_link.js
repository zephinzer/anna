const TABLE_NAME = 'users_profiles';

exports.up = function(knex, Promise) {
  return knex.schema.createTableIfNotExists(
    TABLE_NAME,
    (table) => {
      table.charset('utf8mb4');
      table.collate('utf8mb4_unicode_ci');
      table.integer('user_id', 10)
        .notNull()
        .unique()
        .unsigned()
        .references('users.id');
      table.integer('profile_id', 10)
        .notNull()
        .unique()
        .unsigned()
        .references('profiles.id');
    }
  );
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable(TABLE_NAME);
};
