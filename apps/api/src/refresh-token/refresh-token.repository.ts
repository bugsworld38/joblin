import { Injectable } from '@nestjs/common';

import { Pool } from 'pg';

import type { CreateRefreshTokenData, RefreshToken } from './interfaces';
import {
  createRefreshToken,
  findRefreshTokenByTokenHash,
  revokeRefreshToken,
} from './queries/refresh-tokens.queries';

@Injectable()
export class RefreshTokenRepository {
  constructor(private readonly pool: Pool) {}

  async findByTokenHash(tokenHash: string): Promise<RefreshToken | undefined> {
    const [token] = await findRefreshTokenByTokenHash.run({ tokenHash }, this.pool);
    return token;
  }

  async create(data: CreateRefreshTokenData): Promise<RefreshToken> {
    const [token] = await createRefreshToken.run(data, this.pool);
    return token;
  }

  async revoke(tokenHash: string): Promise<void> {
    await revokeRefreshToken.run({ tokenHash }, this.pool);
  }
}
