import { registerAs } from '@nestjs/config';

export interface AuthConfig {
  jwtSecret: string;
}

export const authConfig = registerAs(
  'auth',
  (): AuthConfig => ({
    jwtSecret: process.env.JWT_SECRET!,
  }),
);
