import { HttpErrorResponse, HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';
import {
  from,
  switchMap,
  catchError,
  throwError,
  BehaviorSubject,
  filter,
  take,
  finalize,
} from 'rxjs';
import { AuthService } from '../services/auth-service';
import { StorageService } from '../services/storage-service';
import { X_REFRESH_TOKEN_KEY } from '@core/constants';

// Flag and subject to handle multiple simultaneous refresh attempts
let isRefreshing = false;
const refreshTokenSubject = new BehaviorSubject<string | null>(null);

export const authInterceptor: HttpInterceptorFn = (req: HttpRequest<any>, next) => {
  const authService = inject(AuthService);
  const storageService = inject(StorageService);

  // For refresh token endpoint, add X-Refresh-Token header but don't try to refresh again if it fails
  if (isRefreshTokenEndpoint(req.url)) {
    return from(addRefreshTokenHeader(req, storageService)).pipe(
      switchMap((authReq) => next(authReq))
    );
  }

  // Skip auth for login, register, and password reset endpoints
  if (isAuthEndpoint(req.url)) {
    return next(req);
  }

  // Clone request with auth headers
  const cloneRequestWithToken = (token: string | null) => {
    const bearerToken = token ? `Bearer ${token}` : '';
    return req.clone({
      setHeaders: {
        Authorization: bearerToken,
        [X_REFRESH_TOKEN_KEY]: storageService.getRefreshToken() || '',
      },
    });
  };

  const accessToken = storageService.getAuthToken();
  const authReq = accessToken ? cloneRequestWithToken(accessToken) : req;

  return next(authReq).pipe(
    catchError((error) => {
      if (
        error instanceof HttpErrorResponse &&
        error.status === 401 &&
        !isRefreshTokenEndpoint(req.url) &&
        !isAuthEndpoint(req.url)
      ) {
        if (!isRefreshing) {
          // Start refresh process
          isRefreshing = true;
          refreshTokenSubject.next(null);

          return authService.refreshAuthToken().pipe(
            switchMap(() => {
              const newToken = authService.token();
              if (newToken) {
                refreshTokenSubject.next(newToken);
                const retryRequest = cloneRequestWithToken(newToken);
                return next(retryRequest);
              }
              return throwError(() => new Error('Failed to get new token'));
            }),
            catchError((err) => {
              authService.logout();
              return throwError(() => err);
            }),
            finalize(() => {
              isRefreshing = false;
            })
          );
        } else {
          // Wait for the ongoing refresh to complete
          return refreshTokenSubject.pipe(
            filter((token): token is string => token !== null),
            take(1),
            switchMap((token) => {
              const retryRequest = cloneRequestWithToken(token);
              return next(retryRequest);
            })
          );
        }
      }

      return throwError(() => error);
    })
  );
};

async function addRefreshTokenHeader(
  req: HttpRequest<any>,
  storageService: StorageService
): Promise<HttpRequest<any>> {
  // Only add X-Refresh-Token header for refresh token endpoint
  const token = storageService.getRefreshToken();
  const bearerToken = token ? `Bearer ${token}` : '';
  return req.clone({
    setHeaders: {
      Authorization: bearerToken,
      [X_REFRESH_TOKEN_KEY]: storageService.getRefreshToken() || '',
    },
  });
}

function isRefreshTokenEndpoint(url: string): boolean {
  return url.includes('/auth/refresh-token');
}

function isAuthEndpoint(url: string): boolean {
  const authEndpoints = [
    '/auth/login',
    '/auth/register',
    '/auth/request-password-reset',
    '/auth/reset-password',
  ];

  return authEndpoints.some((endpoint) => url.includes(endpoint));
}
