import { PermissionName } from './permission-models';

export interface AuthUserDto {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  userName: string;
  dateOfBirth: string;
  profilePicture?: string;
  createdAt: string;
  updatedAt?: string;
  isActive: boolean;
  emailConfirmed: boolean;
  mustChangePassword: boolean;
  permissions: string[];
  roles: string[];
}

export interface AuthResponse {
  token: string;
  refreshToken: string;
  expiresAt: string;
  user: AuthUserDto;
}

export interface LoginRequest {
  emailOrUsername: string;
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
  public firstName: string;
  public lastName: string;
  public email: string;
  public userName: string;
  public dateOfBirth: string;
  public profilePicture?: string;
  public createdAt: string;
  public updatedAt?: string;
  public isActive: boolean;
  public emailConfirmed: boolean;
  public mustChangePassword: boolean;
  private permissions: Set<string>;
  public roles: Set<string>;

  constructor(data: AuthUserDto) {
    this.id = data.id;
    this.firstName = data.firstName;
    this.lastName = data.lastName;
    this.email = data.email;
    this.userName = data.userName;
    this.dateOfBirth = data.dateOfBirth;
    this.profilePicture = data.profilePicture;
    this.createdAt = data.createdAt;
    this.updatedAt = data.updatedAt;
    this.isActive = data.isActive;
    this.emailConfirmed = data.emailConfirmed;
    this.mustChangePassword = data.mustChangePassword;
    this.permissions = new Set(data.permissions);
    this.roles = new Set(data.roles);
  }

  public hasPermission(permission: string): boolean {
    return (
      this.permissions.has(permission) ||
      this.permissions.has(PermissionName.Admin) ||
      this.permissions.has(PermissionName.SuperAdmin)
    );
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
}
