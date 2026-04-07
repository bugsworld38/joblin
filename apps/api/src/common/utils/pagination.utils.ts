import { PaginationParams } from '../interfaces';

export const calculatePagination = (
  page: number,
  pageSize: number,
): PaginationParams => {
  const offset = (page - 1) * pageSize;

  return { limit: pageSize, offset };
};
