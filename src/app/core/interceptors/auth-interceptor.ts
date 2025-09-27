import { HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';
import { Observable, from, switchMap, catchError, throwError } from 'rxjs';
import { AuthService } from '../services/auth-service';
import { StorageService } from '../services/storage-service';

export const authInterceptor: HttpInterceptorFn = (req: HttpRequest<any>, next) => {
  const authService = inject(AuthService);
  const storageService = inject(StorageService);

  // Skip auth for login, register, and password reset endpoints
  if (isAuthEndpoint(req.url)) {
    return next(req);
  }

  return from(addAuthHeader(req, storageService)).pipe(
    switchMap((authReq) => {
      return next(authReq).pipe(
        catchError((error) => {
          // If 401 and we have a refresh token, try to refresh
          if (error.status === 401 && storageService.getRefreshToken()) {
            return handleTokenRefresh(req, next, authService, storageService);
          }
          return throwError(() => error);
        })
      );
    })
  );
};

async function addAuthHeader(
  req: HttpRequest<any>,
  storageService: StorageService
): Promise<HttpRequest<any>> {
  const token = storageService.getAuthToken();
  const bearerToken = token ? `Bearer ${token}` : '';

  return req.clone({
    setHeaders: {
      Authorization: bearerToken,
      'X-Refresh-Token': storageService.getRefreshToken() || '',
    },
  });

  return req;
}

function handleTokenRefresh(
  req: HttpRequest<any>,
  next: any,
  authService: AuthService,
  storageService: StorageService
): Observable<any> {
  return authService.refreshAuthToken().pipe(
    switchMap(() => {
      const newToken = authService.token();
      const authReq = req.clone({
        setHeaders: {
          Authorization: `Bearer ${newToken}`,
          'X-Refresh-Token': storageService.getRefreshToken() || '',
        },
      });
      return next(authReq);
    }),
    catchError((error) => {
      authService.logout();
      return throwError(() => error);
    })
  );
}

function isAuthEndpoint(url: string): boolean {
  const authEndpoints = [
    '/auth/login',
    '/auth/register',
    '/auth/refresh-token',
    '/auth/request-password-reset',
    '/auth/reset-password',
  ];

  return authEndpoints.some((endpoint) => url.includes(endpoint));
}
