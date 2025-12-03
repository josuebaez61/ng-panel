import { RouteName } from '@core/constants';
import { unsavedChangesGuard } from '@core/guards/unsaved-changes-guard';
import { Roles } from './roles';
import { hasAllPermissionsGuard } from '@core/guards';
import { PermissionName } from '@core/models';

export const routes = [
  {
    path: '',
    component: Roles,
  },
  {
    path: RouteName.ROLES_PERMISSIONS(':id'),
    canDeactivate: [
      unsavedChangesGuard,
      hasAllPermissionsGuard([PermissionName.ASSIGN_PERMISSION]),
    ],
    loadComponent: () =>
      import('./role-permissions/role-permissions').then((m) => m.RolePermissions),
  },
  {
    path: RouteName.ROLES_USERS(':id'),
    canDeactivate: [hasAllPermissionsGuard([PermissionName.ASSIGN_ROLE])],
    loadComponent: () => import('./role-users/role-users').then((m) => m.RoleUsers),
  },
];
