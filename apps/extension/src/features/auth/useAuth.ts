import { useEffect, useState } from 'react';

import { login as loginRequest } from '@/features/auth/api';
import { accessTokenStorage } from '@/features/auth/storage';

export function useAuth() {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    accessTokenStorage.getValue().then((token) => {
      setAccessToken(token);
      setIsLoading(false);
    });

    return accessTokenStorage.watch((newToken) => setAccessToken(newToken));
  }, []);

  async function login(email: string, password: string) {
    const { accessToken: token } = await loginRequest(email, password);
    await accessTokenStorage.setValue(token);
  }

  async function logout() {
    await accessTokenStorage.removeValue();
  }

  return { accessToken, isLoading, login, logout };
}
