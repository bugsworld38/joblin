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
  positionTitle: string;
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
      locs: [{ a: 36, b: 39 }],
    },
  ],
  statement: 'SELECT * FROM vacancies WHERE url = :url',
};

/**
 * Query generated from SQL:
 * ```
 * SELECT * FROM vacancies WHERE url = :url
 * ```
 */
export const findVacancyByUrl = new PreparedQuery<
  IFindVacancyByUrlParams,
  IFindVacancyByUrlResult
>(findVacancyByUrlIR);

/** 'FindAllVacancies' parameters type */
export type IFindAllVacanciesParams = void;

/** 'FindAllVacancies' return type */
export interface IFindAllVacanciesResult {
  companyName: string;
  createdAt: Date;
  id: string;
  positionTitle: string;
  updatedAt: Date;
  url: string;
}

/** 'FindAllVacancies' query type */
export interface IFindAllVacanciesQuery {
  params: IFindAllVacanciesParams;
  result: IFindAllVacanciesResult;
}

const findAllVacanciesIR: any = {
  usedParamSet: {},
  params: [],
  statement: 'SELECT * FROM vacancies ORDER BY created_at DESC',
};

/**
 * Query generated from SQL:
 * ```
 * SELECT * FROM vacancies ORDER BY created_at DESC
 * ```
 */
export const findAllVacancies = new PreparedQuery<
  IFindAllVacanciesParams,
  IFindAllVacanciesResult
>(findAllVacanciesIR);

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
  positionTitle: string;
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
      locs: [{ a: 66, b: 79 }],
    },
    {
      name: 'companyName',
      required: false,
      transform: { type: 'scalar' },
      locs: [{ a: 82, b: 93 }],
    },
    {
      name: 'url',
      required: false,
      transform: { type: 'scalar' },
      locs: [{ a: 96, b: 99 }],
    },
  ],
  statement:
    'INSERT INTO vacancies (position_title, company_name, url)\nVALUES (:positionTitle, :companyName, :url)\nRETURNING *',
};

/**
 * Query generated from SQL:
 * ```
 * INSERT INTO vacancies (position_title, company_name, url)
 * VALUES (:positionTitle, :companyName, :url)
 * RETURNING *
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
