import { apiClient } from '@/shared/api/client';

export interface LoginResponse {
  accessToken: string;
}

export async function login(
  email: string,
  password: string,
): Promise<LoginResponse> {
  const { data } = await apiClient.post<LoginResponse>('/auth/login', {
    email,
    password,
  });

  return data;
}
