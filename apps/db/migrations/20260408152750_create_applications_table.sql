-- migrate:up
CREATE TYPE application_status AS ENUM (
  'sent_cv',
  'followed_up',
  'test_task',
  'interview',
  'reject',
  'offer',
  'archived'
);

CREATE TABLE applications (
  id         uuid               PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    uuid               NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  vacancy_id uuid               NOT NULL REFERENCES vacancies(id) ON DELETE CASCADE,
  status     application_status NOT NULL DEFAULT 'sent_cv',
  notes      text,
  created_at timestamptz        NOT NULL DEFAULT now(),
  updated_at timestamptz        NOT NULL DEFAULT now(),
  UNIQUE (user_id, vacancy_id)
);

-- migrate:down
DROP TABLE IF EXISTS applications;
DROP TYPE IF EXISTS application_status;

