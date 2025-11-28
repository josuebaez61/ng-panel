import { Role } from './role-models';

export interface User {
  id: string;
  email: string;
  username: string;
  person?: Person;
  isActive: boolean;
  createdAt: string;
  updatedAt?: string;
}

export interface Person {
  id: string;
  firstName: string;
  lastName: string;
  phone: string | null;
  identificationNumber: string;
  identificationType: string;
  picture: string | null;
  createdAt: string;
  updatedAt?: string;
}

export interface ListUser extends User {
  roles?: Role[];
}

export type UserOption = {
  id: string;
  username: string;
  person: {
    firstName: string;
    lastName: string;
  };
};

export interface CreateUserRequest {
  firstName: string | null;
  lastName: string | null;
  email: string | null;
  username: string | null;
  roleIds?: string[] | null;
  person?: {
    firstName: string | null;
    lastName: string | null;
    phone: string | null;
    identificationNumber: string | null;
    identificationType: string | null;
    picture: string | null;
  };
}

export type UpdateUserRequest = Partial<CreateUserRequest>;
