import { RouteName } from '@core/constants';
import { unsavedChangesGuard } from '@core/guards/unsaved-changes-guard';
import { Roles } from './roles';

export const routes = [
  {
    path: '',
    component: Roles,
  },
  {
    path: RouteName.ROLES_PERMISSIONS(':id'),
    canDeactivate: [unsavedChangesGuard],
    loadComponent: () =>
      import('./role-permissions/role-permissions').then((m) => m.RolePermissions),
  },
  {
    path: RouteName.ROLES_USERS(':id'),
    canDeactivate: [unsavedChangesGuard],
    loadComponent: () => import('./role-users/role-users').then((m) => m.RoleUsers),
  },
];
