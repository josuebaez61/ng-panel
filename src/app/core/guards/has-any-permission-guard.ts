import { inject } from '@angular/core';
import { PermissionName } from '../models/permission-models';
import { AuthService } from '../services';
import { CanActivateFn, Router } from '@angular/router';
import { RoutePath } from '../constants';

export const hasAnyPermissionGuard: (permissions: PermissionName[]) => CanActivateFn =
  (permissions: PermissionName[]) => () => {
    const authService = inject(AuthService);
    const router = inject(Router);
    const user = authService.currentUser();

    if (!user) {
      return router.createUrlTree([RoutePath.LOGIN]);
    }

    if (!user.hasAnyPermission(permissions)) {
      return router.createUrlTree([RoutePath.HOME]);
    }

    return true;
  };
