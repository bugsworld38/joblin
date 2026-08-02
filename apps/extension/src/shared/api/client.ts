import axios from 'axios';

import { accessTokenStorage } from '@/features/auth/storage';

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? 'http://localhost:3001',
  withCredentials: true,
});

apiClient.interceptors.request.use(async (config) => {
  const token = await accessTokenStorage.getValue();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

let isRefreshing = false;
let queue: Array<(token: string) => void> = [];

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config;

    if (error.response?.status !== 401 || original.url === '/auth/refresh') {
      return Promise.reject(error);
    }

    if (isRefreshing) {
      return new Promise((resolve) => {
        queue.push((token) => {
          original.headers.Authorization = `Bearer ${token}`;
          resolve(apiClient(original));
        });
      });
    }

    isRefreshing = true;

    try {
      const { data } = await apiClient.post('/auth/refresh');

      await accessTokenStorage.setValue(data.accessToken);
      processQueue(data.accessToken);

      original.headers.Authorization = `Bearer ${data.accessToken}`;

      return apiClient(original);
    } catch (refreshError) {
      await accessTokenStorage.removeValue();
      queue = [];

      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  },
);

function processQueue(newToken: string) {
  queue.forEach((resolve) => resolve(newToken));
  queue = [];
}
