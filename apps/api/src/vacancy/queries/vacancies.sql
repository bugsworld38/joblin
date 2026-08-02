/* @name FindVacancyByUrl */
SELECT
  id,
  title AS "positionTitle",
  company_name AS "companyName",
  url,
  status,
  last_seen_at AS "lastSeenAt",
  created_at AS "createdAt",
  updated_at AS "updatedAt"
FROM vacancies WHERE url = :url;

/* @name FindVacancies */
SELECT
  id,
  title AS "positionTitle",
  company_name AS "companyName",
  url,
  status,
  last_seen_at AS "lastSeenAt",
  created_at AS "createdAt",
  updated_at AS "updatedAt"
FROM vacancies
WHERE (:keyword::text IS NULL OR title ILIKE '%' || :keyword || '%' OR company_name ILIKE '%' || :keyword || '%')
ORDER BY created_at DESC
LIMIT :limit
OFFSET :offset;

/* @name FindVacancyQueue */
SELECT
  id,
  title AS "positionTitle",
  company_name AS "companyName",
  url,
  status,
  last_seen_at AS "lastSeenAt",
  created_at AS "createdAt",
  updated_at AS "updatedAt"
FROM vacancies v
WHERE status = 'active'
  AND (title ILIKE '%' || :keyword || '%' OR company_name ILIKE '%' || :keyword || '%')
  AND NOT EXISTS (
    SELECT 1 FROM applications a WHERE a.vacancy_id = v.id AND a.user_id = :userId
  )
ORDER BY created_at DESC
LIMIT :limit
OFFSET :offset;

/* @name CountVacancyQueue */
SELECT COUNT(id) AS count
FROM vacancies v
WHERE status = 'active'
  AND (title ILIKE '%' || :keyword || '%' OR company_name ILIKE '%' || :keyword || '%')
  AND NOT EXISTS (
    SELECT 1 FROM applications a WHERE a.vacancy_id = v.id AND a.user_id = :userId
  );

/* @name CountVacancies */
SELECT COUNT(id) AS count FROM vacancies
WHERE (:keyword::text IS NULL OR title ILIKE '%' || :keyword || '%' OR company_name ILIKE '%' || :keyword || '%');

/* @name CreateVacancy */
INSERT INTO vacancies (title, company_name, url)
VALUES (:positionTitle, :companyName, :url)
RETURNING
  id,
  title AS "positionTitle",
  company_name AS "companyName",
  url,
  status,
  last_seen_at AS "lastSeenAt",
  created_at AS "createdAt",
  updated_at AS "updatedAt";

/* @name DeleteVacancy */
DELETE FROM vacancies WHERE id = :id;
