import { createInfiniteQuery } from '@tanstack/svelte-query';

import { getVacancies } from './api';
import type { VacancyListFilters } from './types';

const PAGE_SIZE = 20;

export function createVacanciesQuery(filters: () => VacancyListFilters) {
	return createInfiniteQuery(() => ({
		queryKey: ['vacancies', filters()],
		queryFn: ({ pageParam }) =>
			getVacancies({ ...filters(), page: pageParam, pageSize: PAGE_SIZE }),
		initialPageParam: 1,
		getNextPageParam: (lastPage, allPages) => {
			const loaded = allPages.reduce((sum, page) => sum + page.data.length, 0);
			return loaded < lastPage.totalCount ? allPages.length + 1 : undefined;
		},
	}));
}
