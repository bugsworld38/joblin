/** Types generated for queries found in "src/refresh-token/queries/refresh-tokens.sql" */
import { PreparedQuery } from '@pgtyped/runtime';

export type DateOrString = Date | string;

/** 'FindRefreshTokenByTokenHash' parameters type */
export interface IFindRefreshTokenByTokenHashParams {
  tokenHash?: string | null | void;
}

/** 'FindRefreshTokenByTokenHash' return type */
export interface IFindRefreshTokenByTokenHashResult {
  createdAt: Date;
  expiresAt: Date;
  id: string;
  isRevoked: boolean;
  tokenHash: string;
  updatedAt: Date;
  userId: string;
}

/** 'FindRefreshTokenByTokenHash' query type */
export interface IFindRefreshTokenByTokenHashQuery {
  params: IFindRefreshTokenByTokenHashParams;
  result: IFindRefreshTokenByTokenHashResult;
}

const findRefreshTokenByTokenHashIR: any = {
  usedParamSet: { tokenHash: true },
  params: [
    {
      name: 'tokenHash',
      required: false,
      transform: { type: 'scalar' },
      locs: [{ a: 48, b: 57 }],
    },
  ],
  statement: 'SELECT *\nFROM refresh_tokens\nWHERE token_hash = :tokenHash',
};

/**
 * Query generated from SQL:
 * ```
 * SELECT *
 * FROM refresh_tokens
 * WHERE token_hash = :tokenHash
 * ```
 */
export const findRefreshTokenByTokenHash = new PreparedQuery<
  IFindRefreshTokenByTokenHashParams,
  IFindRefreshTokenByTokenHashResult
>(findRefreshTokenByTokenHashIR);

/** 'CreateRefreshToken' parameters type */
export interface ICreateRefreshTokenParams {
  expiresAt?: DateOrString | null | void;
  tokenHash?: string | null | void;
  userId?: string | null | void;
}

/** 'CreateRefreshToken' return type */
export interface ICreateRefreshTokenResult {
  createdAt: Date;
  expiresAt: Date;
  id: string;
  isRevoked: boolean;
  tokenHash: string;
  updatedAt: Date;
  userId: string;
}

/** 'CreateRefreshToken' query type */
export interface ICreateRefreshTokenQuery {
  params: ICreateRefreshTokenParams;
  result: ICreateRefreshTokenResult;
}

const createRefreshTokenIR: any = {
  usedParamSet: { userId: true, tokenHash: true, expiresAt: true },
  params: [
    {
      name: 'userId',
      required: false,
      transform: { type: 'scalar' },
      locs: [{ a: 69, b: 75 }],
    },
    {
      name: 'tokenHash',
      required: false,
      transform: { type: 'scalar' },
      locs: [{ a: 78, b: 87 }],
    },
    {
      name: 'expiresAt',
      required: false,
      transform: { type: 'scalar' },
      locs: [{ a: 90, b: 99 }],
    },
  ],
  statement:
    'INSERT INTO refresh_tokens (user_id, token_hash, expires_at)\nVALUES (:userId, :tokenHash, :expiresAt)\nRETURNING *',
};

/**
 * Query generated from SQL:
 * ```
 * INSERT INTO refresh_tokens (user_id, token_hash, expires_at)
 * VALUES (:userId, :tokenHash, :expiresAt)
 * RETURNING *
 * ```
 */
export const createRefreshToken = new PreparedQuery<
  ICreateRefreshTokenParams,
  ICreateRefreshTokenResult
>(createRefreshTokenIR);

/** 'RevokeRefreshToken' parameters type */
export interface IRevokeRefreshTokenParams {
  tokenHash?: string | null | void;
}

/** 'RevokeRefreshToken' return type */
export type IRevokeRefreshTokenResult = void;

/** 'RevokeRefreshToken' query type */
export interface IRevokeRefreshTokenQuery {
  params: IRevokeRefreshTokenParams;
  result: IRevokeRefreshTokenResult;
}

const revokeRefreshTokenIR: any = {
  usedParamSet: { tokenHash: true },
  params: [
    {
      name: 'tokenHash',
      required: false,
      transform: { type: 'scalar' },
      locs: [{ a: 83, b: 92 }],
    },
  ],
  statement:
    'UPDATE refresh_tokens\nSET is_revoked = true, updated_at = now()\nWHERE token_hash = :tokenHash',
};

/**
 * Query generated from SQL:
 * ```
 * UPDATE refresh_tokens
 * SET is_revoked = true, updated_at = now()
 * WHERE token_hash = :tokenHash
 * ```
 */
export const revokeRefreshToken = new PreparedQuery<
  IRevokeRefreshTokenParams,
  IRevokeRefreshTokenResult
>(revokeRefreshTokenIR);
