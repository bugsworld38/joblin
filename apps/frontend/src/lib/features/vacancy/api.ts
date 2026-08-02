import { apiClient } from '$lib/shared/api';

import type { PaginatedVacancies, VacancyListParams } from './types';

export async function getVacancies(params: VacancyListParams): Promise<PaginatedVacancies> {
	const response = await apiClient.get<PaginatedVacancies>('/vacancies', { params });

	return response.data;
}
