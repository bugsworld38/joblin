import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';

import type { AuthConfig } from '@config';
import { authConfig } from '@config';
import { UserRepository } from '@user';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { TokenPayload } from '../interfaces';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @Inject(authConfig.KEY) config: AuthConfig,
    private userRepo: UserRepository,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: config.jwtSecret,
    });
  }

  async validate(payload: TokenPayload) {
    const user = await this.userRepo.findById(payload.userId);

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    return user;
  }
}
