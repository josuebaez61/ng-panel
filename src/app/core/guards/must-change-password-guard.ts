import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth-service';
import { RoutePath } from '../constants/routes';

// Guard for must-change-password route
export const mustChangePasswordGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Check if user is authenticated
  if (!authService.isAuthenticated()) {
    router.navigate(['/auth/login']);
    return false;
  }

  // Check if user data is available
  const currentUser = authService.currentUser();
  if (!currentUser) {
    // If no user data, try to hydrate it
    authService.hydrateUserData();
    return true; // Allow access while hydrating
  }

  // Check if user must change password
  if (!currentUser!.mustChangePassword) {
    // If user doesn't need to change password, redirect to dashboard
    router.navigate([RoutePath.DASHBOARD]);
    return false;
  }

  return true;
};
