export enum PermissionName {
  // Role permissions
  CreateRole = 'create_role',
  ReadRole = 'read_role',
  UpdateRole = 'update_role',
  DeleteRole = 'delete_role',
  AssignRole = 'assign_role',
  AssignPermission = 'assign_permission',

  // Permission permissions
  ReadPermission = 'read_permission',

  // User permissions
  CreateUser = 'create_user',
  ReadUser = 'read_user',
  UpdateUser = 'update_user',
  DeleteUser = 'delete_user',

  // Special permissions
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
