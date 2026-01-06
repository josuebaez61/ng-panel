import { Person } from './user-models';

export interface AuthUserDto {
  id: string;
  username: string;
  email: string;
  person: Person;
  createdAt: string;
  updatedAt?: string;
  isActive: boolean;
  mustChangePassword: boolean;
  permissions: string[];
  roles: string[];
  resources: string[];
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: AuthUserDto;
}

export interface LoginRequest {
  usernameOrEmail: string;
  password: string;
}

export interface RegisterRequest {
  firstName: string;
  lastName: string;
  email: string;
  userName: string;
  password: string;
  dateOfBirth: string;
  profilePicture?: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface PasswordResetRequest {
  email: string;
}

export interface ResetPasswordRequest {
  code: string;
  newPassword: string;
}

export interface EmailChangeRequest {
  newEmail: string;
}

export interface EmailVerificationRequest {
  verificationCode: string;
}

export interface CurrentUserResponse {
  success: boolean;
  message: string;
  data: AuthUserDto;
  timestamp: string;
}

export class AuthUser {
  public id: string;
  public email: string;
  public username: string;
  public person: Person;
  public createdAt: string;
  public updatedAt?: string;
  public isActive: boolean;
  public mustChangePassword: boolean;
  private permissions: Set<string>;
  public roles: Set<string>;
  public resources: Set<string>;

  constructor(data: AuthUserDto) {
    this.id = data.id;
    this.email = data.email;
    this.username = data.username;
    this.person = data.person;
    this.createdAt = data.createdAt;
    this.updatedAt = data.updatedAt;
    this.isActive = data.isActive;
    this.mustChangePassword = data.mustChangePassword;
    this.permissions = new Set(data.permissions);
    this.roles = new Set(data.roles);
    this.resources = new Set(data.resources);
  }

  public hasPermission(permission: string): boolean {
    return this.permissions.has(permission);
  }

  public hasAllPermissions(permissions: string[]): boolean {
    return permissions.every((permission) => this.hasPermission(permission));
  }

  public hasAnyPermission(permissions: string[]): boolean {
    return permissions.some((permission) => this.hasPermission(permission));
  }

  public hasRole(role: string): boolean {
    return this.roles.has(role);
  }

  public hasResource(resource: string): boolean {
    return this.resources.has(resource);
  }

  public hasAnyResource(resources: string[]): boolean {
    return resources.some((resource) => this.hasResource(resource));
  }
}
