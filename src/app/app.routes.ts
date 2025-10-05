import { Routes } from '@angular/router';
import { RouteName, RoutePath } from '@core/constants';
import {
  authGuard,
  guestGuard,
  hasAnyPermissionGuard,
  mustChangePasswordGuard,
} from '@core/guards';
import { PermissionName } from '@core/models';

export const routes: Routes = [
  // Redirect root to dashboard
  {
    path: '',
    redirectTo: RoutePath.HOME,
    pathMatch: 'full',
  },
  // Auth routes (guest only)
  {
    path: RouteName.AUTH,
    loadChildren: () => import('./features/auth/auth.routes').then((m) => m.routes),
  },
  // Main application routes (protected)
  {
    path: RouteName.PANEL,
    canActivate: [authGuard],
    loadComponent: () => import('./shared/layouts/panel/panel').then((m) => m.Panel),
    children: [
      {
        path: RouteName.HOME,
        loadComponent: () => import('./features/home/home').then((m) => m.Home),
        title: 'Dashboard - Admin Panel',
        children: [],
      },
      {
        path: RouteName.USERS,
        canActivate: [hasAnyPermissionGuard([PermissionName.ManageUsers])],
        loadChildren: () => import('./features/users/users.routes').then((m) => m.routes),
      },
      {
        path: RouteName.ROLES,
        canActivate: [
          hasAnyPermissionGuard([PermissionName.ManageRoles, PermissionName.ManageUserRoles]),
        ],
        loadChildren: () => import('./features/roles/roles.routes').then((m) => m.routes),
        title: 'Roles - Admin Panel',
      },
    ],
  },

  // 404 - Page not found
  {
    path: '**',
    loadComponent: () => import('./shared/components/not-found/not-found').then((m) => m.NotFound),
    title: 'Page Not Found - Admin Panel',
  },
];
