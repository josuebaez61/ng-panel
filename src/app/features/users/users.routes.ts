import { RouteName } from '@core/constants/routes';

export const routes = [
  {
    path: '', // empty path for the users route
    loadComponent: () => import('./users').then((m) => m.Users),
    title: 'Users - Admin Panel',
  },
  // {
  //   path: RouteName.USERS_CREATE,
  //   loadComponent: () => import('./view-user/view-user').then((m) => m.ViewUser),
  //   title: 'Create User - Admin Panel',
  // },
  // {
  //   path: RouteName.USERS_VIEW(':id'),
  //   loadComponent: () => import('./view-user/view-user').then((m) => m.ViewUser),
  //   title: 'User - Admin Panel',
  // },
  // {
  //   path: RouteName.USERS_EDIT(':id'),
  //   loadComponent: () => import('./view-user/view-user').then((m) => m.ViewUser),
  //   title: 'Edit User - Admin Panel',
  // },
];
