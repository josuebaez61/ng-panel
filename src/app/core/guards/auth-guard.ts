import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth-service';
import { StorageService } from '../services/storage-service';
import { map, catchError, of } from 'rxjs';
import { RoutePath } from '../constants/routes';

// Helper function to handle user data validation
const handleUserValidation = (authService: AuthService, router: Router, user: any) => {
  // Check if user must change password
  if (user?.mustChangePassword) {
    router.navigate([RoutePath.MUST_CHANGE_PASSWORD]);
    return false;
  }
  return true;
};

// Helper function to handle auth errors
const handleAuthError = (authService: AuthService, router: Router, error?: any) => {
  if (error) {
    console.error('Auth error:', error);
  }
  authService.logout();
  router.navigate([RoutePath.LOGIN]);
  return of(false);
};

// Functional guard using Angular 17+ syntax
export const authGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const storageService = inject(StorageService);

  // Check if user has valid tokens
  const token = storageService.getAuthToken();
  const refreshToken = storageService.getRefreshToken();

  if (!token || !refreshToken) {
    router.navigate([RoutePath.LOGIN]);
    return false;
  }

  // If token is expired, try to refresh
  if (authService.isTokenExpired()) {
    return authService.refreshAuthToken().pipe(
      map((response) => {
        if (response.success) {
          // User data is already updated in refreshAuthToken
          const currentUser = authService.currentUser();
          return handleUserValidation(authService, router, currentUser);
        }
        return false;
      }),
      catchError(() => handleAuthError(authService, router))
    );
  }

  // Get current user data to check mustChangePassword
  return authService.getCurrentUser().pipe(
    map((response) => {
      if (response.success) {
        return handleUserValidation(authService, router, response.data);
      }
      return false;
    }),
    catchError((error) => handleAuthError(authService, router, error))
  );
};
