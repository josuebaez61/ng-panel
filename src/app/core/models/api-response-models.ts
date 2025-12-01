export interface ApiResponse<T = null> {
  success: boolean;
  message?: string;
  data?: T;
  error?: ApiError;
  timestamp: string;
  path: string;
}

export interface ApiError {
  message: string;
  timestamp: string;
  path: string;
}
