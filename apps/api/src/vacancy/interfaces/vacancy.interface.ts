import { VacancyStatus } from './vacancy-status.enum';

export interface Vacancy {
  id: string;
  positionTitle: string;
  companyName: string;
  url: string;
  status: VacancyStatus;
  lastSeenAt: Date;
  createdAt: Date;
  updatedAt: Date;
}
