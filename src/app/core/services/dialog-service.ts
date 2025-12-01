import { inject, Injectable, Type } from '@angular/core';
import {
  RoleFormDialogData,
  Role,
  UsersSelectionDialogData,
  User,
  UserOption,
  Person,
} from '@core/models';
import { TranslateService } from '@ngx-translate/core';
import { ChangeEmailDialog } from '@shared/dialogs/change-email-dialog/change-email-dialog';
import { ChangePasswordDialog } from '@shared/dialogs/change-password-dialog/change-password-dialog';
import { PersonFormDialog } from '@shared/dialogs/person-form-dialog/person-form-dialog';
import { RoleFormDialog } from '@shared/dialogs/role-form-dialog/role-form-dialog';
import { UserFormDialog } from '@shared/dialogs/user-form-dialog/user-form-dialog';
import { UserSelectionDialog } from '@shared/dialogs/user-selection-dialog/user-selection-dialog';
import {
  DynamicDialogConfig,
  DynamicDialogRef,
  DialogService as PrimeDialogService,
} from 'primeng/dynamicdialog';

@Injectable({
  providedIn: 'root',
})
export class DialogService {
  private readonly translateService = inject(TranslateService);
  private readonly defaultConfig: DynamicDialogConfig = {
    width: '40rem',
    height: 'auto',
    header: '',
    footer: '',
    modal: true,
    closable: true,
  };
  private readonly _dialog = inject(PrimeDialogService);

  private open<T>(component: Type<T>, config: DynamicDialogConfig): DynamicDialogRef<T> {
    return this._dialog.open(component, {
      ...this.defaultConfig,
      ...config,
    });
  }

  public openUserFormDialog(user?: User): DynamicDialogRef<UserFormDialog> {
    return this.open(UserFormDialog, {
      header: !!user
        ? this.translateService.instant('users.form.editUser')
        : this.translateService.instant('users.form.addUser'),
      data: {
        user,
      },
    });
  }

  public openRoleFormDialog(role?: Role) {
    return this.open(RoleFormDialog, {
      header: !!role
        ? this.translateService.instant('roles.form.editRole')
        : this.translateService.instant('roles.form.addRole'),
      data: {
        role,
      },
    });
  }

  public openUsersSelectionDialog(
    data: UsersSelectionDialogData
  ): DynamicDialogRef<UserSelectionDialog> {
    return this.open<UserSelectionDialog>(UserSelectionDialog, {
      header: this.translateService.instant('users.userSelection.title'),
      data,
      width: '25rem',
    });
  }

  public openChangePasswordDialog(): DynamicDialogRef<ChangePasswordDialog> {
    return this.open(ChangePasswordDialog, {
      header: this.translateService.instant('auth.changePassword.title'),
    });
  }

  public openChangeEmailDialog(): DynamicDialogRef<ChangeEmailDialog> {
    return this.open(ChangeEmailDialog, {
      header: this.translateService.instant('auth.changeEmail.title'),
    });
  }

  public openPersonFormDialog(user: User, person?: Person): DynamicDialogRef<PersonFormDialog> {
    return this.open(PersonFormDialog, {
      header: !!person
        ? this.translateService.instant('people.form.editPerson')
        : this.translateService.instant('people.form.addPerson'),
      data: {
        person,
        user,
      },
      styleClass: 'person-form-dialog',
    });
  }
}
