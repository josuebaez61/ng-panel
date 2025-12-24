export const routes = [
  {
    path: '', // empty path for the users route
    loadComponent: () => import('./users').then((m) => m.Users),
    title: 'Users - Admin Panel',
  },
];
