/** Types generated for queries found in "src/vacancy/queries/vacancies.sql" */
import { PreparedQuery } from '@pgtyped/runtime';

/** 'FindVacancyByUrl' parameters type */
export interface IFindVacancyByUrlParams {
  url?: string | null | void;
}

/** 'FindVacancyByUrl' return type */
export interface IFindVacancyByUrlResult {
  companyName: string;
  createdAt: Date;
  id: string;
  lastSeenAt: Date;
  positionTitle: string;
  status: string;
  updatedAt: Date;
  url: string;
}

/** 'FindVacancyByUrl' query type */
export interface IFindVacancyByUrlQuery {
  params: IFindVacancyByUrlParams;
  result: IFindVacancyByUrlResult;
}

const findVacancyByUrlIR: any = {
  usedParamSet: { url: true },
  params: [
    {
      name: 'url',
      required: false,
      transform: { type: 'scalar' },
      locs: [{ a: 207, b: 210 }],
    },
  ],
  statement:
    'SELECT\n  id,\n  title AS "positionTitle",\n  company_name AS "companyName",\n  url,\n  status,\n  last_seen_at AS "lastSeenAt",\n  created_at AS "createdAt",\n  updated_at AS "updatedAt"\nFROM vacancies WHERE url = :url',
};

/**
 * Query generated from SQL:
 * ```
 * SELECT
 *   id,
 *   title AS "positionTitle",
 *   company_name AS "companyName",
 *   url,
 *   status,
 *   last_seen_at AS "lastSeenAt",
 *   created_at AS "createdAt",
 *   updated_at AS "updatedAt"
 * FROM vacancies WHERE url = :url
 * ```
 */
export const findVacancyByUrl = new PreparedQuery<
  IFindVacancyByUrlParams,
  IFindVacancyByUrlResult
>(findVacancyByUrlIR);

/** 'FindVacancies' parameters type */
export interface IFindVacanciesParams {
  keyword?: string | null | void;
  limit?: number | string | null | void;
  offset?: number | string | null | void;
}

/** 'FindVacancies' return type */
export interface IFindVacanciesResult {
  companyName: string;
  createdAt: Date;
  id: string;
  lastSeenAt: Date;
  positionTitle: string;
  status: string;
  updatedAt: Date;
  url: string | null;
}

/** 'FindVacancies' query type */
export interface IFindVacanciesQuery {
  params: IFindVacanciesParams;
  result: IFindVacanciesResult;
}

const findVacanciesIR: any = {
  usedParamSet: { keyword: true, limit: true, offset: true },
  params: [
    {
      name: 'keyword',
      required: false,
      transform: { type: 'scalar' },
      locs: [
        { a: 160, b: 167 },
        { a: 205, b: 212 },
        { a: 250, b: 257 },
      ],
    },
    {
      name: 'limit',
      required: false,
      transform: { type: 'scalar' },
      locs: [{ a: 298, b: 303 }],
    },
    {
      name: 'offset',
      required: false,
      transform: { type: 'scalar' },
      locs: [{ a: 312, b: 318 }],
    },
  ],
  statement:
    'SELECT\n  id,\n  title AS "positionTitle",\n  company_name AS "companyName",\n  url,\n  status,\n  last_seen_at AS "lastSeenAt",\n  created_at AS "createdAt",\n  updated_at AS "updatedAt"\nFROM vacancies\nWHERE (:keyword::text IS NULL OR title ILIKE \'%\' || :keyword || \'%\' OR company_name ILIKE \'%\' || :keyword || \'%\')\nORDER BY created_at DESC\nLIMIT :limit\nOFFSET :offset',
};

/**
 * Query generated from SQL:
 * ```
 * SELECT
 *   id,
 *   title AS "positionTitle",
 *   company_name AS "companyName",
 *   url,
 *   status,
 *   last_seen_at AS "lastSeenAt",
 *   created_at AS "createdAt",
 *   updated_at AS "updatedAt"
 * FROM vacancies
 * WHERE (:keyword::text IS NULL OR title ILIKE '%' || :keyword || '%' OR company_name ILIKE '%' || :keyword || '%')
 * ORDER BY created_at DESC
 * LIMIT :limit
 * OFFSET :offset
 * ```
 */
export const findVacancies = new PreparedQuery<
  IFindVacanciesParams,
  IFindVacanciesResult
>(findVacanciesIR);

/** 'FindVacancyQueue' parameters type */
export interface IFindVacancyQueueParams {
  keyword?: string | null | void;
  limit?: number | string | null | void;
  offset?: number | string | null | void;
  userId?: string | null | void;
}

/** 'FindVacancyQueue' return type */
export interface IFindVacancyQueueResult {
  companyName: string;
  createdAt: Date;
  id: string;
  lastSeenAt: Date;
  positionTitle: string;
  status: string;
  updatedAt: Date;
  url: string | null;
}

/** 'FindVacancyQueue' query type */
export interface IFindVacancyQueueQuery {
  params: IFindVacancyQueueParams;
  result: IFindVacancyQueueResult;
}

const findVacancyQueueIR: any = {
  usedParamSet: { keyword: true, userId: true, limit: true, offset: true },
  params: [
    {
      name: 'keyword',
      required: false,
      transform: { type: 'scalar' },
      locs: [
        { a: 247, b: 254 },
        { a: 292, b: 299 },
      ],
    },
    {
      name: 'userId',
      required: false,
      transform: { type: 'scalar' },
      locs: [{ a: 403, b: 409 }],
    },
    {
      name: 'limit',
      required: false,
      transform: { type: 'scalar' },
      locs: [{ a: 446, b: 451 }],
    },
    {
      name: 'offset',
      required: false,
      transform: { type: 'scalar' },
      locs: [{ a: 460, b: 466 }],
    },
  ],
  statement:
    'SELECT\n  id,\n  title AS "positionTitle",\n  company_name AS "companyName",\n  url,\n  status,\n  last_seen_at AS "lastSeenAt",\n  created_at AS "createdAt",\n  updated_at AS "updatedAt"\nFROM vacancies v\nWHERE status = \'active\'\n  AND (title ILIKE \'%\' || :keyword || \'%\' OR company_name ILIKE \'%\' || :keyword || \'%\')\n  AND NOT EXISTS (\n    SELECT 1 FROM applications a WHERE a.vacancy_id = v.id AND a.user_id = :userId\n  )\nORDER BY created_at DESC\nLIMIT :limit\nOFFSET :offset',
};

/**
 * Query generated from SQL:
 * ```
 * SELECT
 *   id,
 *   title AS "positionTitle",
 *   company_name AS "companyName",
 *   url,
 *   status,
 *   last_seen_at AS "lastSeenAt",
 *   created_at AS "createdAt",
 *   updated_at AS "updatedAt"
 * FROM vacancies v
 * WHERE status = 'active'
 *   AND (title ILIKE '%' || :keyword || '%' OR company_name ILIKE '%' || :keyword || '%')
 *   AND NOT EXISTS (
 *     SELECT 1 FROM applications a WHERE a.vacancy_id = v.id AND a.user_id = :userId
 *   )
 * ORDER BY created_at DESC
 * LIMIT :limit
 * OFFSET :offset
 * ```
 */
export const findVacancyQueue = new PreparedQuery<
  IFindVacancyQueueParams,
  IFindVacancyQueueResult
>(findVacancyQueueIR);

/** 'CountVacancyQueue' parameters type */
export interface ICountVacancyQueueParams {
  keyword?: string | null | void;
  userId?: string | null | void;
}

/** 'CountVacancyQueue' return type */
export interface ICountVacancyQueueResult {
  count: string | null;
}

/** 'CountVacancyQueue' query type */
export interface ICountVacancyQueueQuery {
  params: ICountVacancyQueueParams;
  result: ICountVacancyQueueResult;
}

const countVacancyQueueIR: any = {
  usedParamSet: { keyword: true, userId: true },
  params: [
    {
      name: 'keyword',
      required: false,
      transform: { type: 'scalar' },
      locs: [
        { a: 93, b: 100 },
        { a: 138, b: 145 },
      ],
    },
    {
      name: 'userId',
      required: false,
      transform: { type: 'scalar' },
      locs: [{ a: 249, b: 255 }],
    },
  ],
  statement:
    "SELECT COUNT(id) AS count\nFROM vacancies v\nWHERE status = 'active'\n  AND (title ILIKE '%' || :keyword || '%' OR company_name ILIKE '%' || :keyword || '%')\n  AND NOT EXISTS (\n    SELECT 1 FROM applications a WHERE a.vacancy_id = v.id AND a.user_id = :userId\n  )",
};

/**
 * Query generated from SQL:
 * ```
 * SELECT COUNT(id) AS count
 * FROM vacancies v
 * WHERE status = 'active'
 *   AND (title ILIKE '%' || :keyword || '%' OR company_name ILIKE '%' || :keyword || '%')
 *   AND NOT EXISTS (
 *     SELECT 1 FROM applications a WHERE a.vacancy_id = v.id AND a.user_id = :userId
 *   )
 * ```
 */
export const countVacancyQueue = new PreparedQuery<
  ICountVacancyQueueParams,
  ICountVacancyQueueResult
>(countVacancyQueueIR);

/** 'CountVacancies' parameters type */
export interface ICountVacanciesParams {
  keyword?: string | null | void;
}

/** 'CountVacancies' return type */
export interface ICountVacanciesResult {
  count: string | null;
}

/** 'CountVacancies' query type */
export interface ICountVacanciesQuery {
  params: ICountVacanciesParams;
  result: ICountVacanciesResult;
}

const countVacanciesIR: any = {
  usedParamSet: { keyword: true },
  params: [
    {
      name: 'keyword',
      required: false,
      transform: { type: 'scalar' },
      locs: [
        { a: 48, b: 55 },
        { a: 93, b: 100 },
        { a: 138, b: 145 },
      ],
    },
  ],
  statement:
    "SELECT COUNT(id) AS count FROM vacancies\nWHERE (:keyword::text IS NULL OR title ILIKE '%' || :keyword || '%' OR company_name ILIKE '%' || :keyword || '%')",
};

/**
 * Query generated from SQL:
 * ```
 * SELECT COUNT(id) AS count FROM vacancies
 * WHERE (:keyword::text IS NULL OR title ILIKE '%' || :keyword || '%' OR company_name ILIKE '%' || :keyword || '%')
 * ```
 */
export const countVacancies = new PreparedQuery<
  ICountVacanciesParams,
  ICountVacanciesResult
>(countVacanciesIR);

/** 'CreateVacancy' parameters type */
export interface ICreateVacancyParams {
  companyName?: string | null | void;
  positionTitle?: string | null | void;
  url?: string | null | void;
}

/** 'CreateVacancy' return type */
export interface ICreateVacancyResult {
  companyName: string;
  createdAt: Date;
  id: string;
  lastSeenAt: Date;
  positionTitle: string;
  status: string;
  updatedAt: Date;
  url: string;
}

/** 'CreateVacancy' query type */
export interface ICreateVacancyQuery {
  params: ICreateVacancyParams;
  result: ICreateVacancyResult;
}

const createVacancyIR: any = {
  usedParamSet: { positionTitle: true, companyName: true, url: true },
  params: [
    {
      name: 'positionTitle',
      required: false,
      transform: { type: 'scalar' },
      locs: [{ a: 57, b: 70 }],
    },
    {
      name: 'companyName',
      required: false,
      transform: { type: 'scalar' },
      locs: [{ a: 73, b: 84 }],
    },
    {
      name: 'url',
      required: false,
      transform: { type: 'scalar' },
      locs: [{ a: 87, b: 90 }],
    },
  ],
  statement:
    'INSERT INTO vacancies (title, company_name, url)\nVALUES (:positionTitle, :companyName, :url)\nRETURNING\n  id,\n  title AS "positionTitle",\n  company_name AS "companyName",\n  url,\n  status,\n  last_seen_at AS "lastSeenAt",\n  created_at AS "createdAt",\n  updated_at AS "updatedAt"',
};

/**
 * Query generated from SQL:
 * ```
 * INSERT INTO vacancies (title, company_name, url)
 * VALUES (:positionTitle, :companyName, :url)
 * RETURNING
 *   id,
 *   title AS "positionTitle",
 *   company_name AS "companyName",
 *   url,
 *   status,
 *   last_seen_at AS "lastSeenAt",
 *   created_at AS "createdAt",
 *   updated_at AS "updatedAt"
 * ```
 */
export const createVacancy = new PreparedQuery<
  ICreateVacancyParams,
  ICreateVacancyResult
>(createVacancyIR);

/** 'DeleteVacancy' parameters type */
export interface IDeleteVacancyParams {
  id?: string | null | void;
}

/** 'DeleteVacancy' return type */
export type IDeleteVacancyResult = void;

/** 'DeleteVacancy' query type */
export interface IDeleteVacancyQuery {
  params: IDeleteVacancyParams;
  result: IDeleteVacancyResult;
}

const deleteVacancyIR: any = {
  usedParamSet: { id: true },
  params: [
    {
      name: 'id',
      required: false,
      transform: { type: 'scalar' },
      locs: [{ a: 33, b: 35 }],
    },
  ],
  statement: 'DELETE FROM vacancies WHERE id = :id',
};

/**
 * Query generated from SQL:
 * ```
 * DELETE FROM vacancies WHERE id = :id
 * ```
 */
export const deleteVacancy = new PreparedQuery<
  IDeleteVacancyParams,
  IDeleteVacancyResult
>(deleteVacancyIR);
