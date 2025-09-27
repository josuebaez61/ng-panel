import { HttpInterceptorFn, HttpRequest, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { ApiResponse } from '../models/api-response-models';
import { Toast } from '@core/services/toast';

export const apiMessageInterceptor: HttpInterceptorFn = (req: HttpRequest<any>, next) => {
  const toast = inject(Toast);

  // Skip showing toasts for certain endpoints
  if (shouldSkipToast(req.url)) {
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
      handleErrorResponse(error, req.url, toast);
      return throwError(() => error);
    })
  );
};

/**
 * Handle successful API responses
 */
function handleSuccessResponse(response: any, url: string, toast: Toast): void {
  // Check if response has the expected API structure
  if (isApiResponse(response)) {
    const apiResponse = response as ApiResponse<any>;

    // Only show toast if there's a message and it's not empty
    if (apiResponse.message && apiResponse.message.trim().length > 0) {
      toast.showFromApiResponse(apiResponse);
    }
  }
}

/**
 * Handle error responses
 */
function handleErrorResponse(error: HttpErrorResponse, url: string, toast: Toast): void {
  let errorMessage = 'An error occurred';
  let errorDetails: any = null;

  errorMessage = error.message;

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
    case 401:
      errorMessage = 'Unauthorized access. Please login again.';
      // Optionally redirect to login
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

  if (error.error) {
    // Check if it's our API error format
    if (isApiResponse(error.error)) {
      const apiError = error.error as ApiResponse<any>;
      errorMessage = apiError.message || errorMessage;
      errorDetails = apiError.errors;
    } else if (typeof error.error === 'string') {
      errorMessage = error.error;
    } else if (error.error.message) {
      errorMessage = error.error.message;
    }
  }

  // Handle validation errors specifically
  if (error.status === 422 && errorDetails) {
    handleValidationErrors(errorDetails, toast);
  } else {
    toast.error(errorMessage, {
      summary: 'Error',
      life: error.status >= 500 ? 8000 : 6000, // Longer duration for server errors
    });
  }

  // Log error for debugging
  console.error('HTTP Error:', {
    url,
    status: error.status,
    message: errorMessage,
    details: errorDetails || error.error,
  });
}

/**
 * Handle validation errors from API
 */
function handleValidationErrors(errors: any, toast: Toast): void {
  const errorMessages: string[] = [];

  if (Array.isArray(errors)) {
    errorMessages.push(...errors);
  } else if (typeof errors === 'object') {
    Object.keys(errors).forEach((field) => {
      const fieldErrors = errors[field];
      if (Array.isArray(fieldErrors)) {
        fieldErrors.forEach((error) => {
          errorMessages.push(`${field}: ${error}`);
        });
      } else if (typeof fieldErrors === 'string') {
        errorMessages.push(`${field}: ${fieldErrors}`);
      }
    });
  }

  if (errorMessages.length > 0) {
    // Show first few errors, truncate if too many
    const displayErrors = errorMessages.slice(0, 3);
    const message = displayErrors.join('; ');

    toast.error(message, {
      summary: 'Validation Error',
      life: 8000,
    });

    // If there are more errors, show a summary
    if (errorMessages.length > 3) {
      setTimeout(() => {
        toast.info(
          `And ${errorMessages.length - 3} more validation errors. Please check all fields.`,
          { life: 6000 }
        );
      }, 1000);
    }
  }
}

/**
 * Check if response has the expected API structure
 */
function isApiResponse(response: any): boolean {
  return (
    response &&
    typeof response === 'object' &&
    typeof response.success === 'boolean' &&
    typeof response.message === 'string'
  );
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
