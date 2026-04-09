/** Types generated for queries found in "src/application/queries/applications.sql" */
import { PreparedQuery } from '@pgtyped/runtime';

export type application_status = 'archived' | 'followed_up' | 'interview' | 'offer' | 'reject' | 'sent_cv' | 'test_task';

export type NumberOrString = number | string;

/** 'FindApplicationById' parameters type */
export interface IFindApplicationByIdParams {
  id?: string | null | void;
}

/** 'FindApplicationById' return type */
export interface IFindApplicationByIdResult {
  createdAt: Date;
  id: string;
  notes: string | null;
  status: application_status;
  updatedAt: Date;
  userId: string;
  vacancyId: string;
}

/** 'FindApplicationById' query type */
export interface IFindApplicationByIdQuery {
  params: IFindApplicationByIdParams;
  result: IFindApplicationByIdResult;
}

const findApplicationByIdIR: any = {"usedParamSet":{"id":true},"params":[{"name":"id","required":false,"transform":{"type":"scalar"},"locs":[{"a":38,"b":40}]}],"statement":"SELECT * FROM applications WHERE id = :id"};

/**
 * Query generated from SQL:
 * ```
 * SELECT * FROM applications WHERE id = :id
 * ```
 */
export const findApplicationById = new PreparedQuery<IFindApplicationByIdParams,IFindApplicationByIdResult>(findApplicationByIdIR);


/** 'FindApplicationByUserAndVacancy' parameters type */
export interface IFindApplicationByUserAndVacancyParams {
  userId?: string | null | void;
  vacancyId?: string | null | void;
}

/** 'FindApplicationByUserAndVacancy' return type */
export interface IFindApplicationByUserAndVacancyResult {
  createdAt: Date;
  id: string;
  notes: string | null;
  status: application_status;
  updatedAt: Date;
  userId: string;
  vacancyId: string;
}

/** 'FindApplicationByUserAndVacancy' query type */
export interface IFindApplicationByUserAndVacancyQuery {
  params: IFindApplicationByUserAndVacancyParams;
  result: IFindApplicationByUserAndVacancyResult;
}

const findApplicationByUserAndVacancyIR: any = {"usedParamSet":{"userId":true,"vacancyId":true},"params":[{"name":"userId","required":false,"transform":{"type":"scalar"},"locs":[{"a":43,"b":49}]},{"name":"vacancyId","required":false,"transform":{"type":"scalar"},"locs":[{"a":68,"b":77}]}],"statement":"SELECT * FROM applications WHERE user_id = :userId AND vacancy_id = :vacancyId"};

/**
 * Query generated from SQL:
 * ```
 * SELECT * FROM applications WHERE user_id = :userId AND vacancy_id = :vacancyId
 * ```
 */
export const findApplicationByUserAndVacancy = new PreparedQuery<IFindApplicationByUserAndVacancyParams,IFindApplicationByUserAndVacancyResult>(findApplicationByUserAndVacancyIR);


/** 'CreateApplication' parameters type */
export interface ICreateApplicationParams {
  userId?: string | null | void;
  vacancyId?: string | null | void;
}

/** 'CreateApplication' return type */
export interface ICreateApplicationResult {
  createdAt: Date;
  id: string;
  notes: string | null;
  status: application_status;
  updatedAt: Date;
  userId: string;
  vacancyId: string;
}

/** 'CreateApplication' query type */
export interface ICreateApplicationQuery {
  params: ICreateApplicationParams;
  result: ICreateApplicationResult;
}

const createApplicationIR: any = {"usedParamSet":{"userId":true,"vacancyId":true},"params":[{"name":"userId","required":false,"transform":{"type":"scalar"},"locs":[{"a":55,"b":61}]},{"name":"vacancyId","required":false,"transform":{"type":"scalar"},"locs":[{"a":64,"b":73}]}],"statement":"INSERT INTO applications (user_id, vacancy_id)\nVALUES (:userId, :vacancyId)\nRETURNING *"};

/**
 * Query generated from SQL:
 * ```
 * INSERT INTO applications (user_id, vacancy_id)
 * VALUES (:userId, :vacancyId)
 * RETURNING *
 * ```
 */
export const createApplication = new PreparedQuery<ICreateApplicationParams,ICreateApplicationResult>(createApplicationIR);


/** 'UpdateApplicationStatus' parameters type */
export interface IUpdateApplicationStatusParams {
  id?: string | null | void;
  status?: application_status | null | void;
}

/** 'UpdateApplicationStatus' return type */
export interface IUpdateApplicationStatusResult {
  createdAt: Date;
  id: string;
  notes: string | null;
  status: application_status;
  updatedAt: Date;
  userId: string;
  vacancyId: string;
}

/** 'UpdateApplicationStatus' query type */
export interface IUpdateApplicationStatusQuery {
  params: IUpdateApplicationStatusParams;
  result: IUpdateApplicationStatusResult;
}

const updateApplicationStatusIR: any = {"usedParamSet":{"status":true,"id":true},"params":[{"name":"status","required":false,"transform":{"type":"scalar"},"locs":[{"a":33,"b":39}]},{"name":"id","required":false,"transform":{"type":"scalar"},"locs":[{"a":72,"b":74}]}],"statement":"UPDATE applications\nSET status = :status, updated_at = now()\nWHERE id = :id\nRETURNING *"};

/**
 * Query generated from SQL:
 * ```
 * UPDATE applications
 * SET status = :status, updated_at = now()
 * WHERE id = :id
 * RETURNING *
 * ```
 */
export const updateApplicationStatus = new PreparedQuery<IUpdateApplicationStatusParams,IUpdateApplicationStatusResult>(updateApplicationStatusIR);


/** 'UpdateApplicationNotes' parameters type */
export interface IUpdateApplicationNotesParams {
  id?: string | null | void;
  notes?: string | null | void;
}

/** 'UpdateApplicationNotes' return type */
export interface IUpdateApplicationNotesResult {
  createdAt: Date;
  id: string;
  notes: string | null;
  status: application_status;
  updatedAt: Date;
  userId: string;
  vacancyId: string;
}

/** 'UpdateApplicationNotes' query type */
export interface IUpdateApplicationNotesQuery {
  params: IUpdateApplicationNotesParams;
  result: IUpdateApplicationNotesResult;
}

const updateApplicationNotesIR: any = {"usedParamSet":{"notes":true,"id":true},"params":[{"name":"notes","required":false,"transform":{"type":"scalar"},"locs":[{"a":32,"b":37}]},{"name":"id","required":false,"transform":{"type":"scalar"},"locs":[{"a":70,"b":72}]}],"statement":"UPDATE applications\nSET notes = :notes, updated_at = now()\nWHERE id = :id\nRETURNING *"};

/**
 * Query generated from SQL:
 * ```
 * UPDATE applications
 * SET notes = :notes, updated_at = now()
 * WHERE id = :id
 * RETURNING *
 * ```
 */
export const updateApplicationNotes = new PreparedQuery<IUpdateApplicationNotesParams,IUpdateApplicationNotesResult>(updateApplicationNotesIR);


/** 'DeleteApplication' parameters type */
export interface IDeleteApplicationParams {
  id?: string | null | void;
}

/** 'DeleteApplication' return type */
export type IDeleteApplicationResult = void;

/** 'DeleteApplication' query type */
export interface IDeleteApplicationQuery {
  params: IDeleteApplicationParams;
  result: IDeleteApplicationResult;
}

const deleteApplicationIR: any = {"usedParamSet":{"id":true},"params":[{"name":"id","required":false,"transform":{"type":"scalar"},"locs":[{"a":36,"b":38}]}],"statement":"DELETE FROM applications WHERE id = :id"};

/**
 * Query generated from SQL:
 * ```
 * DELETE FROM applications WHERE id = :id
 * ```
 */
export const deleteApplication = new PreparedQuery<IDeleteApplicationParams,IDeleteApplicationResult>(deleteApplicationIR);


/** 'CountApplicationsByUser' parameters type */
export interface ICountApplicationsByUserParams {
  userId?: string | null | void;
}

/** 'CountApplicationsByUser' return type */
export interface ICountApplicationsByUserResult {
  count: string | null;
}

/** 'CountApplicationsByUser' query type */
export interface ICountApplicationsByUserQuery {
  params: ICountApplicationsByUserParams;
  result: ICountApplicationsByUserResult;
}

const countApplicationsByUserIR: any = {"usedParamSet":{"userId":true},"params":[{"name":"userId","required":false,"transform":{"type":"scalar"},"locs":[{"a":60,"b":66}]}],"statement":"SELECT COUNT(id) AS count FROM applications WHERE user_id = :userId"};

/**
 * Query generated from SQL:
 * ```
 * SELECT COUNT(id) AS count FROM applications WHERE user_id = :userId
 * ```
 */
export const countApplicationsByUser = new PreparedQuery<ICountApplicationsByUserParams,ICountApplicationsByUserResult>(countApplicationsByUserIR);


/** 'ListApplicationsWithVacancies' parameters type */
export interface IListApplicationsWithVacanciesParams {
  limit?: NumberOrString | null | void;
  offset?: NumberOrString | null | void;
  userId?: string | null | void;
}

/** 'ListApplicationsWithVacancies' return type */
export interface IListApplicationsWithVacanciesResult {
  companyName: string;
  createdAt: Date;
  id: string;
  notes: string | null;
  positionTitle: string;
  status: application_status;
  updatedAt: Date;
  url: string;
}

/** 'ListApplicationsWithVacancies' query type */
export interface IListApplicationsWithVacanciesQuery {
  params: IListApplicationsWithVacanciesParams;
  result: IListApplicationsWithVacanciesResult;
}

const listApplicationsWithVacanciesIR: any = {"usedParamSet":{"userId":true,"limit":true,"offset":true},"params":[{"name":"userId","required":false,"transform":{"type":"scalar"},"locs":[{"a":194,"b":200}]},{"name":"limit","required":false,"transform":{"type":"scalar"},"locs":[{"a":235,"b":240}]},{"name":"offset","required":false,"transform":{"type":"scalar"},"locs":[{"a":249,"b":255}]}],"statement":"SELECT\n  a.id,\n  a.status,\n  a.notes,\n  v.position_title,\n  v.company_name,\n  v.url,\n  a.created_at,\n  a.updated_at\nFROM applications a\nJOIN vacancies v ON a.vacancy_id = v.id\nWHERE a.user_id = :userId\nORDER BY a.created_at DESC\nLIMIT :limit\nOFFSET :offset"};

/**
 * Query generated from SQL:
 * ```
 * SELECT
 *   a.id,
 *   a.status,
 *   a.notes,
 *   v.position_title,
 *   v.company_name,
 *   v.url,
 *   a.created_at,
 *   a.updated_at
 * FROM applications a
 * JOIN vacancies v ON a.vacancy_id = v.id
 * WHERE a.user_id = :userId
 * ORDER BY a.created_at DESC
 * LIMIT :limit
 * OFFSET :offset
 * ```
 */
export const listApplicationsWithVacancies = new PreparedQuery<IListApplicationsWithVacanciesParams,IListApplicationsWithVacanciesResult>(listApplicationsWithVacanciesIR);


