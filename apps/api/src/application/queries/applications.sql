/* @name FindApplicationById */
SELECT
  id,
  user_id AS "userId",
  vacancy_id AS "vacancyId",
  status,
  notes,
  created_at AS "createdAt",
  updated_at AS "updatedAt"
FROM applications WHERE id = :id;

/* @name FindApplicationByUserAndVacancy */
SELECT
  id,
  user_id AS "userId",
  vacancy_id AS "vacancyId",
  status,
  notes,
  created_at AS "createdAt",
  updated_at AS "updatedAt"
FROM applications WHERE user_id = :userId AND vacancy_id = :vacancyId;

/* @name CreateApplication */
INSERT INTO applications (user_id, vacancy_id)
VALUES (:userId, :vacancyId)
RETURNING
  id,
  user_id AS "userId",
  vacancy_id AS "vacancyId",
  status,
  notes,
  created_at AS "createdAt",
  updated_at AS "updatedAt";

/* @name UpdateApplicationStatus */
UPDATE applications
SET status = :status, updated_at = now()
WHERE id = :id
RETURNING
  id,
  user_id AS "userId",
  vacancy_id AS "vacancyId",
  status,
  notes,
  created_at AS "createdAt",
  updated_at AS "updatedAt";

/* @name UpdateApplicationNotes */
UPDATE applications
SET notes = :notes, updated_at = now()
WHERE id = :id
RETURNING
  id,
  user_id AS "userId",
  vacancy_id AS "vacancyId",
  status,
  notes,
  created_at AS "createdAt",
  updated_at AS "updatedAt";

/* @name DeleteApplication */
DELETE FROM applications WHERE id = :id;

/* @name CountApplicationsByUser */
SELECT COUNT(id) AS count FROM applications WHERE user_id = :userId;

/* @name ListApplicationsWithVacancies */
SELECT
  a.id,
  a.status,
  a.notes,
  v.title AS "positionTitle",
  v.company_name AS "companyName",
  v.url,
  a.created_at AS "createdAt",
  a.updated_at AS "updatedAt"
FROM applications a
JOIN vacancies v ON a.vacancy_id = v.id
WHERE a.user_id = :userId
ORDER BY a.created_at DESC
LIMIT :limit
OFFSET :offset;
