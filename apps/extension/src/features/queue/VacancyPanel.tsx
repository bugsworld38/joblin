import type { Vacancy } from '@/shared/types';

interface VacancyPanelProps {
  vacancy: Vacancy;
}

export function VacancyPanel({ vacancy }: VacancyPanelProps) {
  return (
    <div>
      <h2>{vacancy.positionTitle}</h2>
      <p>{vacancy.companyName}</p>
      <a href={vacancy.url} target="_blank" rel="noreferrer">
        {vacancy.url}
      </a>
    </div>
  );
}
