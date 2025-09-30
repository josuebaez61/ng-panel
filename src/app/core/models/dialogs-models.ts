import { Observable } from 'rxjs';
import { Role } from './role-models';
import { User, UserOption } from '.';
import { Signal } from '@angular/core';

export interface UserFormDialogData {
  user?: User;
}

export interface RoleDialogData {
  role?: Role;
}

export interface ConfirmDialogData {
  message?: string;
}

export interface UnsavedChangesDialogData {
  saveCallback?: () => Observable<any> | Promise<any>;
  discardCallback?: () => Observable<any> | Promise<any>;
}

export interface UsersSelectionDialogData {
  users: UserOption[];
}
