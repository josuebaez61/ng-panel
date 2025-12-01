export enum PermissionName {
  CREATE_ROLE = 'create_role',
  READ_ROLE = 'read_role',
  UPDATE_ROLE = 'update_role',
  DELETE_ROLE = 'delete_role',
  ASSIGN_ROLE = 'assign_role',
  ASSIGN_PERMISSION = 'assign_permission',

  // Permission permissions
  READ_PERMISSION = 'read_permission',

  // User permissions
  CREATE_USER = 'create_user',
  READ_USER = 'read_user',
  UPDATE_USER = 'update_user',
  DELETE_USER = 'delete_user',

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

export enum ResourceName {
  ROLE = 'role',
  PERMISSION = 'permission',
  USER = 'user',
}
