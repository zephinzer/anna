const TABLE_NAME = 'profiles';

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
      table.string('name_full', 255);
      table.string('name_first', 64);
      table.string('name_middle', 64);
      table.string('name_last', 64);
      table.string('name_display', 128);
      table.string('picture_display', 255);
      table.text('bio');
      table.enu('gender', [
        'male',
        'female',
        'trans_male',
        'trans_female',
        'others',
        'none',
      ]);
      table.date('birth_date');
      table.string('emaill', 128);
      table.string('contact_email', 128);
      table.string('contact_number', 64);
      table.string('contact_url', 255);
      table.text('contact_address');
      table.text('others');
      table.string('provider_id', 64);
      table.string('provider_access_token', 255);
      table.string('provider_access_secret', 255);
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
