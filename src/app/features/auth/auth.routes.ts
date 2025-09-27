import { Routes } from '@angular/router';
import { RouteName } from '@core/constants';
import { guestGuard, mustChangePasswordGuard } from '@core/guards';

export const routes: Routes = [
  {
    path: RouteName.LOGIN,
    canActivate: [guestGuard],
    loadComponent: () => import('./login/login').then((m) => m.Login),
    title: 'Login - Admin Panel',
  },
  {
    path: RouteName.FORGOT_PASSWORD,
    canActivate: [guestGuard],
    loadComponent: () => import('./forgot-password/forgot-password').then((m) => m.ForgotPassword),
    title: 'Forgot Password - Admin Panel',
  },
  {
    path: RouteName.MUST_CHANGE_PASSWORD,
    canActivate: [mustChangePasswordGuard],
    loadComponent: () =>
      import('./must-change-password/must-change-password').then((m) => m.MustChangePassword),
    title: 'Must Change Password - Admin Panel',
  },
  {
    path: RouteName.RESET_PASSWORD,
    canActivate: [guestGuard],
    loadComponent: () => import('./reset-password/reset-password').then((m) => m.ResetPassword),
    title: 'Reset Password - Admin Panel',
  },
  {
    path: '',
    redirectTo: RouteName.LOGIN,
    pathMatch: 'full',
  },
];
