import { Role } from './role-models';
import { User, UserOption } from '.';

export interface UserFormDialogData {
  user?: User;
}

export interface RoleFormDialogData {
  role?: Role;
}

export interface ConfirmDialogData {
  message?: string;
}

export interface UnsavedChangesDialogData {
  message?: string;
  title?: string;
  saveButtonText?: string;
  discardButtonText?: string;
}

export interface UnsavedChangesOptions extends UnsavedChangesDialogData {
  saveCallback?: () => void;
  discardCallback?: () => void;
}

export interface UsersSelectionDialogData {
  users: UserOption[];
}
