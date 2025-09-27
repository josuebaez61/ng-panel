export interface ApiResponse<T = null> {
  success: boolean;
  message: string;
  data?: T;
  errors?: unknown;
  errorCode?: string;
  timestamp: string;
  requestId?: string;
}
