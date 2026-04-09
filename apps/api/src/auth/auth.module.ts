import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

import { AuthConfig, authConfig } from '@config';
import { RefreshTokenModule } from '@refresh-token';
import { UserModule } from '@user';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './strategies/jwt.strategy';
import { LocalStrategy } from './strategies/local.strategy';

@Module({
  imports: [
    JwtModule.registerAsync({
      inject: [authConfig.KEY],
      useFactory: (config: AuthConfig) => ({
        secret: config.jwtSecret,
      }),
    }),
    UserModule,
    RefreshTokenModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy, JwtStrategy],
})
export class AuthModule {}
