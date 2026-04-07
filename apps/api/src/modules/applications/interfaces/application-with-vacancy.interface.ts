import { ApplicationStatus } from './application-status.enum';

export interface ApplicationWithVacancy {
  id: string;
  status: ApplicationStatus;
  notes: string | null;
  positionTitle: string;
  companyName: string;
  url: string;
  createdAt: Date;
  updatedAt: Date;
}
