import { RouteName } from '@core/constants';
import { ApiKeys } from './api-keys';

export const routes = [
  {
    path: '',
    component: ApiKeys,
  },
  {
    path: RouteName.API_KEYS_PERMISSIONS(':id'),
    loadComponent: () =>
      import('./api-key-permissions/api-key-permissions').then((m) => m.ApiKeyPermissions),
  },
];

