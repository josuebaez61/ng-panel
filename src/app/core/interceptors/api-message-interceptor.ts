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

  let errorMessage = getErrorMessage(error);

  // Handle specific HTTP status codes
  switch (error.status) {
    case 0:
      errorMessage = 'Network error. Please check your internet connection.';
      break;
    case 400:
      if (!errorMessage.includes('Bad Request')) {
        errorMessage = `Bad Request: ${errorMessage}`;
      }
      break;
    case 403:
      errorMessage = "Access denied. You don't have permission to perform this action.";
      break;
    case 404:
      errorMessage = 'The requested resource was not found.';
      break;
    case 409:
      errorMessage = 'Conflict: The resource already exists or conflicts with existing data.';
      break;
    case 422:
      errorMessage = 'Validation Error: Please check your input data.';
      break;
    case 429:
      errorMessage = 'Too many requests. Please try again later.';
      break;
    case 500:
      errorMessage = 'Internal server error. Please try again later.';
      break;
    case 502:
      errorMessage = 'Bad gateway. The server is temporarily unavailable.';
      break;
    case 503:
      errorMessage = 'Service unavailable. Please try again later.';
      break;
    default:
      if (error.status >= 500) {
        errorMessage = 'Server error. Please try again later.';
      } else if (error.status >= 400) {
        errorMessage = `Request error: ${errorMessage}`;
      }
  }

  toast.error(errorMessage, {
    summary: 'Error',
    life: error.status >= 500 ? 8000 : 6000, // Longer duration for server errors
  });
}

/**
 * Extract error message from HttpErrorResponse
 */
function getErrorMessage(error: HttpErrorResponse): string {
  let errorMessage = error.message || 'An error occurred';

  if (error.error) {
    // Check if it's our API error format
    if (isFailedApiResponse(error.error)) {
      errorMessage = error.error.error.message || errorMessage;
    } else if (typeof error.error === 'string') {
      errorMessage = error.error;
    } else if (error.error.message) {
      errorMessage = error.error.message;
    }
  }

  return errorMessage;
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
