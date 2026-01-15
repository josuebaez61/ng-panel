export enum PermissionName {
  // Role permissions
  CREATE_ROLE = 'createRole',
  READ_ROLE = 'readRole',
  UPDATE_ROLE = 'updateRole',
  DELETE_ROLE = 'deleteRole',
  ASSIGN_ROLE = 'assignRole',
  ASSIGN_PERMISSION = 'assignPermission',

  // Permission permissions
  READ_PERMISSION = 'readPermission',

  // User permissions
  CREATE_USER = 'createUser',
  READ_USER = 'readUser',
  UPDATE_USER = 'updateUser',
  DELETE_USER = 'deleteUser',

  // User Address permissions
  CREATE_USER_ADDRESS = 'createUserAddress',
  READ_USER_ADDRESS = 'readUserAddress',
  UPDATE_USER_ADDRESS = 'updateUserAddress',
  DELETE_USER_ADDRESS = 'deleteUserAddress',

  // API Key permissions
  CREATE_API_KEY = 'createApiKey',
  READ_API_KEY = 'readApiKey',
  UPDATE_API_KEY = 'updateApiKey',
  DELETE_API_KEY = 'deleteApiKey',

  // Company permissions
  CREATE_COMPANY = 'createCompany',
  READ_COMPANY = 'readCompany',
  UPDATE_COMPANY = 'updateCompany',
  DELETE_COMPANY = 'deleteCompany',

  // Company Settings permissions
  CREATE_COMPANY_SETTINGS = 'createCompanySettings',
  READ_COMPANY_SETTINGS = 'readCompanySettings',
  UPDATE_COMPANY_SETTINGS = 'updateCompanySettings',
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
  API_KEY = 'apiKey',
  COMPANY_SETTINGS = 'companySettings',
}
