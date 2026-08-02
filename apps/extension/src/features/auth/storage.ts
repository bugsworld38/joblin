import { storage } from '#imports';

export const accessTokenStorage = storage.defineItem<string | null>(
  'local:accessToken',
  { fallback: null },
);
