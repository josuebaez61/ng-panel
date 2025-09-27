import { Role } from './role-models';

export interface ListUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  userName: string;
  profilePicture?: string;
  isActive: boolean;
  emailConfirmed: boolean;
  createdAt: string;
  updatedAt?: string;
  roles?: Role[];
}

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  userName: string;
  profilePicture?: string;
  isActive: boolean;
  emailConfirmed: boolean;
  createdAt: string;
  updatedAt?: string;
}

export interface CreateUserRequest {
  firstName: string | null;
  lastName: string | null;
  email: string | null;
  userName: string | null;
  dateOfBirth?: Date | null;
  profilePicture?: string | null;
  roleIds?: string[] | null;
}

export interface UpdateUserRequest {
  firstName?: string | null;
  lastName?: string | null;
  email?: string | null;
  userName?: string | null;
  isActive?: boolean | null;
  roleIds?: string[] | null;
}
