/* @name FindVacancyByUrl */
SELECT * FROM vacancies WHERE url = :url;

/* @name FindAllVacancies */
SELECT * FROM vacancies ORDER BY created_at DESC;

/* @name CreateVacancy */
INSERT INTO vacancies (position_title, company_name, url)
VALUES (:positionTitle, :companyName, :url)
RETURNING *;

/* @name DeleteVacancy */
DELETE FROM vacancies WHERE id = :id;
