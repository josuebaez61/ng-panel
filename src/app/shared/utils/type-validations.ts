import { ApiResponse, FailedApiResponse } from '@core/models/api-response-models';

/**
 * Check if response has the expected API structure
 */
export function isApiResponse(response: any): response is ApiResponse<any> {
  return (
    response &&
    typeof response === 'object' &&
    typeof response.success === 'boolean' &&
    typeof response.timestamp === 'string' &&
    typeof response.path === 'string'
  );
}

export function isFailedApiResponse(error: any): error is FailedApiResponse<any> {
  return (
    error &&
    typeof error === 'object' &&
    typeof error.success === 'boolean' &&
    !error.success &&
    typeof error.error === 'object' &&
    typeof error.error.message === 'string' &&
    typeof error.error.code === 'string'
  );
}
