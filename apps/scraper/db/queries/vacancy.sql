-- name: UpsertVacancy :exec
INSERT INTO vacancies (title, company_name, url, source)
VALUES (@title, @company_name, @url, @source)
ON CONFLICT (url) DO UPDATE
   SET
    title = EXCLUDED.title,
    company_name = EXCLUDED.company_name,
    status = 'active',
    last_seen_at = now(),
    updated_at = now();

-- name: ExpireStaleVacancies :exec
UPDATE vacancies
SET status = 'expired', updated_at = now()
WHERE last_seen_at < now() - interval '2 days'
  AND status = 'active';
