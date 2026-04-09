require('dotenv').config();

const { POSTGRES_HOST, POSTGRES_PORT, POSTGRES_USER, POSTGRES_PASSWORD, POSTGRES_DB } = process.env;

module.exports = {
  transforms: [
    {
      mode: 'sql',
      include: '**/*.sql',
      emitTemplate: '{{dir}}/{{name}}.queries.ts',
    },
  ],
  srcDir: './src',
  camelCaseColumnNames: true,
  dbUrl: `postgres://${POSTGRES_USER}:${POSTGRES_PASSWORD}@${POSTGRES_HOST}:${POSTGRES_PORT}/${POSTGRES_DB}`,
};
