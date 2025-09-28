import { inject, Injectable, Type } from '@angular/core';
import { RoleDialogData, Role, UsersSelectionDialogData, User } from '@core/models';
import { TranslateService } from '@ngx-translate/core';
import { UserFormDialog } from '@shared/dialogs/user-form-dialog/user-form-dialog';
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

  public openRoleDialog(role?: Role) {}

  public openUsersSelectionDialog(data: UsersSelectionDialogData): void {}
}
