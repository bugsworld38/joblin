export interface Vacancy {
	id: string;
	positionTitle: string;
	companyName: string;
	url: string;
	createdAt: string;
	updatedAt: string;
}

export interface VacancyListParams {
	keyword?: string;
	page?: number;
	pageSize?: number;
}

export type VacancyListFilters = Omit<VacancyListParams, 'page'>;

export interface PaginatedVacancies {
	data: Vacancy[];
	totalCount: number;
}
