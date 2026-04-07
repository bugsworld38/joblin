import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('applications', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));

    table
      .uuid('user_id')
      .references('id')
      .inTable('users')
      .onDelete('CASCADE')
      .notNullable();

    table
      .uuid('vacancy_id')
      .references('id')
      .inTable('vacancies')
      .onDelete('CASCADE')
      .notNullable();

    table
      .enum(
        'status',
        [
          'sent_cv',
          'followed_up',
          'test_task',
          'interview',
          'reject',
          'offer',
          'archived',
        ],
        {
          useNative: true,
          enumName: 'application_status',
        },
      )
      .defaultTo('sent_cv');

    table.text('notes');

    table.unique(['user_id', 'vacancy_id']);
    table.timestamps(true, true);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('applications');
  await knex.raw('DROP TYPE IF EXISTS application_status');
}
