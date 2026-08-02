export type VacancyStatus = 'active' | 'expired';

export interface Vacancy {
  id: string;
  positionTitle: string;
  companyName: string;
  url: string;
  status: VacancyStatus;
  lastSeenAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  totalCount: number;
}
