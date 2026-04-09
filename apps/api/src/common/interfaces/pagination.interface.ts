export interface PaginationParams {
  limit: number;
  offset: number;
}

export interface PaginatedData<T> {
  data: T[];
  totalCount: number;
}
