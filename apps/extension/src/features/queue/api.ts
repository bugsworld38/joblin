import { apiClient } from '@/shared/api/client';
import type { PaginatedResponse, Vacancy } from '@/shared/types';

const PAGE_SIZE = 20;

export async function fetchQueue(
  keyword: string,
  page: number,
): Promise<PaginatedResponse<Vacancy>> {
  const { data } = await apiClient.get<PaginatedResponse<Vacancy>>(
    '/vacancies/queue',
    { params: { keyword, page, pageSize: PAGE_SIZE } },
  );

  return data;
}

export async function postApplied(vacancy: Vacancy): Promise<void> {
  await apiClient.post('/applications', {
    positionTitle: vacancy.positionTitle,
    companyName: vacancy.companyName,
    url: vacancy.url,
  });
}
