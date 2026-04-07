import { ApplicationStatus } from './application-status.enum';

export interface Application {
  id: string;
  userId: string;
  vacancyId: string;
  status: ApplicationStatus;
  notes: string | null;
  createdAt: Date;
  updatedAt: Date;
}
