export enum PermissionName {
  // Role permissions
  READ_ROLE = 'readRole',
  WRITE_ROLE = 'writeRole',
  ASSIGN_ROLE = 'assignRole',
  ASSIGN_PERMISSION = 'assignPermission',

  // Permission permissions
  READ_PERMISSION = 'readPermission',

  // User permissions
  READ_USER = 'readUser',
  WRITE_USER = 'writeUser',

  // User Address permissions
  READ_USER_ADDRESS = 'readUserAddress',
  WRITE_USER_ADDRESS = 'writeUserAddress',

  // API Key permissions
  READ_API_KEY = 'readApiKey',
  WRITE_API_KEY = 'writeApiKey',

  // Company permissions
  READ_COMPANY = 'readCompany',
  WRITE_COMPANY = 'writeCompany',

  // Company Settings permissions
  READ_COMPANY_SETTINGS = 'readCompanySettings',
  WRITE_COMPANY_SETTINGS = 'writeCompanySettings',
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
