export enum PermissionName {
  ManageRoles = 'manage.roles',
  ManageUsers = 'manage.users',
  ManageUserRoles = 'manage.user.roles',
  ManageRolePermissions = 'manage.role.permissions',
  Admin = 'admin',
  SuperAdmin = 'superAdmin',
}

export interface Permission {
  id: string;
  name: PermissionName;
  description: string;
  resource: string;
  createdAt: string;
  updatedAt: string;
}
export interface ResourcePermissions {
  resource: string;
  order: number;
  permissions: Permission[];
}
