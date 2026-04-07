import { registerAs } from '@nestjs/config';

export interface SwaggerConfig {
  enabled: boolean;
  title: string;
  description: string;
  path: string;
}

export const swaggerConfig = registerAs(
  'swagger',
  (): SwaggerConfig => ({
    enabled: process.env.NODE_ENV !== 'production',
    title: 'Joblin API',
    description: 'Job search application API documentation',
    path: 'api/docs',
  }),
);
