/* @name FindApplicationById */
SELECT * FROM applications WHERE id = :id;

/* @name FindApplicationByUserAndVacancy */
SELECT * FROM applications WHERE user_id = :userId AND vacancy_id = :vacancyId;

/* @name CreateApplication */
INSERT INTO applications (user_id, vacancy_id)
VALUES (:userId, :vacancyId)
RETURNING *;

/* @name UpdateApplicationStatus */
UPDATE applications
SET status = :status, updated_at = now()
WHERE id = :id
RETURNING *;

/* @name UpdateApplicationNotes */
UPDATE applications
SET notes = :notes, updated_at = now()
WHERE id = :id
RETURNING *;

/* @name DeleteApplication */
DELETE FROM applications WHERE id = :id;

/* @name CountApplicationsByUser */
SELECT COUNT(id) AS count FROM applications WHERE user_id = :userId;

/* @name ListApplicationsWithVacancies */
SELECT
  a.id,
  a.status,
  a.notes,
  v.position_title,
  v.company_name,
  v.url,
  a.created_at,
  a.updated_at
FROM applications a
JOIN vacancies v ON a.vacancy_id = v.id
WHERE a.user_id = :userId
ORDER BY a.created_at DESC
LIMIT :limit
OFFSET :offset;
