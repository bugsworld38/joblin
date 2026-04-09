-- migrate:up
CREATE TABLE vacancies (
  id             uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  position_title text         NOT NULL,
  company_name   text         NOT NULL,
  url            varchar(512) UNIQUE NOT NULL,
  created_at     timestamptz  NOT NULL DEFAULT now(),
  updated_at     timestamptz  NOT NULL DEFAULT now()
);

-- migrate:down
DROP TABLE IF EXISTS vacancies;

