import { Injectable } from '@nestjs/common';

import { CreateRefreshTokenData } from './interfaces';
import { RefreshTokensRepository } from './refresh-tokens.repository';

@Injectable()
export class RefreshTokensService {
  constructor(private refreshTokenRepo: RefreshTokensRepository) {}

  async findByTokenHash(tokenHash: string) {
    return this.refreshTokenRepo.findOne({ tokenHash }, [
      'userId',
      'tokenHash',
      'isRevoked',
      'expiresAt',
    ]);
  }

  async save(createRefreshTokenData: CreateRefreshTokenData) {
    return this.refreshTokenRepo.create(createRefreshTokenData);
  }

  async revoke(tokenHash: string) {
    return this.refreshTokenRepo.update({ tokenHash }, { isRevoked: true });
  }
}
