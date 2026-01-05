import { HttpInterceptorFn, HttpRequest, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { ApiResponse } from '../models/api-response-models';
import { Toast } from '@core/services/toast';
import { isApiResponse, isFailedApiResponse } from '@shared/utils/type-validations';
import { AuthService } from '../services/auth-service';

export const apiMessageInterceptor: HttpInterceptorFn = (req: HttpRequest<any>, next) => {
  const toast = inject(Toast);
  const authService = inject(AuthService);

  // Skip showing toasts for certain endpoints (except for 401 errors on refresh token endpoint)
  const shouldSkip = shouldSkipToast(req.url) && !isRefreshTokenEndpoint(req.url);
  if (shouldSkip) {
    return next(req);
  }

  return next(req).pipe(
    tap((event) => {
      if (event.type === 4 && event.body) {
        // Handle successful responses
        // HttpEventType.Response = 4
        handleSuccessResponse(event.body, req.url, toast);
      }
    }),
    catchError((error) => {
      // Handle error responses
      handleErrorResponse(error, req.url, toast, authService);
      return throwError(() => error);
    })
  );
};

/**
 * Handle successful API responses
 */
function handleSuccessResponse(response: any, _url: string, toast: Toast): void {
  // Check if response has the expected API structure
  if (isApiResponse(response)) {
    const apiResponse = response as ApiResponse<any>;

    // Only show toast if there's a message and it's not empty
    if (apiResponse?.message && apiResponse?.message.trim().length > 0) {
      toast.showFromApiResponse(apiResponse);
    }
  }
}

/**
 * Handle error responses
 */
function handleErrorResponse(
  error: HttpErrorResponse,
  url: string,
  toast: Toast,
  authService: AuthService
): void {
  // Handle 401 errors specially
  if (error.status === 401) {
    // If it's a refresh token endpoint error, show error and logout
    if (isRefreshTokenEndpoint(url)) {
      const errorMessage = getErrorMessage(error);
      toast.error(errorMessage, {
        summary: 'Session Expired',
        life: 6000,
      });
      authService.logout();
      return;
    }
    // For other 401 errors:
    // - If refresh token is available, don't show toast (auth interceptor will handle refresh)
    // - If refresh token is NOT available, it means refresh already failed, so show error and logout
    const refreshToken = authService.refreshToken();
    if (!refreshToken) {
      const errorMessage = getErrorMessage(error);
      toast.error(errorMessage, {
        summary: 'Authentication Error',
        life: 6000,
      });
      authService.logout();
    }
    // If refresh token exists, let auth interceptor handle it (don't show toast)
    return;
  }

  // Don't show toast for certain endpoints (for non-401 errors)
  if (shouldSkipToast(url)) {
    return;
  }

  const errorMessage = getErrorMessage(error);

  toast.error(errorMessage, {
    summary: 'Error',
    life: error.status >= 500 ? 8000 : 6000, // Longer duration for server errors
  });
}

/**
 * Extract error message from HttpErrorResponse
 * Returns specific error message from API/server if available, otherwise returns default message based on status code
 */
function getErrorMessage(error: HttpErrorResponse): string {
  let specificMessage: string | null = null;

  // Try to extract specific message from error.error
  if (error.error) {
    // Check if it's our API error format
    if (isFailedApiResponse(error.error)) {
      const apiMessage = error.error.error?.message;
      if (apiMessage && typeof apiMessage === 'string' && apiMessage.trim().length > 0) {
        specificMessage = apiMessage.trim();
      }
    } else if (typeof error.error === 'string' && error.error.trim().length > 0) {
      specificMessage = error.error.trim();
    } else if (
      error.error.message &&
      typeof error.error.message === 'string' &&
      error.error.message.trim().length > 0
    ) {
      specificMessage = error.error.message.trim();
    }
  }

  // If we have a specific message and it's not just the HTTP status text, use it
  if (specificMessage && specificMessage !== error.statusText) {
    return specificMessage;
  }

  // Otherwise, return default message based on status code
  return getDefaultErrorMessage(error.status);
}

/**
 * Get default error message based on HTTP status code
 */
function getDefaultErrorMessage(status: number | null): string {
  switch (status) {
    case 0:
      return 'Network error. Please check your internet connection.';
    case 400:
      return 'Bad Request: Please check your input data.';
    case 403:
      return "Access denied. You don't have permission to perform this action.";
    case 404:
      return 'The requested resource was not found.';
    case 409:
      return 'Conflict: The resource already exists or conflicts with existing data.';
    case 422:
      return 'Validation Error: Please check your input data.';
    case 429:
      return 'Too many requests. Please try again later.';
    case 500:
      return 'Internal server error. Please try again later.';
    case 502:
      return 'Bad gateway. The server is temporarily unavailable.';
    case 503:
      return 'Service unavailable. Please try again later.';
    default:
      if (status && status >= 500) {
        return 'Server error. Please try again later.';
      } else if (status && status >= 400) {
        return 'Request error: An error occurred while processing your request.';
      }
      return 'An error occurred';
  }
}

/**
 * Check if URL is refresh token endpoint
 */
function isRefreshTokenEndpoint(url: string): boolean {
  return url.includes('/auth/refresh-token');
}

/**
 * Check if we should skip showing toast for this endpoint
 */
function shouldSkipToast(url: string): boolean {
  const skipEndpoints = [
    '/auth/refresh-token', // Don't show toasts for token refresh
    '/health', // Health checks
    '/ping', // Ping endpoints
  ];

  return skipEndpoints.some((endpoint) => url.includes(endpoint));
}
