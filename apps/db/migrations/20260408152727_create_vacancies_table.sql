-- migrate:up
CREATE TYPE vacancy_status AS ENUM ('active', 'expired');

CREATE TABLE vacancies (
  id             uuid           PRIMARY KEY DEFAULT gen_random_uuid(),
  title          text           NOT NULL,
  company_name   text           NOT NULL,
  url            varchar(512)   UNIQUE,
  source         text,
  status         vacancy_status NOT NULL DEFAULT 'active',
  last_seen_at   timestamptz    NOT NULL DEFAULT now(),
  created_at     timestamptz    NOT NULL DEFAULT now(),
  updated_at     timestamptz    NOT NULL DEFAULT now()
);

-- migrate:down
DROP TABLE IF EXISTS vacancies;
DROP TYPE IF EXISTS vacancy_status;

