-- name: UpsertVacancy :exec
INSERT INTO vacancies (title, company_name, url)
VALUES (@title, @company_name, @url)
ON CONFLICT (url) DO UPDATE
   SET
    title = EXCLUDED.title,
    company_name = EXCLUDED.company_name,
    updated_at = now();
