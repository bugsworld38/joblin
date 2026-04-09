/** Types generated for queries found in "src/user/queries/users.sql" */
import { PreparedQuery } from '@pgtyped/runtime';

/** 'FindUserById' parameters type */
export interface IFindUserByIdParams {
  id?: string | null | void;
}

/** 'FindUserById' return type */
export interface IFindUserByIdResult {
  createdAt: Date;
  email: string;
  id: string;
  passwordHash: string;
  updatedAt: Date;
}

/** 'FindUserById' query type */
export interface IFindUserByIdQuery {
  params: IFindUserByIdParams;
  result: IFindUserByIdResult;
}

const findUserByIdIR: any = {"usedParamSet":{"id":true},"params":[{"name":"id","required":false,"transform":{"type":"scalar"},"locs":[{"a":31,"b":33}]}],"statement":"SELECT * FROM users WHERE id = :id"};

/**
 * Query generated from SQL:
 * ```
 * SELECT * FROM users WHERE id = :id
 * ```
 */
export const findUserById = new PreparedQuery<IFindUserByIdParams,IFindUserByIdResult>(findUserByIdIR);


/** 'FindUserByEmail' parameters type */
export interface IFindUserByEmailParams {
  email?: string | null | void;
}

/** 'FindUserByEmail' return type */
export interface IFindUserByEmailResult {
  createdAt: Date;
  email: string;
  id: string;
  passwordHash: string;
  updatedAt: Date;
}

/** 'FindUserByEmail' query type */
export interface IFindUserByEmailQuery {
  params: IFindUserByEmailParams;
  result: IFindUserByEmailResult;
}

const findUserByEmailIR: any = {"usedParamSet":{"email":true},"params":[{"name":"email","required":false,"transform":{"type":"scalar"},"locs":[{"a":34,"b":39}]}],"statement":"SELECT * FROM users WHERE email = :email"};

/**
 * Query generated from SQL:
 * ```
 * SELECT * FROM users WHERE email = :email
 * ```
 */
export const findUserByEmail = new PreparedQuery<IFindUserByEmailParams,IFindUserByEmailResult>(findUserByEmailIR);


/** 'CreateUser' parameters type */
export interface ICreateUserParams {
  email?: string | null | void;
  passwordHash?: string | null | void;
}

/** 'CreateUser' return type */
export interface ICreateUserResult {
  createdAt: Date;
  email: string;
  id: string;
  passwordHash: string;
  updatedAt: Date;
}

/** 'CreateUser' query type */
export interface ICreateUserQuery {
  params: ICreateUserParams;
  result: ICreateUserResult;
}

const createUserIR: any = {"usedParamSet":{"email":true,"passwordHash":true},"params":[{"name":"email","required":false,"transform":{"type":"scalar"},"locs":[{"a":49,"b":54}]},{"name":"passwordHash","required":false,"transform":{"type":"scalar"},"locs":[{"a":57,"b":69}]}],"statement":"INSERT INTO users (email, password_hash)\nVALUES (:email, :passwordHash)\nRETURNING *"};

/**
 * Query generated from SQL:
 * ```
 * INSERT INTO users (email, password_hash)
 * VALUES (:email, :passwordHash)
 * RETURNING *
 * ```
 */
export const createUser = new PreparedQuery<ICreateUserParams,ICreateUserResult>(createUserIR);


