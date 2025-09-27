import { ApiResponse } from './api-response-models';

export interface PaginationMetadata {
  currentPage: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  currentPageItemCount: number;
  firstItemIndex: number;
  lastItemIndex: number;
  globalSearch?: string;
  sortBy?: string;
  sortDirection?: string;
}

export interface PaginationResponse<T> {
  items: T[];
  metadata: PaginationMetadata;
}

export interface PaginationRequest {
  page: number;
  limit: number;
  globalSearch?: string;
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
  filters?: Record<string, string | boolean | number | null>;
}

export type ApiPaginationResponse<T> = ApiResponse<PaginationResponse<T>>;
