import { registerAs } from '@nestjs/config';

export interface AppConfig {
  nodeEnv: string;
  port: number;
  webOrigin: string;
  extensionOrigin?: string;
}

export const appConfig = registerAs(
  'app',
  (): AppConfig => ({
    nodeEnv: process.env.NODE_ENV!,
    port: parseInt(process.env.PORT!, 10),
    webOrigin: process.env.WEB_ORIGIN!,
    extensionOrigin: process.env.EXTENSION_ORIGIN,
  }),
);
