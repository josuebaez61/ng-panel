import { Role } from './role-models';

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

export interface ListUser extends User {
  roles?: Role[];
}

export type UserOption = Pick<User, 'id' | 'firstName' | 'lastName' | 'userName'>;

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
